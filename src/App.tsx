import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import VPSCalculator from './pages/calculators/VPSCalculator';
import BaasCalculator from './pages/calculators/BaasCalculator';
import ManagePricing from './pages/pricing/ManagePricing';
import ManageCategories from './pages/pricing/ManageCategories';
import ManageBaasPricing from './pages/pricing/ManageBaasPricing';
import ManageDiscounts from './pages/pricing/ManageDiscounts';
import CalculatorSettings from './pages/pricing/CalculatorSettings';
import ManageResellers from './pages/resellers/ManageResellers';
import ManageSubResellers from './pages/resellers/ManageSubResellers';
import SetMargins from './pages/resellers/SetMargins';
import SetBaasMargins from './pages/resellers/SetBaasMargins';
import ManageUsers from './pages/settings/ManageUsers';

// Demo authentication - replace with actual authentication in production
setTimeout(() => {
  useAuthStore.getState().login({
    id: '1',
    name: 'Demo Admin',
    email: 'admin@example.com',
    role: 'admin',
  });
}, 100);

function App() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsInitialized(true);
    }
  }, [isLoading]);

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-t-transparent"></div>
          <p className="mt-4 text-secondary-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const isAdmin = user?.role === 'admin';

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="calculators">
          <Route path="vps" element={<VPSCalculator />} />
          <Route path="baas" element={<BaasCalculator />} />
        </Route>
        {isAdmin && (
          <>
            <Route path="pricing">
              <Route path="manage" element={<ManagePricing />} />
              <Route path="categories" element={<ManageCategories />} />
              <Route path="baas" element={<ManageBaasPricing />} />
              <Route path="discounts" element={<ManageDiscounts />} />
              <Route path="settings" element={<CalculatorSettings />} />
            </Route>
            <Route path="resellers">
              <Route path="manage" element={<ManageResellers />} />
              <Route path="sub-resellers" element={<ManageSubResellers />} />
              <Route path="margins" element={<SetMargins />} />
              <Route path="baas-margins" element={<SetBaasMargins />} />
            </Route>
            <Route path="settings">
              <Route path="users" element={<ManageUsers />} />
            </Route>
          </>
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;