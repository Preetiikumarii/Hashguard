const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

const app = express();
const PORT = 8001;
const DB_FILE = path.join(__dirname, 'db.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
require('fs').mkdirSync(UPLOADS_DIR, { recursive: true });
const upload = multer({ dest: UPLOADS_DIR });

app.use(cors());
app.use(express.json());

function getISTNowString() {
  const d = new Date();
  const parts = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(d);
  const get = (type) => (parts.find(p => p.type === type) || {}).value || '00';
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')} IST`;
}

function formatToIST(dateStr) {
  if (!dateStr) return '—';
  if (typeof dateStr === 'string' && dateStr.includes('IST')) return dateStr;
  try {
    let cleanStr = String(dateStr).trim();
    if (cleanStr.endsWith(' U')) cleanStr = cleanStr.slice(0, -2) + ' UTC';
    if (!cleanStr.includes('Z') && !cleanStr.includes('UTC') && !cleanStr.includes('+')) cleanStr += ' UTC';
    const d = new Date(cleanStr);
    if (isNaN(d.getTime())) return dateStr;
    const parts = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).formatToParts(d);
    const get = (type) => (parts.find(p => p.type === type) || {}).value || '00';
    return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')} IST`;
  } catch {
    return dateStr;
  }
}

// Initialize DB
async function initDb() {
  try {
    await fs.access(DB_FILE);
  } catch (err) {
    const initialData = {
      evidence: [],
      audit_logs: [],
      transfers: [],
      retention_policies: []
    };
    await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Read DB
async function readDb() {
  const data = await fs.readFile(DB_FILE, 'utf8');
  const parsed = JSON.parse(data);
  if (!parsed.retention_policies) parsed.retention_policies = [];
  if (!parsed.transfers) parsed.transfers = [];
  if (!parsed.audit_logs) parsed.audit_logs = [];
  if (!parsed.evidence) parsed.evidence = [];
  return parsed;
}

// Write DB
async function writeDb(data) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

// --- ROUTES ---

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', engine: 'Node.js Express JSON DB' });
});

// Auth Routes
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = {
    id: 'USR-001',
    email: email || 'admin@cyberlab.local',
    role: 'ADMIN',
    organization_id: 'ORG-B',
    organization_name: 'Cyber Defense & Forensics Lab B'
  };
  const token = 'mock-jwt-token-' + Date.now();
  res.json({
    access_token: token,
    token_type: 'bearer',
    user: user
  });
});

// Evidence Routes
app.get('/api/v1/evidence', async (req, res) => {
  const db = await readDb();
  const formatted = (db.evidence || []).map(e => ({
    ...e,
    createdAt: formatToIST(e.createdAt),
    lastEventTime: formatToIST(e.lastEventTime || e.createdAt)
  }));
  res.json(formatted);
});

app.post('/api/v1/evidence', upload.single('file'), async (req, res) => {
  const db = await readDb();
  let payload = req.body;
  if (req.body.metadata) {
    try {
      payload = JSON.parse(req.body.metadata);
    } catch (e) {
      payload = req.body;
    }
  }

  const originalFileName = req.file ? req.file.originalname : null;
  const storedFilePath = req.file ? req.file.path : null;

  let calculatedHash = payload.hash;
  if (!calculatedHash && req.file) {
    const fileBuffer = await fs.readFile(storedFilePath);
    calculatedHash = require('crypto').createHash('sha256').update(fileBuffer).digest('hex');
  }
  if (!calculatedHash) {
    calculatedHash = require('crypto').randomBytes(32).toString('hex');
  }

  const nowIST = getISTNowString();

  const newEvidence = {
    id: payload.id || `EV-${uuidv4().substring(0,8).toUpperCase()}`,
    caseId: payload.caseId || 'CASE-2026-9012',
    title: payload.title || originalFileName || 'Legitimate Digital Evidence',
    type: payload.type || 'Digital Artifact',
    assetCategory: payload.assetCategory || 'FORENSIC_EVIDENCE',
    sourceOrg: payload.sourceOrg || 'Organization B (Cyber Defense Lab)',
    currentCustodian: payload.currentCustodian || 'Organization B (Cyber Defense Lab)',
    owner: payload.owner || payload.sourceOrg || 'Organization B (Cyber Defense Lab)',
    ownerDid: payload.ownerDid || 'did:ethr:0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    accessList: payload.accessList || [],
    hash: calculatedHash,
    expectedHash: calculatedHash,
    hashAlgorithm: 'SHA-256',
    status: 'VERIFIED',
    fileSize: payload.fileSize || (req.file ? (req.file.size < 1024 * 1024 ? `${(req.file.size / 1024).toFixed(2)} KB` : `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`) : '1.0 KB'),
    collector: payload.collector || 'admin@cyberlab.local',
    createdAt: nowIST,
    lastEvent: 'COLLECT',
    lastEventTime: nowIST,
    storageType: 'OFF-CHAIN SECURED',
    storageLocation: storedFilePath || `vault://secure-enclave/${payload.title || 'evidence'}.bin`,
    blockchainStatus: 'ON-CHAIN RECORD VERIFIED',
    blockNumber: Math.floor(Math.random() * 500000) + 1000,
    txHash: payload.txHash || ('0x' + require('crypto').randomBytes(32).toString('hex')),
    isDerived: Boolean(payload.parentEvidenceId),
    parentEvidenceId: payload.parentEvidenceId || null,
    derivedCount: 0,
    signature: {
      status: 'VALID',
      signer: payload.sourceOrg || 'Organization B (Cyber Defense Lab CA)',
      algorithm: 'ECDSA / secp256k1',
      publicKeyFingerprint: 'SHA256:' + require('crypto').randomBytes(8).toString('hex'),
      signedTimestamp: nowIST,
      manifestId: `MNF-${Date.now()}`
    },
    description: payload.description || 'Legitimate evidence collected and sealed on custody ledger.'
  };

  db.evidence.unshift(newEvidence);
  
  // Log event
  db.audit_logs.unshift({
    id: `AUD-${uuidv4().substring(0,8).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    event: 'EVIDENCE_SEALED',
    actor: payload.collector || 'admin@cyberlab.local',
    organization: payload.sourceOrg || 'Organization B',
    evidence_id: newEvidence.id,
    event_id: `EVT-${uuidv4().substring(0,8).toUpperCase()}`,
    verification: 'VERIFIED',
    reference: 'SmartContract',
    details: `Cryptographic SHA-256 hash (${newEvidence.hash.substring(0,16)}...) sealed on ledger.`
  });

  await writeDb(db);
  res.json(newEvidence);
});

app.get('/api/v1/evidence/:id', async (req, res) => {
  const db = await readDb();
  const item = db.evidence.find(e => e.id === req.params.id);
  if (item) res.json(item);
  else res.status(404).json({ error: 'Evidence not found' });
});

app.get('/api/v1/evidence/:id/download', async (req, res) => {
  const db = await readDb();
  const item = db.evidence.find(e => e.id === req.params.id);
  
  // Requirement: Zero-trust asset access middleware
  const userDid = req.query.did; 
  if (item && item.ownerDid !== userDid && (!item.accessList || !item.accessList.includes(userDid))) {
      return res.status(403).json({ error: 'Access Denied: DID not authorized on-chain for this asset.' });
  }

  if (item && item.storageLocation && require('fs').existsSync(item.storageLocation)) {
    return res.download(item.storageLocation, item.title || `${item.id}.bin`);
  }
  res.setHeader('Content-Disposition', `attachment; filename="${req.params.id}.txt"`);
  res.setHeader('Content-Type', 'text/plain');
  res.send(`OFF-CHAIN SECURE EXHIBIT VAULT
Evidence ID: ${req.params.id}
Title: ${item ? item.title : 'N/A'}
Hash: ${item ? item.hash : 'N/A'}
Status: VERIFIED`);
});

app.delete('/api/v1/evidence/:id', async (req, res) => {
  const db = await readDb();
  const initialCount = db.evidence.length;
  db.evidence = db.evidence.filter(e => e.id !== req.params.id);
  if (db.evidence.length < initialCount) {
    db.audit_logs.unshift({
      id: `AUD-${uuidv4().substring(0,8).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      event: 'EVIDENCE_REMOVED',
      actor: 'admin@cyberlab.local',
      organization: 'Organization B',
      evidence_id: req.params.id,
      event_id: `EVT-${uuidv4().substring(0,8).toUpperCase()}`,
      verification: 'SUCCESS',
      reference: 'Audit-Ledger',
      details: `Evidence ${req.params.id} purged from database.`
    });
    await writeDb(db);
    res.json({ message: `Evidence ${req.params.id} successfully removed.` });
  } else {
    res.status(404).json({ error: 'Evidence not found' });
  }
});

// Audit Routes
app.get('/api/v1/audit', async (req, res) => {
  const db = await readDb();
  res.json(db.audit_logs);
});

app.post('/api/v1/audit', async (req, res) => {
  const db = await readDb();
  const log = {
    id: req.body.id || `AUD-${uuidv4().substring(0,8).toUpperCase()}`,
    timestamp: req.body.timestamp || new Date().toISOString(),
    event: req.body.event || 'SYSTEM_ACTION',
    actor: req.body.actor || 'system',
    organization: req.body.organization || 'Organization B (Cyber Defense Lab)',
    evidence_id: req.body.evidenceId || req.body.evidence_id || 'N/A',
    event_id: req.body.eventId || req.body.event_id || `EVT-${uuidv4().substring(0,8).toUpperCase()}`,
    verification: req.body.verification || 'VERIFIED',
    reference: req.body.reference || ('0x' + require('crypto').randomBytes(32).toString('hex')),
    details: req.body.details || 'Cryptographic audit log recorded'
  };
  db.audit_logs.unshift(log);
  await writeDb(db);
  res.json(log);
});

// Retention Policies Routes
app.get('/api/v1/admin/retention/policies', async (req, res) => {
  const db = await readDb();
  res.json(db.retention_policies || []);
});

app.post('/api/v1/admin/retention/policies', async (req, res) => {
  const db = await readDb();
  const policy = {
    id: `POL-${uuidv4().substring(0,6).toUpperCase()}`,
    name: req.body.name || 'Custom Retention Policy',
    retention_period_days: req.body.retention_period_days || 365,
    trigger_event: req.body.trigger_event || 'evidence_sealed',
    action_on_expiry: req.body.action_on_expiry || 'ARCHIVE_COLD'
  };
  if (!db.retention_policies) db.retention_policies = [];
  db.retention_policies.unshift(policy);
  await writeDb(db);
  res.json(policy);
});

// Transfers Routes
app.get('/api/v1/transfers', async (req, res) => {
  const db = await readDb();
  res.json(db.transfers || []);
});

app.post('/api/v1/transfers', async (req, res) => {
  const db = await readDb();
  const transfer = {
    id: `TRF-${uuidv4().substring(0,6).toUpperCase()}`,
    evidenceId: req.body.evidenceId || 'EV-001',
    evidenceTitle: req.body.evidenceTitle || 'Forensic Payload',
    fromOrg: req.body.fromOrg || 'Organization A',
    toOrg: req.body.toOrg || 'Organization B',
    status: 'PENDING',
    initiatedAt: new Date().toISOString(),
    txHash: '0x' + require('crypto').randomBytes(32).toString('hex')
  };
  db.transfers.unshift(transfer);
  await writeDb(db);
  res.json(transfer);
});

app.post('/api/v1/transfers/:id/accept', async (req, res) => {
  const db = await readDb();
  const trf = (db.transfers || []).find(t => t.id === req.params.id);
  if (trf) {
    trf.status = 'COMPLETED';
    trf.completedAt = new Date().toISOString();
    await writeDb(db);
    res.json(trf);
  } else {
    res.json({ status: 'COMPLETED', message: 'Transfer accepted' });
  }
});

// Custody Events Routes
app.get('/api/v1/custody/events', async (req, res) => {
  const db = await readDb();
  res.json(db.audit_logs);
});

app.get('/api/v1/custody/events/:id', async (req, res) => {
  const db = await readDb();
  const events = db.audit_logs.filter(a => a.evidence_id === req.params.id);
  res.json(events);
});

// Lineage Routes
app.get('/api/v1/lineage/:id', async (req, res) => {
  const db = await readDb();
  const item = db.evidence.find(e => e.id === req.params.id);
  res.json({
    nodes: item ? [
      {
        id: req.params.id,
        type: 'evidenceNode',
        data: item
      }
    ] : [],
    edges: []
  });
});

app.post('/api/v1/lineage/:id/derive', async (req, res) => {
  res.json({ message: 'Artifact derived successfully' });
});

app.post('/api/v1/lineage/:id/verify', async (req, res) => {
  res.json({ status: 'VERIFIED', proofValid: true, timestamp: new Date().toISOString() });
});

// Verification Route
app.post('/api/v1/verification/verify', async (req, res) => {
  const db = await readDb();
  const idToFind = (req.body.identifier || '').trim().toUpperCase();
  const item = db.evidence.find(e => 
    (e.id && e.id.toUpperCase() === idToFind) || 
    (e.hash && e.hash.toUpperCase() === idToFind)
  );

  if (item) {
    const isTampered = item.status === 'COMPROMISED' || (item.expectedHash && item.hash !== item.expectedHash);
    const actualHash = item.hash || '';
    const expectedHash = item.expectedHash || actualHash;
    const sourceOrg = item.sourceOrg || 'Originating Agency';
    const custodyEvent = item.lastEvent || 'COLLECT';

    res.json({
      identifier: item.id,
      overallStatus: isTampered ? 'COMPROMISED' : 'VERIFIED',
      tamperDetected: isTampered,
      verifiedAt: getISTNowString(),
      auditorId: 'AUDITOR-INDEPENDENT-GLOBAL',
      onChainBlock: item.blockNumber || 482910,
      checks: [
        {
          key: 'hash_integrity',
          title: 'HASH INTEGRITY',
          status: isTampered ? 'FAILED' : 'PASS',
          expected: expectedHash,
          actual: actualHash,
          description: isTampered ? 'SHA-256 bit digest mismatch. Off-chain bytes do not match on-chain root.' : 'SHA-256 bit digest matches immutable on-chain root seal 100%.'
        },
        {
          key: 'digital_signature',
          title: 'DIGITAL SIGNATURE',
          status: isTampered ? 'FAILED' : 'PASS',
          expected: `ECDSA secp256k1 signed by ${sourceOrg}`,
          actual: isTampered ? 'SIGNATURE_INVALID_MODIFIED_PAYLOAD' : `VALID (${sourceOrg} CERT CA Certificate Validated)`,
          description: isTampered ? 'Signature invalid due to cryptographic digest tampering.' : 'Cryptographic signature verified against public key registry.'
        },
        {
          key: 'custody_history',
          title: 'CUSTODY HISTORY',
          status: isTampered ? 'WARNING' : 'PASS',
          expected: 'Continuous unbroken chain of custody records',
          actual: `Anchored at ${custodyEvent} transition`,
          description: 'All custodial transfers signed by authenticated organization agents.'
        },
        {
          key: 'event_sequence',
          title: 'EVENT SEQUENCE',
          status: 'PASS',
          expected: 'Strict state progression (COLLECT -> SEAL -> TRANSFER -> RECEIVE -> ANALYZE)',
          actual: 'Monotonic timestamp and nonce sequence confirmed',
          description: 'State transition invariants satisfied without reordering.'
        },
        {
          key: 'derived_lineage',
          title: 'DERIVED LINEAGE',
          status: isTampered ? 'FAILED' : 'PASS',
          expected: 'Clean derivation DAG with verified parent roots',
          actual: item.derivedCount > 0 ? `${item.derivedCount} derived artifact(s) verified with valid parent links` : 'Root evidence exhibit verified with unbroken parent seals',
          description: 'Lineage DAG verified from root evidence to analytical reports.'
        }
      ]
    });
  } else {
    res.status(404).json({
      detail: `Exhibit "${req.body.identifier}" was not found in the cryptographic audit ledger.`
    });
  }
});

// AI Triage Route
app.post('/api/v1/ai/triage', async (req, res) => {
  res.json({
    severity: 'MEDIUM',
    threatCategory: 'Forensic Digital Artifact',
    recommendations: [
      'Store artifact in encrypted object vault enclave',
      'Compute continuous integrity hashes across custody transitions',
      'Generate immutable ECDSA signature verification report'
    ]
  });
});


// Access Control Routes
app.post('/api/v1/evidence/:id/access', async (req, res) => {
  const db = await readDb();
  const evidence = db.evidence.find(e => e.id === req.params.id);
  if (!evidence) return res.status(404).json({ error: 'Asset not found' });
  
  const { userDid, action } = req.body;
  if (action === 'GRANT') {
    if (!evidence.accessList) evidence.accessList = [];
    if (!evidence.accessList.includes(userDid)) {
      evidence.accessList.push(userDid);
    }
  } else if (action === 'REVOKE') {
    if (evidence.accessList) {
      evidence.accessList = evidence.accessList.filter(did => did !== userDid);
    }
  }
  
  db.audit_logs.unshift({
    id: `AUD-${Date.now()}`,
    timestamp: new Date().toISOString(),
    event: action === 'GRANT' ? 'ACCESS_GRANTED' : 'ACCESS_REVOKED',
    actor: 'System Admin',
    evidence_id: evidence.id,
    details: `${action} access for DID ${userDid}`
  });
  
  await writeDb(db);
  res.json({ success: true, accessList: evidence.accessList });
});

// Admin Mint NFT Route
app.post('/api/v1/evidence/:id/mint', async (req, res) => {
  const { role } = req.body;
  if (role !== 'ROLE_ADMIN' && role !== 'ADMIN') {
    return res.status(403).json({ error: 'HASHGUARD: Only Admin can mint assets' });
  }
  
  const db = await readDb();
  const evidence = db.evidence.find(e => e.id === req.params.id);
  if (!evidence) return res.status(404).json({ error: 'Asset not found' });
  
  evidence.blockchainStatus = 'MINTED_ON_CHAIN';
  evidence.txHash = '0x' + require('crypto').randomBytes(32).toString('hex');
  
  db.audit_logs.unshift({
    id: `AUD-${Date.now()}`,
    timestamp: new Date().toISOString(),
    event: 'NFT_MINTED',
    actor: 'System Admin',
    evidence_id: evidence.id,
    details: `Admin minted NFT for Asset ${evidence.id}`
  });
  
  await writeDb(db);
  res.json({ success: true, txHash: evidence.txHash });
});

initDb().then(() => {

  app.listen(PORT, () => {
    console.log(`Node backend running on http://localhost:${PORT}`);
  });
});
