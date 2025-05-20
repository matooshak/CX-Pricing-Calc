import { useAuthStore } from '../stores/authStore';
import { Calculator, Server, HardDrive, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="animate-fade-in space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-secondary-900">Welcome, {user?.name}</h1>
        <p className="mt-2 text-secondary-600">
          Manage your cloud pricing calculations and configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/calculators/vps" className="calculator-card group">
          <div className="flex items-start space-x-4">
            <div className="rounded-full bg-primary-100 p-3 text-primary-600 group-hover:bg-primary-200">
              <Server className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-secondary-900">VPS Calculator</h3>
              <p className="mt-1 text-sm text-secondary-600">
                Calculate pricing for virtual private servers with various configurations.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-primary-600">
            <span>Open calculator</span>
            <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        <Link to="/calculators/baas" className="calculator-card group">
          <div className="flex items-start space-x-4">
            <div className="rounded-full bg-primary-100 p-3 text-primary-600 group-hover:bg-primary-200">
              <HardDrive className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-secondary-900">CX-BAAS Calculator</h3>
              <p className="mt-1 text-sm text-secondary-600">
                Calculate backup-as-a-service pricing per GB or per device.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-primary-600">
            <span>Open calculator</span>
            <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        {isAdmin && (
          <Link to="/pricing/manage" className="calculator-card group">
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-primary-100 p-3 text-primary-600 group-hover:bg-primary-200">
                <Cpu className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-secondary-900">Manage Pricing</h3>
                <p className="mt-1 text-sm text-secondary-600">
                  Configure pricing parameters for all calculators.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm font-medium text-primary-600">
              <span>Access settings</span>
              <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-medium text-secondary-900">Recent Activity</h2>
        <div className="mt-4 rounded-lg border border-secondary-200 bg-white">
          <div className="px-6 py-5">
            <p className="text-center text-secondary-500">No recent activity to display.</p>
          </div>
        </div>
      </div>
    </div>
  );
}