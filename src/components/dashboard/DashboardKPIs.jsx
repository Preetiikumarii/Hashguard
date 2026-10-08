import React from 'react';
import { StatCard } from '../common/StatCard';
import { ShieldCheck, ShieldAlert, Clock, Database, AlertOctagon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardKPIs = ({ evidenceList = [], transfers = [] }) => {
  const { isTamperSimulated } = useApp();

  const totalCount = evidenceList.length;
  const verifiedCount = evidenceList.filter((e) => e.status === 'VERIFIED').length;
  const pendingCount = transfers.filter((t) => t.status === 'TRANSFERRING' || t.status === 'REQUESTED').length;
  const alertCount = evidenceList.filter((e) => e.status === 'COMPROMISED').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Evidence"
        value={String(totalCount).padStart(2, '0')}
        icon={Database}
        variant="default"
        badgeText="OFF-CHAIN SECURED"
      />

      <StatCard
        title="Verified"
        value={String(verifiedCount).padStart(2, '0')}
        icon={ShieldCheck}
        variant="verified"
        badgeText="100% INTEGRITY"
      />

      <StatCard
        title="Pending"
        value={String(pendingCount).padStart(2, '0')}
        icon={Clock}
        variant="warning"
        badgeText="mTLS IN PROGRESS"
      />

      <StatCard
        title="Integrity Alert"
        value={String(alertCount).padStart(2, '0')}
        icon={alertCount > 0 ? AlertOctagon : ShieldAlert}
        variant={alertCount > 0 ? "danger" : "default"}
        badgeText={alertCount > 0 ? "TAMPER FLAGGED" : "NOMINAL"}
      />
    </div>
  );
};
