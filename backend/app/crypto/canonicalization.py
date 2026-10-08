import json
from typing import Dict, Any

def canonicalize(data: Dict[str, Any]) -> bytes:
    """
    Produce a deterministic JSON serialization of the data dictionary.
    Keys are sorted, no whitespace added.
    """
    return json.dumps(data, sort_keys=True, separators=(',', ':')).encode('utf-8')
