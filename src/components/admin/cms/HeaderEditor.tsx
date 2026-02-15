import { useState, useEffect } from 'react';
import { useSiteContent, useUpdateSiteContent } from '@/hooks/useSiteContent';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Save, Loader2, ArrowUp, ArrowDown } from 'lucide-react';

interface NavLink {
  label: string;
  path: string;
}

interface HeaderContent {
  logoText: string;
  navLinks: NavLink[];
}

const defaultHeader: HeaderContent = {
  logoText: 'Rivervox',
  navLinks: [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Contact', path: '/contact' },
  ],
};

export const HeaderEditor = () => {
  const { content } = useSiteContent<HeaderContent>('layout', 'header', defaultHeader);
  const updateContent = useUpdateSiteContent();
  const [form, setForm] = useState<HeaderContent>(defaultHeader);

  useEffect(() => {
    if (content) setForm(content);
  }, [content]);

  const handleSave = () => {
    updateContent.mutate({ page: 'layout', section: 'header', content: form as unknown as Record<string, any> });
  };

  const moveLink = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= form.navLinks.length) return;
    const links = [...form.navLinks];
    [links[index], links[newIndex]] = [links[newIndex], links[index]];
    setForm(prev => ({ ...prev, navLinks: links }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">Logo</CardTitle></CardHeader>
        <CardContent>
          <label className="text-sm font-medium">Logo Text</label>
          <Input value={form.logoText} onChange={e => setForm(prev => ({ ...prev, logoText: e.target.value }))} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Navigation Links</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {form.navLinks.map((link, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input placeholder="Label" value={link.label} onChange={e => {
                const links = [...form.navLinks];
                links[i] = { ...links[i], label: e.target.value };
                setForm(prev => ({ ...prev, navLinks: links }));
              }} className="flex-1" />
              <Input placeholder="/path" value={link.path} onChange={e => {
                const links = [...form.navLinks];
                links[i] = { ...links[i], path: e.target.value };
                setForm(prev => ({ ...prev, navLinks: links }));
              }} className="flex-1" />
              <Button variant="ghost" size="icon" onClick={() => moveLink(i, -1)} disabled={i === 0}><ArrowUp className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => moveLink(i, 1)} disabled={i === form.navLinks.length - 1}><ArrowDown className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => setForm(prev => ({ ...prev, navLinks: prev.navLinks.filter((_, j) => j !== i) }))}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setForm(prev => ({ ...prev, navLinks: [...prev.navLinks, { label: '', path: '/' }] }))}>
            <Plus className="w-4 h-4 mr-1" /> Add Link
          </Button>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={updateContent.isPending} className="w-full">
        {updateContent.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save Header Content
      </Button>
    </div>
  );
};
