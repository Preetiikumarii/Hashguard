import React from 'react';
import { ShieldCheck, ArrowRightLeft, FileWarning, ArrowRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const DashboardStatsRow = ({ evidenceList = [], transfers = [] }) => {
  const { isTamperSimulated } = useApp();

  const verifiedCount = evidenceList.filter((e) => e.status === 'VERIFIED').length - (isTamperSimulated ? 1 : 0);
  const compromisedCount = evidenceList.filter((e) => e.status === 'COMPROMISED').length + (isTamperSimulated ? 1 : 0);
  const pendingTransfers = transfers.filter((t) => t.status === 'PENDING').length;

  const activeNodesCount = React.useMemo(() => {
    const orgs = new Set();
    (evidenceList || []).forEach((e) => {
      if (e.sourceOrg) orgs.add(e.sourceOrg);
      if (e.currentCustodian) orgs.add(e.currentCustodian);
    });
    (transfers || []).forEach((t) => {
      if (t.sourceOrg) orgs.add(t.sourceOrg);
      if (t.destOrg) orgs.add(t.destOrg);
      if (t.fromOrg) orgs.add(t.fromOrg);
      if (t.toOrg) orgs.add(t.toOrg);
    });
    return Math.max(orgs.size, 3);
  }, [evidenceList, transfers]);

  const stats = [
    {
      title: 'Verified Evidence',
      value: Math.max(0, verifiedCount),
      icon: ShieldCheck,
      iconColor: 'text-ce-success',
      iconBg: 'bg-ce-success/10 border-ce-success/20',
      link: '/evidence'
    },
    {
      title: 'Pending Transfers',
      value: pendingTransfers,
      icon: ArrowRightLeft,
      iconColor: 'text-ce-warning',
      iconBg: 'bg-ce-warning/10 border-ce-warning/20',
      link: '/transfers'
    },
    {
      title: 'Integrity Alerts',
      value: compromisedCount,
      icon: FileWarning,
      iconColor: 'text-ce-danger',
      iconBg: 'bg-ce-danger/10 border-ce-danger/20',
      link: '/verification'
    },
    {
      title: 'Active Nodes',
      value: activeNodesCount,
      icon: Activity,
      iconColor: 'text-ce-info',
      iconBg: 'bg-ce-info/10 border-ce-info/20',
      link: '/audit'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Link 
            key={idx} 
            to={stat.link}
            className="bg-ce-surface border border-ce-border rounded-lg p-4 flex items-center justify-between hover:bg-ce-surface-subtle transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg border flex items-center justify-center ${stat.iconBg}`}>
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-semibold text-ce-text-primary tracking-tight leading-none mb-1.5">
                  {stat.value < 10 ? `0${stat.value}` : stat.value}
                </span>
                <span className="text-xs text-ce-text-secondary font-medium uppercase tracking-wider">
                  {stat.title}
                </span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-ce-text-muted group-hover:text-ce-text-primary transition-colors" />
          </Link>
        );
      })}
    </div>
  );
};
