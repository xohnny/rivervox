import { useState, useEffect } from 'react';
import { useSiteContent, useUpdateSiteContent } from '@/hooks/useSiteContent';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Save, Loader2, ArrowUp, ArrowDown } from 'lucide-react';

interface PolicySection {
  title: string;
  content: string;
}

interface PolicyContent {
  heading: string;
  intro?: string;
  lastUpdated?: string;
  sections: PolicySection[];
  [key: string]: any;
}

interface PolicyEditorProps {
  page: string;
  title: string;
  defaultContent: PolicyContent;
  showIntro?: boolean;
  showLastUpdated?: boolean;
}

export const PolicyEditor = ({ page, title, defaultContent, showIntro = false, showLastUpdated = false }: PolicyEditorProps) => {
  const { content } = useSiteContent<PolicyContent>(page, 'main', defaultContent);
  const updateContent = useUpdateSiteContent();
  const [form, setForm] = useState<PolicyContent>(defaultContent);

  useEffect(() => {
    if (content) setForm(content);
  }, [content]);

  const handleSave = () => {
    updateContent.mutate({ page, section: 'main', content: form as unknown as Record<string, any> });
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= form.sections.length) return;
    const sections = [...form.sections];
    [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];
    setForm(p => ({ ...p, sections }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">Page Header</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm font-medium">Heading</label>
            <Input value={form.heading} onChange={e => setForm(p => ({ ...p, heading: e.target.value }))} />
          </div>
          {showIntro && (
            <div>
              <label className="text-sm font-medium">Introduction</label>
              <Textarea value={form.intro || ''} onChange={e => setForm(p => ({ ...p, intro: e.target.value }))} rows={3} />
            </div>
          )}
          {showLastUpdated && (
            <div>
              <label className="text-sm font-medium">Last Updated</label>
              <Input value={form.lastUpdated || ''} onChange={e => setForm(p => ({ ...p, lastUpdated: e.target.value }))} />
            </div>
          )}
        </CardContent>
      </Card>

      {form.sections.map((section, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Section {i + 1}</CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => moveSection(i, -1)} disabled={i === 0}><ArrowUp className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => moveSection(i, 1)} disabled={i === form.sections.length - 1}><ArrowDown className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => setForm(p => ({ ...p, sections: p.sections.filter((_, j) => j !== i) }))}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input value={section.title} onChange={e => {
                const sections = [...form.sections];
                sections[i] = { ...sections[i], title: e.target.value };
                setForm(p => ({ ...p, sections }));
              }} />
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea value={section.content} onChange={e => {
                const sections = [...form.sections];
                sections[i] = { ...sections[i], content: e.target.value };
                setForm(p => ({ ...p, sections }));
              }} rows={6} />
              <p className="text-xs text-muted-foreground mt-1">Use bullet points with • and line breaks for formatting.</p>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" onClick={() => setForm(p => ({ ...p, sections: [...p.sections, { title: '', content: '' }] }))} className="w-full">
        <Plus className="w-4 h-4 mr-2" /> Add Section
      </Button>

      <Button onClick={handleSave} disabled={updateContent.isPending} className="w-full">
        {updateContent.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save {title}
      </Button>
    </div>
  );
};
