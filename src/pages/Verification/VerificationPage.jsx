import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { IndependentVerificationPanel } from '../../components/verification/IndependentVerificationPanel';
import { OffChainBadge } from '../../components/common/OffChainBadge';
import { ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VerificationPage = () => {
  const [searchParams] = useSearchParams();
  const queryId = (searchParams.get('id') || searchParams.get('evidenceId') || '').trim();
  const { isSandboxMode } = useApp();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Independent Verification"
        subtitle="Verify integrity without accessing raw evidence."
        breadcrumbs={['Dashboard', 'Independent Verification']}
        badge={
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-ce-brand/10 text-ce-brand border border-ce-brand/30 flex items-center gap-1.5 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>INDEPENDENT AUDIT INTERFACE</span>
          </span>
        }
      />

      {/* Off-Chain Storage vs On-Chain Audit Explanation */}
      <OffChainBadge />

      {/* Main Independent Verification Panel */}
      <IndependentVerificationPanel 
        defaultId={queryId || (isSandboxMode ? 'EV-001' : '')} 
        autoVerify={Boolean(queryId)}
      />
    </div>
  );
};
