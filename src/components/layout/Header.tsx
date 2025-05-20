import { Menu, X, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';

interface HeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Header({ sidebarOpen, toggleSidebar }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 border-b border-secondary-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="rounded-md p-2 text-secondary-500 hover:bg-secondary-100 lg:hidden"
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <div className="ml-4 hidden lg:block">
            <h1 className="text-xl font-semibold text-secondary-900">
              Cloud Pricing Calculator
            </h1>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center rounded-full bg-white p-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
              <span className="font-medium">{user?.name.charAt(0)}</span>
            </div>
            <span className="mx-2 hidden text-sm font-medium text-secondary-700 md:block">
              {user?.name}
            </span>
            <ChevronDown className="h-4 w-4 text-secondary-500" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="border-b border-gray-100 px-4 py-2">
                <p className="text-sm font-medium text-secondary-900">{user?.name}</p>
                <p className="text-xs text-secondary-500">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="flex w-full items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}