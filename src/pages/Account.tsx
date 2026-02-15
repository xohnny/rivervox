import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { User, Package, Heart, Settings, LogOut, Loader2, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';
import { OrderHistory } from '@/components/account/OrderHistory';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type TabType = 'profile' | 'orders' | 'wishlist' | 'settings';

const Account = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [signingOut, setSigningOut] = useState(false);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [promoNotifications, setPromoNotifications] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      toast.error('Failed to update password');
    } finally {
      setChangingPassword(false);
    }
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
            {/* Mobile Dropdown */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      {tabs.find(t => t.id === activeTab)?.icon && (
                        <span>{(() => {
                          const Icon = tabs.find(t => t.id === activeTab)?.icon;
                          return Icon ? <Icon className="w-4 h-4" /> : null;
                        })()}</span>
                      )}
                      {tabs.find(t => t.id === activeTab)?.label}
                    </span>
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[calc(100vw-2rem)] bg-card border border-border" align="start">
                  {tabs.map((tab) => (
                    <DropdownMenuItem
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'flex items-center gap-3 cursor-pointer',
                        activeTab === tab.id && 'bg-primary text-primary-foreground'
                      )}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="flex items-center gap-3 text-destructive cursor-pointer"
                  >
                    {signingOut ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:block space-y-2">
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
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
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
                    <Button
                      onClick={async () => {
                        setSavingProfile(true);
                        try {
                          const { error: authError } = await supabase.auth.updateUser({
                            data: { full_name: fullName },
                          });
                          if (authError) throw authError;
                          const { error: profileError } = await supabase
                            .from('profiles')
                            .update({ full_name: fullName })
                            .eq('user_id', user.id);
                          if (profileError) throw profileError;
                          toast.success('Profile updated successfully');
                        } catch (err: any) {
                          toast.error(err.message || 'Failed to update profile');
                        } finally {
                          setSavingProfile(false);
                        }
                      }}
                      disabled={savingProfile}
                    >
                      {savingProfile && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                      Save Changes
                    </Button>
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
                  <div className="space-y-6">
                    {/* Email Notifications */}
                    <div className="p-4 bg-secondary/50 rounded-lg space-y-4">
                      <div>
                        <h3 className="font-medium mb-1">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Manage your email preferences and notifications.
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="order-notif" className="cursor-pointer">Order updates & shipping</Label>
                        <Switch id="order-notif" checked={orderNotifications} onCheckedChange={setOrderNotifications} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="promo-notif" className="cursor-pointer">Promotions & new arrivals</Label>
                        <Switch id="promo-notif" checked={promoNotifications} onCheckedChange={setPromoNotifications} />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="p-4 bg-secondary/50 rounded-lg space-y-4">
                      <div>
                        <h3 className="font-medium mb-1">Password</h3>
                        <p className="text-sm text-muted-foreground">
                          Update your account password.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label>New Password</Label>
                          <div className="relative mt-1">
                            <Input
                              type={showNewPassword ? 'text' : 'password'}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Enter new password"
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <Label>Confirm New Password</Label>
                          <div className="relative mt-1">
                            <Input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirm new password"
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <Button onClick={handleChangePassword} disabled={changingPassword}>
                          {changingPassword ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          Update Password
                        </Button>
                      </div>
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
