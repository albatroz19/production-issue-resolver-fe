import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from '@/components/AppShell';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthProvider } from '@/context/AuthContext';
import { DailyTaskTrackerPage } from '@/pages/DailyTaskTrackerPage';
import { LoginPage } from '@/pages/LoginPage';
import { ProductionIssueResolverPage } from '@/pages/ProductionIssueResolverPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/issue-resolver"
        element={
          <ProtectedRoute>
            <AppShell>
              <ProductionIssueResolverPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/task-tracker"
        element={
          <ProtectedRoute>
            <AppShell>
              <DailyTaskTrackerPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
