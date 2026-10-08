import React, { useState, useEffect } from 'react';
import { HeroSection } from '../../components/dashboard/HeroSection';
import { DashboardStatsRow } from '../../components/dashboard/DashboardStatsRow';
import { RecentEvidenceTable } from '../../components/dashboard/RecentEvidenceTable';
import { RecentActivityFeed } from '../../components/dashboard/RecentActivityFeed';
import { ChainOfTrustBanner } from '../../components/dashboard/ChainOfTrustBanner';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { IntegrityAlertBanner } from '../../components/dashboard/IntegrityAlertBanner';
import { LoadingState } from '../../components/common/StateViews';
import { evidenceService } from '../../services/evidenceService';
import { custodyService } from '../../services/custodyService';
import { transferService } from '../../services/transferService';
import { useApp } from '../../context/AppContext';
import { NewEvidenceModal } from '../../components/evidence/NewEvidenceModal';
import { OnboardingGuideCard } from '../../components/dashboard/OnboardingGuideCard';

export const DashboardPage = () => {
  const { isTamperSimulated, refreshTrigger, triggerRefresh } = useApp();
  const [evidenceList, setEvidenceList] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [custodyEvents, setCustodyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewEvidenceModal, setShowNewEvidenceModal] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [evList, transList, evts] = await Promise.all([
          evidenceService.getAllEvidence(),
          transferService.getTransfers(),
          custodyService.getEvents()
        ]);
        setEvidenceList(evList);
        setTransfers(transList);
        setCustodyEvents(evts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [refreshTrigger, isTamperSimulated]);

  const compromisedItem = evidenceList.find((e) => e.status === 'COMPROMISED') || (isTamperSimulated ? evidenceList.find(e => e.id === 'EV-001') : null);

  if (loading && evidenceList.length === 0) {
    return <LoadingState message="Connecting to secure custody audit ledger..." />;
  }

  return (
    <div className="space-y-3">
      {/* Integrity Alert Section (if compromised or simulated) */}
      {compromisedItem && (
        <IntegrityAlertBanner
          evidenceId={compromisedItem.id}
          expectedHash={compromisedItem.expectedHash}
          currentHash={compromisedItem.hash}
          description="Current hash does not match sealed hash. Off-chain binary bits modified."
        />
      )}

      {/* Hero Section */}
      <HeroSection />

      {/* Operational Onboarding Guide for Agency Nodes */}
      <OnboardingGuideCard
        evidenceCount={evidenceList.length}
        onRegister={() => setShowNewEvidenceModal(true)}
      />

      {/* KPI Cards Row */}
      <DashboardStatsRow evidenceList={evidenceList} transfers={transfers} />

      {/* Table and Activity Feed Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2">
          <RecentEvidenceTable evidenceList={evidenceList} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivityFeed events={custodyEvents} />
        </div>
      </div>

      {/* Bottom Banners and Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 pb-8">
        <div className="lg:col-span-2">
          <ChainOfTrustBanner />
        </div>
        <div className="lg:col-span-1">
          <QuickActions onRegister={() => setShowNewEvidenceModal(true)} />
        </div>
      </div>

      {/* Register Evidence Modal */}
      <NewEvidenceModal
        isOpen={showNewEvidenceModal}
        onClose={() => setShowNewEvidenceModal(false)}
        onCreated={() => triggerRefresh()}
      />
    </div>
  );
};
