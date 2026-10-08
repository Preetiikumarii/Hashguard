from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.exceptions import CEEException, cee_exception_handler
from app.database.database import engine, Base
from app.api.routes import auth, evidence, custody, transfers, lineage, verification, audit, ai

from app.models.organization import Organization
from app.models.user import User
from app.models.evidence import Evidence
from app.models.custody_event import CustodyEvent
from app.models.transfer import Transfer
from app.models.audit_log import AuditLog
from app.models.retention import RetentionPolicy, RetentionEvent

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs"
)

@app.on_event("startup")
def startup_event():
    try:
        from app.database.init_db import init_db
        init_db()
    except Exception as e:
        print(f"Database seed initialization failed: {e}")

    try:
        from app.blockchain.evm_client import evm_client
        evm_client.connect_and_deploy()
        
        from app.core.scheduler import start_scheduler
        start_scheduler()
    except Exception as e:
        print(f"Startup initialization failed: {e}")

# ─────────────────────────────────────────────────────────────────────────────
# CORS: explicitly list all trusted origins + a wildcard regex fallback.
# NOTE: allow_credentials=True is INCOMPATIBLE with allow_origins=["*"].
# We list specific origins and also cover all *.vercel.app previews via regex.
# ─────────────────────────────────────────────────────────────────────────────
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    # Production Vercel deployment
    "https://hash-guard-ecru.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    # Also allow any *.vercel.app preview deploy and localhost variants
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$|^https://.*\.vercel\.app$|^https://.*\.netlify\.app$",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.add_exception_handler(CEEException, cee_exception_handler)

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(evidence.router, prefix=f"{settings.API_V1_STR}/evidence", tags=["evidence"])
app.include_router(custody.router, prefix=f"{settings.API_V1_STR}/custody", tags=["custody"])
app.include_router(transfers.router, prefix=f"{settings.API_V1_STR}/transfers", tags=["transfers"])
app.include_router(lineage.router, prefix=f"{settings.API_V1_STR}/lineage", tags=["lineage"])
app.include_router(verification.router, prefix=f"{settings.API_V1_STR}/verification", tags=["verification"])
app.include_router(audit.router, prefix=f"{settings.API_V1_STR}/audit", tags=["audit"])
app.include_router(ai.router, prefix=f"{settings.API_V1_STR}/ai", tags=["ai"])

from app.api.routes import retention
app.include_router(retention.router, prefix=f"{settings.API_V1_STR}/admin/retention", tags=["retention"])

@app.get(f"{settings.API_V1_STR}/health")
def health_check():
    return {"status": "ok", "environment": settings.ENVIRONMENT}
