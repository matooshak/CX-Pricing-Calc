import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calculator, 
  Tag, 
  Users, 
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  isAdmin: boolean;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function NavItem({ to, icon, children }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center rounded-md px-3 py-2 text-sm font-medium ${
          isActive
            ? 'bg-primary-50 text-primary-700'
            : 'text-secondary-700 hover:bg-secondary-50'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      <span>{children}</span>
    </NavLink>
  );
}

interface NavGroupProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function NavGroup({ title, icon, children }: NavGroupProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-secondary-500 hover:bg-secondary-50"
      >
        <div className="flex items-center">
          <span className="mr-3">{icon}</span>
          <span>{title}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      {isOpen && <div className="mt-1 ml-2 space-y-1">{children}</div>}
    </div>
  );
}

export default function Sidebar({ isOpen, isAdmin }: SidebarProps) {
  return (
    <div
      className={`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-md transition-transform duration-300 ease-in-out lg:static lg:translate-x-0`}
    >
      <div className="flex h-16 items-center border-b border-secondary-200 px-6">
        <h1 className="text-xl font-bold text-primary-600">CloudPricing</h1>
      </div>

      <nav className="mt-5 px-4">
        <div className="space-y-4">
          <NavItem to="/" icon={<LayoutDashboard className="h-5 w-5" />}>
            Dashboard
          </NavItem>

          <NavGroup title="Calculators" icon={<Calculator className="h-5 w-5" />}>
            <NavItem to="/calculators/vps" icon={<div className="h-2 w-2 rounded-full bg-primary-400" />}>
              VPS Calculator
            </NavItem>
            <NavItem to="/calculators/baas" icon={<div className="h-2 w-2 rounded-full bg-primary-400" />}>
              CX-BAAS Calculator
            </NavItem>
          </NavGroup>

          {isAdmin && (
            <>
              <NavGroup title="Pricing" icon={<Tag className="h-5 w-5" />}>
                <NavItem to="/pricing/manage" icon={<div className="h-2 w-2 rounded-full bg-primary-400" />}>
                  Manage Pricing
                </NavItem>
                <NavItem to="/pricing/categories" icon={<div className="h-2 w-2 rounded-full bg-primary-400" />}>
                  Manage Categories
                </NavItem>
                <NavItem to="/pricing/baas" icon={<div className="h-2 w-2 rounded-full bg-primary-400" />}>
                  Manage CX-BAAS Pricing
                </NavItem>
                <NavItem to="/pricing/discounts" icon={<div className="h-2 w-2 rounded-full bg-primary-400" />}>
                  Manage Discounts
                </NavItem>
                <NavItem to="/pricing/settings" icon={<div className="h-2 w-2 rounded-full bg-primary-400" />}>
                  Calculator Settings
                </NavItem>
              </NavGroup>

              <NavGroup title="Resellers" icon={<Users className="h-5 w-5" />}>
                <NavItem to="/resellers/manage" icon={<div className="h-2 w-2 rounded-full bg-primary-400" />}>
                  Manage Resellers
                </NavItem>
                <NavItem to="/resellers/sub-resellers" icon={<div className="h-2 w-2 rounded-full bg-primary-400" />}>
                  Manage Sub-Resellers
                </NavItem>
                <NavItem to="/resellers/margins" icon={<div className="h-2 w-2 rounded-full bg-primary-400" />}>
                  Set Margins
                </NavItem>
                <NavItem to="/resellers/baas-margins" icon={<div className="h-2 w-2 rounded-full bg-primary-400" />}>
                  Set CX-BAAS Margins
                </NavItem>
              </NavGroup>

              <NavGroup title="Settings" icon={<Settings className="h-5 w-5" />}>
                <NavItem to="/settings/users" icon={<div className="h-2 w-2 rounded-full bg-primary-400" />}>
                  Manage Users
                </NavItem>
              </NavGroup>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}