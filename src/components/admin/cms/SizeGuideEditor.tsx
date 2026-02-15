import { useState, useEffect } from 'react';
import { useSiteContent, useUpdateSiteContent } from '@/hooks/useSiteContent';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SizeGuideContent {
  heading: string;
  subtitle: string;
  howToMeasure: { label: string; description: string }[];
  menHeaders: string[];
  menRows: string[][];
  womenHeaders: string[];
  womenRows: string[][];
  childrenHeaders: string[];
  childrenRows: string[][];
  sizingTips: string[];
}

const defaultContent: SizeGuideContent = {
  heading: 'Size Guide',
  subtitle: 'Find your perfect fit with our comprehensive size charts.',
  howToMeasure: [],
  menHeaders: ['Size', 'Chest (in)', 'Waist (in)', 'Length (in)', 'Shoulder (in)'],
  menRows: [],
  womenHeaders: ['Size', 'Bust (in)', 'Waist (in)', 'Hips (in)', 'Length (in)'],
  womenRows: [],
  childrenHeaders: ['Size', 'Age', 'Height (in)', 'Chest (in)', 'Waist (in)'],
  childrenRows: [],
  sizingTips: [],
};

const TableEditor = ({ headers, rows, onHeadersChange, onRowsChange }: {
  headers: string[];
  rows: string[][];
  onHeadersChange: (h: string[]) => void;
  onRowsChange: (r: string[][]) => void;
}) => (
  <div className="space-y-3">
    <div className="flex gap-2 items-center">
      {headers.map((h, i) => (
        <Input key={i} value={h} onChange={e => {
          const newH = [...headers];
          newH[i] = e.target.value;
          onHeadersChange(newH);
        }} className="text-xs font-semibold" />
      ))}
    </div>
    {rows.map((row, ri) => (
      <div key={ri} className="flex gap-2 items-center">
        {row.map((cell, ci) => (
          <Input key={ci} value={cell} onChange={e => {
            const newRows = rows.map(r => [...r]);
            newRows[ri][ci] = e.target.value;
            onRowsChange(newRows);
          }} className="text-xs" />
        ))}
        <Button variant="ghost" size="icon" onClick={() => onRowsChange(rows.filter((_, i) => i !== ri))}>
          <Trash2 className="w-3 h-3 text-destructive" />
        </Button>
      </div>
    ))}
    <Button variant="outline" size="sm" onClick={() => onRowsChange([...rows, headers.map(() => '')])}>
      <Plus className="w-4 h-4 mr-1" /> Add Row
    </Button>
  </div>
);

export const SizeGuideEditor = () => {
  const { content } = useSiteContent<SizeGuideContent>('size-guide', 'main', defaultContent);
  const updateContent = useUpdateSiteContent();
  const [form, setForm] = useState<SizeGuideContent>(defaultContent);

  useEffect(() => {
    if (content) setForm(content);
  }, [content]);

  const handleSave = () => {
    updateContent.mutate({ page: 'size-guide', section: 'main', content: form as unknown as Record<string, any> });
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
          <div>
            <label className="text-sm font-medium">Subtitle</label>
            <Input value={form.subtitle} onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">How to Measure</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {form.howToMeasure.map((item, i) => (
            <div key={i} className="flex gap-2 items-start">
              <Input value={item.label} onChange={e => {
                const items = [...form.howToMeasure];
                items[i] = { ...items[i], label: e.target.value };
                setForm(p => ({ ...p, howToMeasure: items }));
              }} className="w-28" placeholder="Label" />
              <Input value={item.description} onChange={e => {
                const items = [...form.howToMeasure];
                items[i] = { ...items[i], description: e.target.value };
                setForm(p => ({ ...p, howToMeasure: items }));
              }} placeholder="Description" />
              <Button variant="ghost" size="icon" onClick={() => setForm(p => ({ ...p, howToMeasure: p.howToMeasure.filter((_, j) => j !== i) }))}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setForm(p => ({ ...p, howToMeasure: [...p.howToMeasure, { label: '', description: '' }] }))}>
            <Plus className="w-4 h-4 mr-1" /> Add Measurement
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Size Charts</CardTitle></CardHeader>
        <CardContent>
          <Tabs defaultValue="men">
            <TabsList className="mb-4">
              <TabsTrigger value="men">Men</TabsTrigger>
              <TabsTrigger value="women">Women</TabsTrigger>
              <TabsTrigger value="children">Children</TabsTrigger>
            </TabsList>
            <TabsContent value="men">
              <TableEditor headers={form.menHeaders} rows={form.menRows}
                onHeadersChange={h => setForm(p => ({ ...p, menHeaders: h }))}
                onRowsChange={r => setForm(p => ({ ...p, menRows: r }))} />
            </TabsContent>
            <TabsContent value="women">
              <TableEditor headers={form.womenHeaders} rows={form.womenRows}
                onHeadersChange={h => setForm(p => ({ ...p, womenHeaders: h }))}
                onRowsChange={r => setForm(p => ({ ...p, womenRows: r }))} />
            </TabsContent>
            <TabsContent value="children">
              <TableEditor headers={form.childrenHeaders} rows={form.childrenRows}
                onHeadersChange={h => setForm(p => ({ ...p, childrenHeaders: h }))}
                onRowsChange={r => setForm(p => ({ ...p, childrenRows: r }))} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Sizing Tips</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {form.sizingTips.map((tip, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input value={tip} onChange={e => {
                const tips = [...form.sizingTips];
                tips[i] = e.target.value;
                setForm(p => ({ ...p, sizingTips: tips }));
              }} />
              <Button variant="ghost" size="icon" onClick={() => setForm(p => ({ ...p, sizingTips: p.sizingTips.filter((_, j) => j !== i) }))}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setForm(p => ({ ...p, sizingTips: [...p.sizingTips, ''] }))}>
            <Plus className="w-4 h-4 mr-1" /> Add Tip
          </Button>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={updateContent.isPending} className="w-full">
        {updateContent.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save Size Guide
      </Button>
    </div>
  );
};
