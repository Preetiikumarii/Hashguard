import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { CustodyFilterBar } from '../../components/custody/CustodyFilterBar';
import { CustodyExplorerTable } from '../../components/custody/CustodyExplorerTable';
import { LoadingState, EmptyState } from '../../components/common/StateViews';
import { custodyService } from '../../services/custodyService';
import { useApp } from '../../context/AppContext';

export const CustodyPage = () => {
  const { searchQuery, isTamperSimulated, refreshTrigger } = useApp();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(searchQuery || '');
  const [eventFilter, setEventFilter] = useState('ALL');
  const [orgFilter, setOrgFilter] = useState('ALL');

  useEffect(() => {
    if (searchQuery) setSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await custodyService.getEvents({
          search,
          event: eventFilter,
          organization: orgFilter
        });
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [search, eventFilter, orgFilter, refreshTrigger, isTamperSimulated]);

  const handleResetFilters = () => {
    setSearch('');
    setEventFilter('ALL');
    setOrgFilter('ALL');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Global Custody Explorer"
        subtitle="Track evidence transitions and custody."
        breadcrumbs={['Dashboard', 'Custody Explorer']}
        badge={
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-ce-brand/10 text-ce-brand border border-ce-brand/30">
            APPEND-ONLY AUDIT LEDGER
          </span>
        }
      />

      {/* Filter Bar */}
      <CustodyFilterBar
        search={search}
        setSearch={setSearch}
        eventFilter={eventFilter}
        setEventFilter={setEventFilter}
        orgFilter={orgFilter}
        setOrgFilter={setOrgFilter}
        onReset={handleResetFilters}
      />

      {/* Table view */}
      {loading ? (
        <LoadingState message="Querying distributed custody ledger nodes..." />
      ) : events.length === 0 ? (
        <EmptyState
          title="No Custody Events Found"
          description="Adjust your search criteria or event filters to inspect recorded transitions."
        />
      ) : (
        <CustodyExplorerTable events={events} />
      )}
    </div>
  );
};
