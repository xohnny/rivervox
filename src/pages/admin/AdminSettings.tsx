import { useState } from 'react';
import { Save, Store, Truck, Bell, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: 'Settings Saved',
      description: 'Your changes have been saved successfully.',
    });
    setIsSaving(false);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your store configuration</p>
      </div>

      {/* Store Information */}
      <section className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Store className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg font-display font-semibold">Store Information</h2>
        </div>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Store Name</Label>
              <Input defaultValue="Rivervox" className="mt-1" />
            </div>
            <div>
              <Label>Store Email</Label>
              <Input type="email" defaultValue="hello@rivervox.com" className="mt-1" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Phone Number</Label>
              <Input type="tel" defaultValue="+971 50 123 4567" className="mt-1" />
            </div>
            <div>
              <Label>Currency</Label>
              <Input defaultValue="USD ($)" className="mt-1" disabled />
            </div>
          </div>
          <div>
            <Label>Store Address</Label>
            <Textarea
              defaultValue="123 Fashion Avenue, Dubai Mall, Level 2, Dubai, UAE"
              className="mt-1"
              rows={2}
            />
          </div>
        </div>
      </section>

      {/* Shipping Settings */}
      <section className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Truck className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg font-display font-semibold">Shipping Settings</h2>
        </div>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Standard Shipping Rate ($)</Label>
              <Input type="number" defaultValue="100" className="mt-1" />
            </div>
            <div>
              <Label>Free Shipping Threshold ($)</Label>
              <Input type="number" defaultValue="2000" className="mt-1" />
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <Label>Enable Free Shipping</Label>
              <p className="text-sm text-muted-foreground">
                Free shipping for orders above threshold
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <Label>International Shipping</Label>
              <p className="text-sm text-muted-foreground">
                Allow orders from international customers
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg font-display font-semibold">Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <Label>New Order Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when a new order is placed
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <Label>Low Stock Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Alert when product stock is below 5 units
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <Label>Customer Messages</Label>
              <p className="text-sm text-muted-foreground">
                Notifications for new contact form messages
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg font-display font-semibold">Security</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Admin Email</Label>
            <Input type="email" defaultValue="admin@rivervox.com" className="mt-1" />
          </div>
          <div>
            <Label>Change Password</Label>
            <Input type="password" placeholder="Enter new password" className="mt-1" />
          </div>
          <div>
            <Label>Confirm Password</Label>
            <Input type="password" placeholder="Confirm new password" className="mt-1" />
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90"
        >
          {isSaving ? (
            <span className="animate-pulse">Saving...</span>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
