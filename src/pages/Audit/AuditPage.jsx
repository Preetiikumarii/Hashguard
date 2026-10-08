import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { AuditFilterBar } from '../../components/audit/AuditFilterBar';
import { AuditLogTable } from '../../components/audit/AuditLogTable';
import { LoadingState, EmptyState } from '../../components/common/StateViews';
import { auditService } from '../../services/auditService';
import { useApp } from '../../context/AppContext';
import { Download } from 'lucide-react';

export const AuditPage = () => {
  const { searchQuery, isTamperSimulated, refreshTrigger } = useApp();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(searchQuery || '');
  const [eventFilter, setEventFilter] = useState('ALL');
  const [orgFilter, setOrgFilter] = useState('ALL');

  useEffect(() => {
    if (searchQuery) setSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    async function loadLogs() {
      setLoading(true);
      try {
        const data = await auditService.getAuditLogs({
          search,
          event: eventFilter,
          organization: orgFilter
        });
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, [search, eventFilter, orgFilter, refreshTrigger, isTamperSimulated]);

  const handleExportCsv = () => {
    const headers = "Timestamp,Event,Actor,Organization,EvidenceID,EventID,Verification,Reference\n";
    const rows = logs.map(l => `"${l.timestamp}","${l.event}","${l.actor}","${l.organization}","${l.evidenceId}","${l.eventId}","${l.verification}","${l.reference}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Cyber_Evidence_Audit_Log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs & On-Chain Ledger"
        subtitle="Review chronological custody and activity logs."
        breadcrumbs={['Dashboard', 'Audit Logs']}
        badge={
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-ce-brand/10 text-ce-brand border border-ce-brand/30 tracking-wider">
            IMMUTABLE LEDGER STREAM
          </span>
        }
        actionButton={
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-ce-surface-subtle border border-ce-border text-xs font-mono font-bold text-ce-text-secondary hover:text-ce-text-primary hover:border-ce-brand/50 hover:bg-ce-surface-hover transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Trail (CSV)</span>
          </button>
        }
      />

      {/* Filter Bar */}
      <AuditFilterBar
        search={search}
        setSearch={setSearch}
        eventFilter={eventFilter}
        setEventFilter={setEventFilter}
        orgFilter={orgFilter}
        setOrgFilter={setOrgFilter}
        onReset={() => {
          setSearch('');
          setEventFilter('ALL');
          setOrgFilter('ALL');
        }}
      />

      {/* Table */}
      {loading ? (
        <LoadingState message="Fetching immutable audit records..." />
      ) : logs.length === 0 ? (
        <EmptyState
          title="No Audit Logs Found"
          description="Adjust your search parameters or event filters."
        />
      ) : (
        <AuditLogTable logs={logs} />
      )}
    </div>
  );
};
