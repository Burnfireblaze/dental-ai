import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useState } from 'react';
import { RoleProvider } from './contexts/role-context';
import LoginScreen from './pages/login-screen';
import HomeScreen from './pages/home-screen';
import DashboardScreen from './pages/dashboard-screen';
import UploadScreen from './pages/upload-screen';
import AnalysisWorkspace from './pages/analysis-workspace';
import FindingsReview from './pages/findings-review';
import AIAssistant from './pages/ai-assistant';
import ClinicalReport from './pages/clinical-report';
import StatsCalibration from './pages/stats-calibration';
import Settings from './pages/settings';
import PatientDashboard from './pages/patient-dashboard';
import PatientRecords from './pages/patient-records';
import PatientTimeline from './pages/patient-timeline';
import PatientShare from './pages/patient-share';
import PatientReport from './pages/patient-report';
import AdminDashboard from './pages/admin-dashboard';
import AdminUsers from './pages/admin-users';
import AdminRoles from './pages/admin-roles';
import AdminActivity from './pages/admin-activity';
import Layout from './components/layout/layout';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <RoleProvider>
        <Routes>
          <Route path="/login" element={<LoginScreen onLogin={() => setIsAuthenticated(true)} />} />
          
          {isAuthenticated ? (
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/home" replace />} />
              
              {/* Doctor Routes */}
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/dashboard" element={<DashboardScreen />} />
              <Route path="/upload" element={<UploadScreen />} />
              <Route path="/analysis/:caseId" element={<AnalysisWorkspace />} />
              <Route path="/findings/:caseId" element={<FindingsReview />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/report/:caseId" element={<ClinicalReport />} />
              <Route path="/stats" element={<StatsCalibration />} />
              
              {/* Patient Routes */}
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/patient/records" element={<PatientRecords />} />
              <Route path="/patient/timeline" element={<PatientTimeline />} />
              <Route path="/patient/share" element={<PatientShare />} />
              <Route path="/patient/report" element={<PatientReport />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/roles" element={<AdminRoles />} />
              <Route path="/admin/activity" element={<AdminActivity />} />
              
              {/* Shared Routes */}
              <Route path="/settings" element={<Settings />} />
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </RoleProvider>
    </BrowserRouter>
  );
}