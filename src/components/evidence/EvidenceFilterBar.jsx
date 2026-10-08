import React from 'react';
import { Filter, Search, RotateCcw } from 'lucide-react';

export const EvidenceFilterBar = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  orgFilter,
  setOrgFilter,
  onReset
}) => {
  return (
    <div className="p-4 rounded-lg bg-ce-surface border border-ce-border mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-ce-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, hash, or title..."
            className="w-full bg-ce-bg border border-ce-border rounded-md pl-9 pr-3 py-1.5 text-sm text-ce-text-primary placeholder:text-ce-text-muted focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-ce-bg border border-ce-border rounded-md px-3 py-1.5 text-sm text-ce-text-primary focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand cursor-pointer transition-colors"
          >
            <option value="ALL">Status: All Statuses</option>
            <option value="VERIFIED">Status: VERIFIED ✓</option>
            <option value="PENDING">Status: PENDING ○</option>
            <option value="COMPROMISED">Status: COMPROMISED ✕</option>
            <option value="ARCHIVED">Status: ARCHIVED ▪</option>
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-ce-bg border border-ce-border rounded-md px-3 py-1.5 text-sm text-ce-text-primary focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand cursor-pointer transition-colors"
          >
            <option value="ALL">Type: All Evidence Types</option>
            <option value="Malware Binary">Malware Binary</option>
            <option value="Network Capture">Network Capture (PCAP)</option>
            <option value="Memory Dump">Memory Dump (RAM)</option>
            <option value="Disk Image">Disk Image (E01)</option>
            <option value="IOC Set">IOC Set (YARA / Sigma)</option>
            <option value="Malware Analysis Report">Malware Analysis Report</option>
          </select>
        </div>

        {/* Organization Filter & Reset */}
        <div className="flex items-center gap-2">
          <select
            value={orgFilter}
            onChange={(e) => setOrgFilter(e.target.value)}
            className="flex-1 bg-ce-bg border border-ce-border rounded-md px-3 py-1.5 text-sm text-ce-text-primary focus:outline-none focus:border-ce-brand focus:ring-1 focus:ring-ce-brand cursor-pointer transition-colors"
          >
            <option value="ALL">Org: All Organizations</option>
            <option value="Org A">Organization A (CERT-Alpha)</option>
            <option value="Org B">Organization B (Cyber Lab)</option>
            <option value="Org C">Organization C (Judicial Court)</option>
            <option value="Org D">Organization D (Cyber Police LEA)</option>
          </select>

          <button
            onClick={onReset}
            className="p-2 rounded-md bg-ce-surface-subtle border border-ce-border text-ce-text-secondary hover:text-ce-text-primary hover:bg-ce-border transition-colors"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
