from apscheduler.schedulers.background import BackgroundScheduler
import datetime
from app.database.database import SessionLocal
from app.models.evidence import Evidence
from app.models.retention import RetentionEvent, RetentionPolicy
from app.blockchain.evm_client import evm_client
from app.storage.minio_client import minio_client
from app.core.config import settings

def run_retention_sweep():
    print("Running daily retention sweep...")
    db = SessionLocal()
    try:
        now = datetime.datetime.utcnow()
        
        # 1. Find evidence expiring soon (within 14 days)
        warning_threshold = now + datetime.timedelta(days=14)
        expiring_soon = db.query(Evidence).filter(
            Evidence.retention_status == 'active',
            Evidence.retention_expires_at != None,
            Evidence.retention_expires_at <= warning_threshold
        ).all()
        
        for ev in expiring_soon:
            ev.retention_status = 'expiring_soon'
            event = RetentionEvent(
                evidence_id=ev.id,
                event_type='expiry_warning_sent',
                reason='Automated 14-day expiry warning'
            )
            db.add(event)
            print(f"Retention warning sent for {ev.id}")

        # 2. Find expired evidence
        expired = db.query(Evidence).filter(
            Evidence.retention_status.in_(['active', 'expiring_soon']),
            Evidence.retention_expires_at != None,
            Evidence.retention_expires_at <= now
        ).all()
        
        for ev in expired:
            policy = db.query(RetentionPolicy).filter(RetentionPolicy.id == ev.retention_policy_id).first()
            if not policy: continue
            
            # TODO: check case_status != closed if applicable in your domain model
            
            action = policy.action_on_expiry
            token_id = evm_client.get_token_id_for_asset(ev.id)
            
            if action == 'delete':
                ev.retention_status = 'deleted'
                event_type = 'deleted'
                
                # Delete from MinIO
                if ev.storage_location and ev.storage_location.startswith('minio://'):
                    object_name = ev.storage_location.split(settings.MINIO_BUCKET + '/')[-1]
                    try:
                        minio_client.remove_object(settings.MINIO_BUCKET, object_name)
                    except Exception as e:
                        print(f"MinIO delete failed: {e}")
                
            elif action == 'archive':
                ev.retention_status = 'archived'
                event_type = 'archived'
                # Mock moving to cold storage
                
            # Log to blockchain
            tx_hash = None
            if token_id:
                receipt = evm_client.log_retention_event(token_id, event_type)
                if receipt:
                    tx_hash = receipt['transactionHash'].hex()
            
            event = RetentionEvent(
                evidence_id=ev.id,
                event_type=event_type,
                reason=f'Automated policy execution: {action}',
                tx_hash=tx_hash
            )
            db.add(event)
            print(f"Executed {action} on {ev.id}")
            
        db.commit()
    except Exception as e:
        print(f"Error in retention sweep: {e}")
        db.rollback()
    finally:
        db.close()

def start_scheduler():
    scheduler = BackgroundScheduler()
    # Run every minute for demo purposes, normally would be days=1
    scheduler.add_job(run_retention_sweep, 'interval', minutes=1)
    scheduler.start()
