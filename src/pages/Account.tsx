import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { User, Package, Heart, Settings, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { OrderHistory } from '@/components/account/OrderHistory';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type TabType = 'profile' | 'orders' | 'wishlist' | 'settings';

const Account = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-display font-bold mb-2">Welcome</h1>
              <p className="text-muted-foreground">
                Sign in to access your account, track orders, and save your wishlist.
              </p>
            </div>

            <div className="flex flex-col gap-4 mb-8">
              <Button asChild className="w-full h-12">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild className="w-full h-12">
                <Link to="/register">Create Account</Link>
              </Button>
            </div>

            {/* Guest Options */}
            <div className="pt-8 border-t border-border">
              <p className="text-center text-sm text-muted-foreground mb-4">
                Or continue as guest
              </p>
              <div className="flex flex-col gap-3">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/tracking">
                    <Package className="w-4 h-4 mr-2" />
                    Track Your Order
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'orders' as const, label: 'Orders', icon: Package },
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'wishlist' as const, label: 'Wishlist', icon: Heart },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-display font-bold mb-8">My Account</h1>
          
          <div className="grid md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary'
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
              >
                {signingOut ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <LogOut className="w-5 h-5" />
                )}
                Sign Out
              </button>
            </div>

            {/* Content */}
            <div className="md:col-span-3 bg-card border border-border rounded-xl p-6">
              {activeTab === 'orders' && (
                <>
                  <h2 className="text-xl font-semibold mb-6">Order History</h2>
                  <OrderHistory />
                </>
              )}

              {activeTab === 'profile' && (
                <>
                  <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                  <div className="space-y-4">
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={user.email || ''}
                        disabled
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        type="text"
                        defaultValue={user.user_metadata?.full_name || ''}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Member Since</Label>
                      <Input
                        type="text"
                        value={new Date(user.created_at).toLocaleDateString()}
                        disabled
                        className="mt-2"
                      />
                    </div>
                    <Button>Save Changes</Button>
                  </div>
                </>
              )}

              {activeTab === 'wishlist' && (
                <>
                  <h2 className="text-xl font-semibold mb-6">My Wishlist</h2>
                  <p className="text-muted-foreground mb-4">
                    View and manage your saved items.
                  </p>
                  <Button asChild>
                    <Link to="/wishlist">View Wishlist</Link>
                  </Button>
                </>
              )}

              {activeTab === 'settings' && (
                <>
                  <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <h3 className="font-medium mb-1">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your email preferences and notifications.
                      </p>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <h3 className="font-medium mb-1">Password</h3>
                      <p className="text-sm text-muted-foreground">
                        Update your account password.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
