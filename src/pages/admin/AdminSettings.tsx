import { useState, useEffect, useRef } from 'react';
import { Save, Store, Truck, Bell, Shield, Upload, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface StoreSettings {
  id: string;
  store_name: string;
  store_email: string;
  phone_number: string;
  store_address: string;
  standard_shipping_rate: number;
  free_shipping_threshold: number;
  enable_free_shipping: boolean;
  international_shipping: boolean;
  new_order_notifications: boolean;
  low_stock_alerts: boolean;
  customer_messages_notifications: boolean;
  admin_email: string;
  logo_url: string | null;
  shipping_rate_us: number;
  shipping_rate_uk: number;
}

const AdminSettings = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error fetching settings:', error);
        toast({ title: 'Error', description: 'Failed to load settings.', variant: 'destructive' });
      } else if (data) {
        setSettings(data as unknown as StoreSettings);
      }
      setIsLoading(false);
    };
    fetchSettings();
  }, []);

  const updateField = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => {
    setSettings(prev => prev ? { ...prev, [key]: value } : prev);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please upload an image file.', variant: 'destructive' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Logo must be under 5MB.', variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `logo-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('store-assets')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      toast({ title: 'Upload failed', description: uploadError.message, variant: 'destructive' });
      setIsUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('store-assets').getPublicUrl(filePath);
    updateField('logo_url', urlData.publicUrl);
    setIsUploading(false);
    toast({ title: 'Logo uploaded', description: 'Remember to save your changes.' });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveLogo = () => {
    updateField('logo_url', null);
  };

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    const { id, ...updates } = settings;
    const { error } = await supabase
      .from('store_settings')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to save settings.', variant: 'destructive' });
    } else {
      toast({ title: 'Settings Saved', description: 'Your changes have been saved successfully.' });
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-3xl">
        <div>
          <h1 className="text-3xl font-display font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your store configuration</p>
        </div>
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="space-y-8 max-w-3xl">
        <h1 className="text-3xl font-display font-bold">Settings</h1>
        <p className="text-muted-foreground">No settings found. Please contact support.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
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
          {/* Logo Upload */}
          <div>
            <Label>Store Logo</Label>
            <div className="mt-2 flex items-center gap-4">
              {settings.logo_url ? (
                <div className="relative group">
                  <img
                    src={settings.logo_url}
                    alt="Store logo"
                    className="w-20 h-20 rounded-lg object-contain border border-border bg-muted"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/50">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <span className="animate-pulse">Uploading...</span>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      {settings.logo_url ? 'Change Logo' : 'Upload Logo'}
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG or SVG. Max 5MB.</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Store Name</Label>
              <Input value={settings.store_name} onChange={e => updateField('store_name', e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Store Email</Label>
              <Input type="email" value={settings.store_email} onChange={e => updateField('store_email', e.target.value)} className="mt-1" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Phone Number</Label>
              <Input type="tel" value={settings.phone_number} onChange={e => updateField('phone_number', e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Currency</Label>
              <Input defaultValue="USD ($)" className="mt-1" disabled />
            </div>
          </div>
          <div>
            <Label>Store Address</Label>
            <Textarea value={settings.store_address} onChange={e => updateField('store_address', e.target.value)} className="mt-1" rows={2} />
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
          <p className="text-sm text-muted-foreground">Set shipping rates per country. These rates are applied at checkout.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>🇺🇸 US Shipping Rate ($)</Label>
              <Input type="number" step="0.01" min="0" value={settings.shipping_rate_us} onChange={e => updateField('shipping_rate_us', Number(e.target.value))} className="mt-1" />
            </div>
            <div>
              <Label>🇬🇧 UK Shipping Rate ($)</Label>
              <Input type="number" step="0.01" min="0" value={settings.shipping_rate_uk} onChange={e => updateField('shipping_rate_uk', Number(e.target.value))} className="mt-1" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Free Shipping Threshold ($)</Label>
              <Input type="number" step="0.01" min="0" value={settings.free_shipping_threshold} onChange={e => updateField('free_shipping_threshold', Number(e.target.value))} className="mt-1" />
              <p className="text-xs text-muted-foreground mt-1">Orders above this amount get free shipping. Set to 0 to disable.</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <Label>Enable Free Shipping</Label>
              <p className="text-sm text-muted-foreground">Free shipping for orders above threshold</p>
            </div>
            <Switch checked={settings.enable_free_shipping} onCheckedChange={v => updateField('enable_free_shipping', v)} />
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
              <p className="text-sm text-muted-foreground">Get notified when a new order is placed</p>
            </div>
            <Switch checked={settings.new_order_notifications} onCheckedChange={v => updateField('new_order_notifications', v)} />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <Label>Low Stock Alerts</Label>
              <p className="text-sm text-muted-foreground">Alert when product stock is below 5 units</p>
            </div>
            <Switch checked={settings.low_stock_alerts} onCheckedChange={v => updateField('low_stock_alerts', v)} />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <Label>Customer Messages</Label>
              <p className="text-sm text-muted-foreground">Notifications for new contact form messages</p>
            </div>
            <Switch checked={settings.customer_messages_notifications} onCheckedChange={v => updateField('customer_messages_notifications', v)} />
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
            <Input type="email" value={settings.admin_email} onChange={e => updateField('admin_email', e.target.value)} className="mt-1" />
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
        <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90">
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
