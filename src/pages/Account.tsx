import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { User, Package, Heart, Settings, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Account = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-display font-bold mb-8">My Account</h1>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground">
                <User className="w-5 h-5" />
                Profile
              </button>
              <Link to="/tracking" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors">
                <Package className="w-5 h-5" />
                Orders
              </Link>
              <Link to="/wishlist" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors">
                <Heart className="w-5 h-5" />
                Wishlist
              </Link>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors">
                <Settings className="w-5 h-5" />
                Settings
              </button>
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
            <div className="md:col-span-2 bg-card border border-border rounded-xl p-6">
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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
