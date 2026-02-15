import { useState, useEffect } from 'react';
import { useSiteContent, useUpdateSiteContent } from '@/hooks/useSiteContent';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';

interface FooterLink {
  label: string;
  path: string;
}

interface FooterContent {
  brandName: string;
  brandDescription: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
    youtube: string;
    telegram: string;
  };
  quickLinks: FooterLink[];
  customerServiceLinks: FooterLink[];
  contact: {
    address: string;
    phone: string;
    email: string;
  };
  copyrightText: string;
  bottomLinks: FooterLink[];
}

const defaultFooter: FooterContent = {
  brandName: 'Rivervox',
  brandDescription: 'Premium Islamic-inspired fashion for the modern family. Elegance meets modesty in every piece.',
  socialLinks: { instagram: '#', facebook: '#', twitter: '#', youtube: '#', telegram: '#' },
  quickLinks: [
    { label: 'Shop All', path: '/shop' },
    { label: "Men's Collection", path: '/shop?category=men' },
    { label: "Women's Collection", path: '/shop?category=women' },
    { label: "Children's Collection", path: '/shop?category=children' },
    { label: 'Track Order', path: '/tracking' },
  ],
  customerServiceLinks: [
    { label: 'Contact Us', path: '/contact' },
    { label: 'Shipping Policy', path: '/shipping-policy' },
    { label: 'Returns & Exchanges', path: '/returns-exchanges' },
    { label: 'Size Guide', path: '/size-guide' },
    { label: 'FAQ', path: '/faq' },
  ],
  contact: { address: '8206 Louisiana Blvd NE, Ste A #8412, Albuquerque, NM 87113, USA', phone: '+1 (781) 870-4028', email: 'hello@rivervox.com' },
  copyrightText: 'Rivervox. All rights reserved.',
  bottomLinks: [
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms of Service', path: '/terms-of-service' },
  ],
};

export const FooterEditor = () => {
  const { content } = useSiteContent<FooterContent>('layout', 'footer', defaultFooter);
  const updateContent = useUpdateSiteContent();
  const [form, setForm] = useState<FooterContent>(defaultFooter);

  useEffect(() => {
    if (content) setForm(content);
  }, [content]);

  const handleSave = () => {
    updateContent.mutate({ page: 'layout', section: 'footer', content: form as unknown as Record<string, any> });
  };

  const updateLink = (list: 'quickLinks' | 'customerServiceLinks' | 'bottomLinks', index: number, field: 'label' | 'path', value: string) => {
    setForm(prev => ({
      ...prev,
      [list]: prev[list].map((item, i) => i === index ? { ...item, [field]: value } : item),
    }));
  };

  const addLink = (list: 'quickLinks' | 'customerServiceLinks' | 'bottomLinks') => {
    setForm(prev => ({ ...prev, [list]: [...prev[list], { label: '', path: '/' }] }));
  };

  const removeLink = (list: 'quickLinks' | 'customerServiceLinks' | 'bottomLinks', index: number) => {
    setForm(prev => ({ ...prev, [list]: prev[list].filter((_, i) => i !== index) }));
  };

  const LinkListEditor = ({ title, list }: { title: string; list: 'quickLinks' | 'customerServiceLinks' | 'bottomLinks' }) => (
    <Card>
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {form[list].map((link, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input placeholder="Label" value={link.label} onChange={e => updateLink(list, i, 'label', e.target.value)} className="flex-1" />
            <Input placeholder="/path" value={link.path} onChange={e => updateLink(list, i, 'path', e.target.value)} className="flex-1" />
            <Button variant="ghost" size="icon" onClick={() => removeLink(list, i)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => addLink(list)}><Plus className="w-4 h-4 mr-1" /> Add Link</Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Brand */}
      <Card>
        <CardHeader><CardTitle className="text-base">Brand</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm font-medium">Brand Name</label>
            <Input value={form.brandName} onChange={e => setForm(prev => ({ ...prev, brandName: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium">Brand Description</label>
            <Textarea value={form.brandDescription} onChange={e => setForm(prev => ({ ...prev, brandDescription: e.target.value }))} rows={3} />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader><CardTitle className="text-base">Social Media Links</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(['instagram', 'facebook', 'twitter', 'youtube', 'telegram'] as const).map(platform => (
            <div key={platform}>
              <label className="text-sm font-medium capitalize">{platform}</label>
              <Input value={form.socialLinks[platform]} onChange={e => setForm(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [platform]: e.target.value } }))} placeholder={`https://${platform}.com/...`} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Link Lists */}
      <LinkListEditor title="Quick Links" list="quickLinks" />
      <LinkListEditor title="Customer Service Links" list="customerServiceLinks" />

      {/* Contact Info */}
      <Card>
        <CardHeader><CardTitle className="text-base">Contact Info</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm font-medium">Address</label>
            <Textarea value={form.contact.address} onChange={e => setForm(prev => ({ ...prev, contact: { ...prev.contact, address: e.target.value } }))} rows={2} />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input value={form.contact.phone} onChange={e => setForm(prev => ({ ...prev, contact: { ...prev.contact, phone: e.target.value } }))} />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input value={form.contact.email} onChange={e => setForm(prev => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))} />
          </div>
        </CardContent>
      </Card>

      {/* Bottom Links */}
      <LinkListEditor title="Bottom Links (Privacy, Terms, etc.)" list="bottomLinks" />

      {/* Copyright */}
      <Card>
        <CardHeader><CardTitle className="text-base">Copyright</CardTitle></CardHeader>
        <CardContent>
          <Input value={form.copyrightText} onChange={e => setForm(prev => ({ ...prev, copyrightText: e.target.value }))} />
          <p className="text-xs text-muted-foreground mt-1">The year is added automatically before this text.</p>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={updateContent.isPending} className="w-full">
        {updateContent.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save Footer Content
      </Button>
    </div>
  );
};
