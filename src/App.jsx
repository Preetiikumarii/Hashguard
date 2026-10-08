import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { EvidencePage } from './pages/Evidence/EvidencePage';
import { EvidenceDetailsPage } from './pages/EvidenceDetails/EvidenceDetailsPage';
import { TransfersPage } from './pages/Transfers/TransfersPage';
import { CustodyPage } from './pages/Custody/CustodyPage';
import { LineagePage } from './pages/Lineage/LineagePage';
import { VerificationPage } from './pages/Verification/VerificationPage';
import { AuditPage } from './pages/Audit/AuditPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { RetentionPage } from './pages/Retention/RetentionPage';
import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/Landing/LandingPage';
import { ArchitecturePage } from './pages/Architecture/ArchitecturePage';
import { AccessGovernancePage } from './pages/AccessGovernance/AccessGovernancePage';
import { PassportPage } from './pages/Passport/PassportPage';
import { SecurityLabPage } from './pages/SecurityLab/SecurityLabPage';
import { BootSequence } from './components/layout/BootSequence';
import { useApp } from './context/AppContext';

const ProtectedRoute = ({ element, pathId }) => {
  const { currentRole } = useApp();
  
  // Basic Auth Check
  const token = localStorage.getItem('cee_auth_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!currentRole.allowedPages.includes(pathId)) {
    return <Navigate to={`/${currentRole.allowedPages[0]}`} replace />;
  }
  return element;
};

// Automatic sandbox activation route for PPT reviewers & evaluation
const SandboxRoute = () => {
  const { loginSession } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const mockUser = {
      id: 'USR-B-02',
      email: 'analyst@cyberlab.local',
      name: 'Lead Forensic Analyst',
      organization_id: 'ORG_B',
      orgId: 'ORG_B',
      role: 'FORENSIC_ANALYST'
    };
    loginSession({
      user: mockUser,
      organizationId: 'ORG_B',
      roleId: 'FORENSIC_ANALYST',
      token: 'demo_sandbox_jwt_' + Date.now(),
      isSandbox: true
    });
    navigate('/dashboard', { replace: true });
  }, []);

  return null;
};

export function App() {
  const [hasBooted, setHasBooted] = useState(false);
  const { currentRole } = useApp();
  const location = useLocation();

  const isLandingPage = location.pathname === '/' || location.pathname === '/landing' || location.pathname === '/sandbox' || location.pathname === '/architecture';

  return (
    <>
      {!hasBooted && !isLandingPage && <BootSequence onComplete={() => setHasBooted(true)} />}
      <div className={!hasBooted && !isLandingPage ? 'opacity-0' : 'opacity-100 transition-opacity duration-700'}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/sandbox" element={<SandboxRoute />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} pathId="dashboard" />} />
            <Route path="/evidence" element={<ProtectedRoute element={<EvidencePage />} pathId="evidence" />} />
            <Route path="/evidence/:id" element={<ProtectedRoute element={<EvidenceDetailsPage />} pathId="evidence-details" />} />
            <Route path="/transfers" element={<ProtectedRoute element={<TransfersPage />} pathId="transfers" />} />
            <Route path="/custody" element={<ProtectedRoute element={<CustodyPage />} pathId="custody" />} />
            <Route path="/lineage" element={<ProtectedRoute element={<LineagePage />} pathId="lineage" />} />
            <Route path="/verification" element={<ProtectedRoute element={<VerificationPage />} pathId="verification" />} />
            <Route path="/passport" element={<ProtectedRoute element={<PassportPage />} pathId="passport" />} />
            <Route path="/passport/:id" element={<ProtectedRoute element={<PassportPage />} pathId="passport" />} />
            <Route path="/security-lab" element={<ProtectedRoute element={<SecurityLabPage />} pathId="security-lab" />} />
            <Route path="/access-governance" element={<ProtectedRoute element={<AccessGovernancePage />} pathId="access-governance" />} />
            <Route path="/audit" element={<ProtectedRoute element={<AuditPage />} pathId="audit" />} />
            <Route path="/retention" element={<ProtectedRoute element={<RetentionPage />} pathId="retention" />} />
            <Route path="/settings" element={<ProtectedRoute element={<SettingsPage />} pathId="settings" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
