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
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Inventory', path: '/admin/inventory', icon: Warehouse },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', path: '/admin/customers', icon: Users },
  { name: 'Reviews', path: '/admin/reviews', icon: Star },
  { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export const AdminLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar fixed left-0 top-0 h-full flex flex-col z-50">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-2xl font-display font-bold text-sidebar-foreground">
            Rivervox
          </h1>
          <p className="text-xs text-sidebar-foreground/60 mt-1">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
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
            onClick={() => navigate('/')}
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
      <main className="flex-1 ml-64">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
