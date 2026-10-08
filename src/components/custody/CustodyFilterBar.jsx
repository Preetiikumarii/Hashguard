import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';

export const CustodyFilterBar = ({
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
            placeholder="Search Event ID, Actor, Evidence ID, Tx..."
            className="w-full bg-ce-bg border border-ce-border rounded-md pl-9 pr-3 py-2 text-xs text-ce-text-primary placeholder:text-ce-text-muted font-mono focus:outline-none focus:border-ce-brand"
          />
        </div>

        {/* Event Type Filter */}
        <div>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="w-full bg-ce-bg border border-ce-border rounded-md px-3 py-2 text-xs text-ce-text-primary font-mono focus:outline-none focus:border-ce-brand cursor-pointer"
          >
            <option value="ALL">Event: All Event Types</option>
            <option value="COLLECT">COLLECT</option>
            <option value="SEAL">SEAL</option>
            <option value="TRANSFER">TRANSFER</option>
            <option value="RECEIVE">RECEIVE</option>
            <option value="ANALYZE">ANALYZE</option>
            <option value="DERIVE">DERIVE</option>
            <option value="ARCHIVE">ARCHIVE</option>
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
            <option value="Org A">Organization A (CERT-Alpha)</option>
            <option value="Org B">Organization B (Cyber Lab)</option>
            <option value="Org C">Organization C (Judicial Court)</option>
            <option value="Org D">Organization D (Cyber Police LEA)</option>
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
