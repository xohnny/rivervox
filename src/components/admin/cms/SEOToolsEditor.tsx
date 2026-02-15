import { useState, useEffect } from 'react';
import { useSiteContent, useUpdateSiteContent } from '@/hooks/useSiteContent';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Save, Loader2, Globe, Bot, ExternalLink } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// --- Sitemap Types ---
interface SitemapPage {
  key: string;
  path: string;
  priority: string;
  changefreq: string;
  enabled: boolean;
}

interface SitemapConfig {
  includeProducts: boolean;
  productPriority: string;
  productChangefreq: string;
  pages: SitemapPage[];
}

const defaultSitemap: SitemapConfig = {
  includeProducts: true,
  productPriority: '0.8',
  productChangefreq: 'weekly',
  pages: [],
};

// --- Robots Types ---
interface RobotsRule {
  userAgent: string;
  action: 'Allow' | 'Disallow';
  path: string;
}

interface RobotsConfig {
  rules: RobotsRule[];
  sitemapUrl: string;
}

const defaultRobots: RobotsConfig = {
  rules: [],
  sitemapUrl: '',
};

const changefreqOptions = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
const priorityOptions = ['0.0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1.0'];

// --- Sitemap Editor ---
const SitemapEditor = () => {
  const { content } = useSiteContent<SitemapConfig>('config', 'sitemap', defaultSitemap);
  const updateContent = useUpdateSiteContent();
  const [form, setForm] = useState<SitemapConfig>(defaultSitemap);

  useEffect(() => {
    if (content) setForm(content);
  }, [content]);

  const handleSave = () => {
    updateContent.mutate({ page: 'config', section: 'sitemap', content: form as unknown as Record<string, any> });
  };

  const updatePage = (index: number, field: keyof SitemapPage, value: any) => {
    setForm(p => ({
      ...p,
      pages: p.pages.map((pg, i) => i === index ? { ...pg, [field]: value } : pg),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Configure which pages appear in your sitemap, their priority (0.0–1.0), and how often search engines should re-crawl them. The sitemap is generated dynamically from these settings.
        </p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Product Pages</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Include Product Pages</p>
              <p className="text-xs text-muted-foreground">Automatically add all active products to the sitemap</p>
            </div>
            <Switch checked={form.includeProducts} onCheckedChange={v => setForm(p => ({ ...p, includeProducts: v }))} />
          </div>
          {form.includeProducts && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select value={form.productPriority} onValueChange={v => setForm(p => ({ ...p, productPriority: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{priorityOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Change Frequency</label>
                <Select value={form.productChangefreq} onValueChange={v => setForm(p => ({ ...p, productChangefreq: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{changefreqOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Pages</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-[auto_1fr_100px_120px_60px] gap-2 text-xs font-semibold text-muted-foreground px-1">
              <span>Include</span><span>Path</span><span>Priority</span><span>Frequency</span><span></span>
            </div>
            {form.pages.map((page, i) => (
              <div key={page.key} className="grid grid-cols-[auto_1fr_100px_120px_60px] gap-2 items-center">
                <Switch checked={page.enabled} onCheckedChange={v => updatePage(i, 'enabled', v)} />
                <div className="flex items-center gap-2">
                  <Badge variant={page.enabled ? 'default' : 'secondary'} className="text-xs font-mono">{page.path}</Badge>
                </div>
                <Select value={page.priority} onValueChange={v => updatePage(i, 'priority', v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{priorityOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={page.changefreq} onValueChange={v => updatePage(i, 'changefreq', v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{changefreqOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
                <span className="text-xs text-muted-foreground truncate">{page.key}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={updateContent.isPending} className="w-full">
        {updateContent.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save Sitemap Settings
      </Button>
    </div>
  );
};

// --- Robots Editor ---
const RobotsEditor = () => {
  const { content } = useSiteContent<RobotsConfig>('config', 'robots', defaultRobots);
  const updateContent = useUpdateSiteContent();
  const [form, setForm] = useState<RobotsConfig>(defaultRobots);

  useEffect(() => {
    if (content) setForm(content);
  }, [content]);

  const handleSave = () => {
    updateContent.mutate({ page: 'config', section: 'robots', content: form as unknown as Record<string, any> });
  };

  const addRule = () => {
    setForm(p => ({ ...p, rules: [...p.rules, { userAgent: '*', action: 'Allow', path: '/' }] }));
  };

  const removeRule = (index: number) => {
    setForm(p => ({ ...p, rules: p.rules.filter((_, i) => i !== index) }));
  };

  const updateRule = (index: number, field: keyof RobotsRule, value: string) => {
    setForm(p => ({
      ...p,
      rules: p.rules.map((r, i) => i === index ? { ...r, [field]: value } : r),
    }));
  };

  // Generate preview
  const preview = (() => {
    const lines: string[] = [];
    const grouped: Record<string, RobotsRule[]> = {};
    form.rules.forEach(r => {
      if (!grouped[r.userAgent]) grouped[r.userAgent] = [];
      grouped[r.userAgent].push(r);
    });
    Object.entries(grouped).forEach(([agent, rules]) => {
      lines.push(`User-agent: ${agent}`);
      rules.forEach(r => lines.push(`${r.action}: ${r.path}`));
      lines.push('');
    });
    if (form.sitemapUrl) lines.push(`Sitemap: ${form.sitemapUrl}`);
    return lines.join('\n');
  })();

  return (
    <div className="space-y-6">
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Control how search engine crawlers access your site. Add rules to allow or disallow specific paths for different bots.
        </p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Crawler Rules</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {form.rules.map((rule, i) => (
            <div key={i} className="grid grid-cols-[1fr_100px_1fr_auto] gap-2 items-center">
              <Input value={rule.userAgent} onChange={e => updateRule(i, 'userAgent', e.target.value)} placeholder="User-agent" className="text-sm" />
              <Select value={rule.action} onValueChange={v => updateRule(i, 'action', v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Allow">Allow</SelectItem>
                  <SelectItem value="Disallow">Disallow</SelectItem>
                </SelectContent>
              </Select>
              <Input value={rule.path} onChange={e => updateRule(i, 'path', e.target.value)} placeholder="/path" className="text-sm font-mono" />
              <Button variant="ghost" size="icon" onClick={() => removeRule(i)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addRule}><Plus className="w-4 h-4 mr-1" /> Add Rule</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Sitemap URL</CardTitle></CardHeader>
        <CardContent>
          <Input value={form.sitemapUrl} onChange={e => setForm(p => ({ ...p, sitemapUrl: e.target.value }))} placeholder="https://..." className="font-mono text-sm" />
          <p className="text-xs text-muted-foreground mt-1">The URL to your sitemap, referenced in robots.txt</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Preview</CardTitle></CardHeader>
        <CardContent>
          <pre className="p-4 bg-muted rounded-lg text-xs font-mono whitespace-pre-wrap overflow-x-auto">{preview}</pre>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={updateContent.isPending} className="w-full">
        {updateContent.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save Robots.txt Settings
      </Button>
    </div>
  );
};

// --- Main Component ---
export const SEOToolsEditor = () => {
  return (
    <Tabs defaultValue="sitemap" className="space-y-6">
      <TabsList>
        <TabsTrigger value="sitemap" className="gap-2"><Globe className="w-4 h-4" /> Sitemap</TabsTrigger>
        <TabsTrigger value="robots" className="gap-2"><Bot className="w-4 h-4" /> Robots.txt</TabsTrigger>
      </TabsList>
      <TabsContent value="sitemap"><SitemapEditor /></TabsContent>
      <TabsContent value="robots"><RobotsEditor /></TabsContent>
    </Tabs>
  );
};
