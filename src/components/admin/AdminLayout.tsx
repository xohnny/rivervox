import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  Warehouse,
  Star,
  DollarSign,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Inventory', path: '/admin/inventory', icon: Warehouse },
  { name: 'Currency Rates', path: '/admin/pricing', icon: DollarSign },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', path: '/admin/customers', icon: Users },
  { name: 'Reviews', path: '/admin/reviews', icon: Star },
  { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export const AdminLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-sidebar flex items-center px-4 z-50 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-sidebar-foreground p-1"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-display font-bold text-sidebar-foreground ml-3">
          Rivervox
        </h1>
        <span className="text-xs text-sidebar-foreground/60 ml-2">Admin</span>
      </header>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'w-64 bg-sidebar fixed left-0 top-0 h-full flex flex-col z-50 transition-transform duration-200',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-sidebar-foreground">
              Rivervox
            </h1>
            <p className="text-xs text-sidebar-foreground/60 mt-1">Admin Panel</p>
          </div>
          <button
            onClick={closeSidebar}
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              onClick={closeSidebar}
              className={({ isActive }) =>
                cn('sidebar-link', isActive && 'active')
              }
            >
              <link.icon className="w-5 h-5" />
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <button
            onClick={() => { navigate('/'); closeSidebar(); }}
            className="sidebar-link w-full"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Store</span>
          </button>
          <button className="sidebar-link w-full text-sidebar-foreground/60 hover:text-sidebar-foreground">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="p-4 pt-[4.5rem] lg:p-8 lg:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
