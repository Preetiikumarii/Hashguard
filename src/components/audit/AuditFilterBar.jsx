import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

export const AuditFilterBar = ({
  search,
  setSearch,
  eventFilter,
  setEventFilter,
  orgFilter,
  setOrgFilter,
  onReset
}) => {
  return (
    <div className="p-4 rounded-lg bg-ce-surface border border-ce-border mb-6 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-ce-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Log ID, Event, Tx, Evidence ID..."
            className="w-full bg-ce-bg border border-ce-border rounded-md pl-9 pr-3 py-2 text-xs text-ce-text-primary placeholder:text-ce-text-muted font-mono focus:outline-none focus:border-ce-brand"
          />
        </div>

        {/* Event Filter */}
        <div>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="w-full bg-ce-bg border border-ce-border rounded-md px-3 py-2 text-xs text-ce-text-primary font-mono focus:outline-none focus:border-ce-brand cursor-pointer"
          >
            <option value="ALL">Event: All Audit Events</option>
            <option value="COLLECT">COLLECT</option>
            <option value="SEAL">SEAL</option>
            <option value="TRANSFER">TRANSFER</option>
            <option value="RECEIVE">RECEIVE</option>
            <option value="ANALYZE">ANALYZE</option>
            <option value="DERIVE">DERIVE</option>
            <option value="LINEAGE_VERIFICATION">LINEAGE_VERIFICATION</option>
            <option value="RETENTION_POLICY_CREATED">RETENTION_POLICY_CREATED</option>
            <option value="RETENTION_POLICY_UPDATED">RETENTION_POLICY_UPDATED</option>
            <option value="RETENTION_STARTED">RETENTION_STARTED</option>
            <option value="RETENTION_EXPIRED">RETENTION_EXPIRED</option>
            <option value="EVIDENCE_ARCHIVED">EVIDENCE_ARCHIVED</option>
            <option value="LEGAL_HOLD_APPLIED">LEGAL_HOLD_APPLIED</option>
            <option value="LEGAL_HOLD_RELEASED">LEGAL_HOLD_RELEASED</option>
            <option value="EVIDENCE_DELETION_APPROVED">EVIDENCE_DELETION_APPROVED</option>
          </select>
        </div>

        {/* Organization Filter & Reset */}
        <div className="flex items-center gap-2">
          <select
            value={orgFilter}
            onChange={(e) => setOrgFilter(e.target.value)}
            className="flex-1 bg-ce-bg border border-ce-border rounded-md px-3 py-2 text-xs text-ce-text-primary font-mono focus:outline-none focus:border-ce-brand cursor-pointer"
          >
            <option value="ALL">Org: All Organizations</option>
            <option value="Organization A">Organization A (CERT-Alpha)</option>
            <option value="Organization B">Organization B (Cyber Lab)</option>
            <option value="Organization C">Organization C (Judicial Court)</option>
            <option value="Organization D">Organization D (Cyber Police LEA)</option>
            <option value="Audit Board">Audit Board (Independent Oversight)</option>
            <option value="Independent Auditor">Independent Auditor</option>
          </select>

          <button
            onClick={onReset}
            className="p-2 rounded-md bg-ce-surface-subtle border border-ce-border text-ce-text-secondary hover:text-ce-text-primary hover:bg-ce-surface-elevated transition-colors"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
