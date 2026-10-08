# Cyber Evidence Exchange - API Contract

This document defines the exact contract required by the existing React frontend.
The frontend uses an Axios client configured to talk to `http://localhost:8000/api/v1` (with fallback to mocks if disabled).

### Global Headers
All API calls from the frontend include:
- `Authorization: Bearer <jwt_token>`
- `X-Organization-ID: <org_id>`

---

## 1. Evidence API

### `GET /api/v1/evidence`
- **Method**: GET
- **Query Params**: `search` (string), `status` (string), `type` (string), `organization` (string)
- **Response**: Array of `Evidence` objects.
- **Frontend Screen**: Dashboard, Evidence List

### `GET /api/v1/evidence/{id}`
- **Method**: GET
- **Response**: `Evidence` object.
- **Frontend Screen**: Evidence Details

### `POST /api/v1/evidence`
- **Method**: POST
- **Request Body**: 
  ```json
  {
    "title": "string",
    "type": "string",
    "sourceOrg": "string",
    "currentCustodian": "string",
    "hash": "string",
    "fileSize": "string",
    "collector": "string",
    "parentEvidenceId": "string (optional)",
    "description": "string"
  }
  ```
- **Response**: Created `Evidence` object.
- **Frontend Screen**: New Evidence Modal

---

## 2. Custody Events API

### `GET /api/v1/custody/events`
- **Method**: GET
- **Query Params**: `evidenceId`, `event`, `organization`, `search`
- **Response**: Array of `CustodyEvent` objects.
- **Frontend Screen**: Custody Page, Dashboard

### `GET /api/v1/custody/events/{evidenceId}`
- **Method**: GET
- **Response**: Array of `CustodyEvent` objects for the specific evidence.
- **Frontend Screen**: Evidence Details

### `POST /api/v1/custody/events`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "evidenceId": "string",
    "event": "string",
    "actor": "string",
    "organization": "string",
    "hash": "string",
    "notes": "string",
    "parentId": "string (optional)"
  }
  ```
- **Response**: Created `CustodyEvent` object.
- **Frontend Screen**: Triggered by various actions (Collect, Seal, Analyze, etc.)

---

## 3. Transfers API

### `GET /api/v1/transfers`
- **Method**: GET
- **Query Params**: `status`, `search`
- **Response**: Array of `Transfer` objects.
- **Frontend Screen**: Transfers Page, Dashboard

### `POST /api/v1/transfers`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "evidenceId": "string",
    "evidenceTitle": "string",
    "evidenceType": "string",
    "fromOrg": "string",
    "fromActor": "string",
    "toOrg": "string",
    "toActor": "string",
    "manifestHash": "string",
    "notes": "string"
  }
  ```
- **Response**: Created `Transfer` object.
- **Frontend Screen**: Initiate Transfer Modal

### `POST /api/v1/transfers/{transferId}/accept`
- **Method**: POST
- **Response**: Updated `Transfer` object (status: VERIFIED, completed steps).
- **Frontend Screen**: Transfer Accept Action

---

## 4. Lineage API

### `GET /api/v1/lineage/{evidenceId}`
- **Method**: GET
- **Response**: Lineage Graph
  ```json
  {
    "evidenceId": "string",
    "nodes": [ { "id": "...", "type": "lineageNode", "position": {...}, "data": {...} } ],
    "edges": [ { "id": "...", "source": "...", "target": "...", "label": "..." } ]
  }
  ```
- **Frontend Screen**: Lineage Page, Evidence Details Lineage Tab

### `POST /api/v1/lineage/{parentArtifactId}/derive`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "title": "string",
    "type": "string",
    "hash": "string",
    "creator": "string",
    "filename": "string",
    "size": "string"
  }
  ```
- **Response**: `{ "node": {...}, "edge": {...} }`
- **Frontend Screen**: Derive Artifact Modal

### `POST /api/v1/lineage/{evidenceId}/verify`
- **Method**: POST
- **Response**:
  ```json
  {
    "evidenceId": "string",
    "overallStatus": "LINEAGE VALID",
    "checks": [ { "name": "...", "status": "...", "details": "..." } ],
    "verifiedAt": "datetime",
    "auditorId": "string"
  }
  ```
- **Frontend Screen**: Lineage Verification Action

---

## 5. Verification API

### `POST /api/v1/verification/verify`
- **Method**: POST
- **Request Body**: `{ "identifier": "string (evidence id)" }`
- **Response**: 
  ```json
  {
    "identifier": "string",
    "overallStatus": "VERIFIED | COMPROMISED",
    "tamperDetected": boolean,
    "verifiedAt": "datetime",
    "auditorId": "string",
    "onChainBlock": number,
    "checks": [
      {
        "key": "hash_integrity",
        "title": "HASH INTEGRITY",
        "status": "PASS | FAILED",
        "expected": "string",
        "actual": "string",
        "description": "string"
      }
    ]
  }
  ```
- **Frontend Screen**: Independent Verification Page

---

## 6. Audit Logs API

### `GET /api/v1/audit`
- **Method**: GET
- **Query Params**: `event`, `organization`, `search`
- **Response**: Array of `AuditLog` objects.
- **Frontend Screen**: Audit Logs Page

---

## Notes on Models

The frontend expects specific field names to be present. The backend schemas (e.g. Pydantic) should ideally use camelCase to match the frontend expectations, or the backend should serialize snake_case DB columns to camelCase JSON responses.

**Example `Evidence` model expected by frontend:**
- `id` (e.g., "EV-001")
- `title`
- `type`
- `sourceOrg`
- `currentCustodian`
- `hash`
- `expectedHash`
- `hashAlgorithm`
- `status`
- `fileSize`
- `collector`
- `createdAt`
- `lastEvent`
- `lastEventTime`
- `storageType`
- `storageLocation`
- `accessControl`
- `blockchainStatus`
- `blockNumber`
- `txHash`
- `signature`: `{ status, signer, algorithm, publicKeyFingerprint, signedTimestamp, manifestId }`
- `parentEvidenceId`
- `isDerived`
- `derivedCount`
- `description`
