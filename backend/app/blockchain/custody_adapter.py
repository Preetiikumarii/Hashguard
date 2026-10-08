from app.blockchain.fabric_client import fabric_client

class CustodyAdapter:
    @staticmethod
    def commit_event(event_data: dict) -> str:
        """
        Commits a custody event to the shared audit ledger.
        """
        import json
        event_json = json.dumps(event_data)
        tx_id = fabric_client.submit_transaction("RecordEvent", event_json)
        return tx_id

    @staticmethod
    def get_event(event_id: str) -> dict:
        """
        Retrieves a custody event from the shared audit ledger.
        """
        result = fabric_client.query("GetEvent", event_id)
        return result
