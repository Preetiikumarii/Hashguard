export const mockLineageGraph = {
  evidenceId: "EV-001",
  nodes: [
    {
      id: "node-1",
      type: "lineageNode",
      position: { x: 350, y: 50 },
      data: {
        id: "EV-001",
        label: "Original Evidence: Ransomware Binary",
        artifactType: "Original Evidence (Root)",
        hash: "8f3a91bc72f4cd2a4e9b671a5c28e930f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
        creator: "Organization A (CERT-Alpha)",
        timestamp: "2026-08-16 08:30:14 UTC",
        verificationState: "VERIFIED",
        isRoot: true,
        details: {
          file: "lockbit3_encryptor.bin",
          size: "4.8 MB",
          algorithm: "SHA-256",
          signature: "ECDSA VALID (Org A)"
        }
      }
    },
    {
      id: "node-2",
      type: "lineageNode",
      position: { x: 350, y: 300 },
      data: {
        id: "ANL-001",
        label: "Ghidra Decompilation & Dynamic Sandbox",
        artifactType: "Intermediate Analysis",
        hash: "e12d4a899c0b1e457f920da83c6b4129e01f682bc8527a941ef037190d56b4ea",
        creator: "Organization B (Cyber Lab)",
        timestamp: "2026-08-16 11:10:00 UTC",
        verificationState: "VERIFIED",
        isRoot: false,
        details: {
          file: "ghidra_decompilation_tree.json",
          size: "82.5 MB",
          algorithm: "SHA-256",
          signature: "ECDSA VALID (Org B)"
        }
      }
    },
    {
      id: "node-3",
      type: "lineageNode",
      position: { x: -50, y: 550 },
      data: {
        id: "EV-006",
        label: "EV-006: Reverse Engineering Technical Report",
        artifactType: "Derived Artifact (Malware Report)",
        hash: "b5e4a3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4",
        creator: "Organization B (Cyber Lab)",
        timestamp: "2026-08-16 12:00:00 UTC",
        verificationState: "VERIFIED",
        isRoot: false,
        details: {
          file: "forensics_report_rev_01.pdf",
          size: "14.2 MB",
          algorithm: "SHA-256",
          signature: "ECDSA VALID (Org B)"
        }
      }
    },
    {
      id: "node-4",
      type: "lineageNode",
      position: { x: 750, y: 550 },
      data: {
        id: "EV-005",
        label: "EV-005: Extracted YARA & Sigma IOC Set",
        artifactType: "Derived Artifact (IOC Set)",
        hash: "cfbddcbbfa6e6cbed87317b37d81b54d0ce3039a34c7fe79b776a4c3183925c6",
        creator: "Organization B (Cyber Lab)",
        timestamp: "2026-08-16 11:45:00 UTC",
        verificationState: "VERIFIED",
        isRoot: false,
        details: {
          file: "lockbit3_rules.yar",
          size: "124 KB",
          algorithm: "SHA-256",
          signature: "ECDSA VALID (Org B)"
        }
      }
    },
    {
      id: "node-5",
      type: "lineageNode",
      position: { x: 350, y: 800 },
      data: {
        id: "FIN-001",
        label: "Final Cross-Agency Threat Attribution Brief",
        artifactType: "Consolidated Final Report",
        hash: "f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5",
        creator: "Organization B + Alliance",
        timestamp: "2026-08-16 13:15:00 UTC",
        verificationState: "VERIFIED",
        isRoot: false,
        details: {
          file: "final_attribution_advisory.pdf",
          size: "28.6 MB",
          algorithm: "SHA-256",
          signature: "ECDSA MULTI-SIG VALID"
        }
      }
    },
    {
      id: "node-6",
      type: "lineageNode",
      position: { x: 350, y: 1050 },
      data: {
        id: "CRT-001",
        label: "Cryptographic Verification Report Dossier",
        artifactType: "Court Trial Exhibit",
        hash: "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
        creator: "Organization C (Judicial Court Registry)",
        timestamp: "2026-08-16 14:30:00 UTC",
        verificationState: "VERIFIED",
        isRoot: false,
        details: {
          file: "judicial_admissibility_certificate.pdf",
          size: "3.4 MB",
          algorithm: "SHA-256",
          signature: "JUDICIAL REGISTRAR SIGNED (Org C)"
        }
      }
    }
  ],
  edges: [
    {
      id: "e1-2",
      source: "node-1",
      target: "node-2",
      label: "ANALYSIS OF",
      animated: true,
      style: { stroke: '#06b6d4', strokeWidth: 2 }
    },
    {
      id: "e2-3",
      source: "node-2",
      target: "node-3",
      label: "DERIVED FROM",
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 2 }
    },
    {
      id: "e2-4",
      source: "node-2",
      target: "node-4",
      label: "DERIVED FROM",
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 2 }
    },
    {
      id: "e3-5",
      source: "node-3",
      target: "node-5",
      label: "CONSOLIDATED",
      animated: false,
      style: { stroke: '#6366f1', strokeWidth: 2 }
    },
    {
      id: "e4-5",
      source: "node-4",
      target: "node-5",
      label: "CORRELATED",
      animated: false,
      style: { stroke: '#6366f1', strokeWidth: 2 }
    },
    {
      id: "e5-6",
      source: "node-5",
      target: "node-6",
      label: "JUDICIAL ADMISSION",
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 2 }
    }
  ]
};

export const mockLineageVerification = {
  evidenceId: "EV-001",
  overallStatus: "LINEAGE VALID",
  checks: [
    {
      name: "SOURCE VERIFIED",
      status: "PASS",
      details: "Original evidence manifest block #482910 contains immutable cryptographic root anchor."
    },
    {
      name: "PARENT HASH VERIFIED",
      status: "PASS",
      details: "Parent artifact SHA-256 matches all child derivation headers without hash drift."
    },
    {
      name: "DERIVATION EVENT VERIFIED",
      status: "PASS",
      details: "Derivation custody transactions verified across distributed validator nodes."
    },
    {
      name: "SIGNATURE VERIFIED",
      status: "PASS",
      details: "All 4 intermediate and child signatures authenticated against authorized CA public keys."
    }
  ],
  verifiedAt: "2026-08-16 13:20:00 UTC",
  auditorId: "AUDITOR-INDEPENDENT-GLOBAL"
};
