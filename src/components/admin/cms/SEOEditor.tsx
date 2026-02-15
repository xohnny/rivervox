import { useState, useEffect } from 'react';
import { useSiteContent, useUpdateSiteContent } from '@/hooks/useSiteContent';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Save, Loader2, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SEOSettings {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

const pages = [
  { key: 'home', label: 'Home', path: '/' },
  { key: 'shop', label: 'Shop', path: '/shop' },
  { key: 'contact', label: 'Contact', path: '/contact' },
  { key: 'faq', label: 'FAQ', path: '/faq' },
  { key: 'shipping-policy', label: 'Shipping Policy', path: '/shipping-policy' },
  { key: 'returns-exchanges', label: 'Returns & Exchanges', path: '/returns-exchanges' },
  { key: 'privacy-policy', label: 'Privacy Policy', path: '/privacy-policy' },
  { key: 'terms-of-service', label: 'Terms of Service', path: '/terms-of-service' },
  { key: 'size-guide', label: 'Size Guide', path: '/size-guide' },
  { key: 'wishlist', label: 'Wishlist', path: '/wishlist' },
  { key: 'tracking', label: 'Order Tracking', path: '/tracking' },
];

const defaultSEO: SEOSettings = {
  title: '',
  description: '',
  keywords: '',
  ogImage: '',
};

const PageSEOEditor = ({ pageKey, label }: { pageKey: string; label: string }) => {
  const { content } = useSiteContent<SEOSettings>('seo', pageKey, defaultSEO);
  const updateContent = useUpdateSiteContent();
  const [form, setForm] = useState<SEOSettings>(defaultSEO);

  useEffect(() => {
    if (content) setForm(content);
  }, [content]);

  const handleSave = () => {
    updateContent.mutate({ page: 'seo', section: pageKey, content: form as unknown as Record<string, any> });
  };

  const titleLength = form.title.length;
  const descLength = form.description.length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Search className="w-4 h-4" /> {label} SEO Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium">Meta Title</label>
              <span className={`text-xs ${titleLength > 60 ? 'text-destructive' : 'text-muted-foreground'}`}>{titleLength}/60</span>
            </div>
            <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Page title for search engines" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium">Meta Description</label>
              <span className={`text-xs ${descLength > 160 ? 'text-destructive' : 'text-muted-foreground'}`}>{descLength}/160</span>
            </div>
            <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Page description for search engines" rows={3} />
          </div>
          <div>
            <label className="text-sm font-medium">Keywords</label>
            <Input value={form.keywords} onChange={e => setForm(p => ({ ...p, keywords: e.target.value }))} placeholder="keyword1, keyword2, keyword3" className="mt-1" />
            <p className="text-xs text-muted-foreground mt-1">Comma-separated keywords</p>
          </div>
          <div>
            <label className="text-sm font-medium">Open Graph Image URL</label>
            <Input value={form.ogImage} onChange={e => setForm(p => ({ ...p, ogImage: e.target.value }))} placeholder="https://example.com/image.jpg" className="mt-1" />
            <p className="text-xs text-muted-foreground mt-1">Image shown when shared on social media. Leave empty for default.</p>
          </div>

          {/* Preview */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Google Preview</p>
            <p className="text-primary text-lg font-medium truncate">{form.title || 'Page Title'} | Rivervox</p>
            <p className="text-sm text-muted-foreground/70">rivervox.lovable.app</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{form.description || 'Page description will appear here...'}</p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={updateContent.isPending} className="w-full">
        {updateContent.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save SEO Settings
      </Button>
    </div>
  );
};

export const SEOEditor = () => {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Edit meta titles (under 60 chars), descriptions (under 160 chars), keywords, and social media images for each page. Changes affect search engine results and social sharing.
        </p>
      </div>

      <Tabs defaultValue="home">
        <TabsList className="flex flex-wrap h-auto gap-1">
          {pages.map(p => (
            <TabsTrigger key={p.key} value={p.key}>{p.label}</TabsTrigger>
          ))}
        </TabsList>
        {pages.map(p => (
          <TabsContent key={p.key} value={p.key}>
            <PageSEOEditor pageKey={p.key} label={p.label} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
