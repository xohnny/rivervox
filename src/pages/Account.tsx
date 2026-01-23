import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { User, Package, Heart, MapPin, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Account = () => {
  // Placeholder - would be replaced with actual auth state
  const isLoggedIn = false;

  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-display font-bold mb-2">Welcome Back</h1>
              <p className="text-muted-foreground">
                Sign in to access your account, track orders, and more.
              </p>
            </div>

            {/* Login Form */}
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-border" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Button className="w-full h-12">Sign In</Button>
              </form>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary font-medium hover:underline">
                  Create one
                </Link>
              </p>
            </div>

            {/* Guest Options */}
            <div className="mt-8 pt-8 border-t border-border">
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

  // Logged in view (placeholder)
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
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors">
                <Heart className="w-5 h-5" />
                Wishlist
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors">
                <MapPin className="w-5 h-5" />
                Addresses
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors">
                <Settings className="w-5 h-5" />
                Settings
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>

            {/* Content */}
            <div className="md:col-span-2 bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      defaultValue="Ahmed"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      defaultValue="Hassan"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="ahmed@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    defaultValue="+971 50 123 4567"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background"
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
