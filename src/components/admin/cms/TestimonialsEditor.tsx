import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSiteContent, useUpdateSiteContent } from '@/hooks/useSiteContent';
import { Loader2 } from 'lucide-react';

const defaultTestimonials = {
  section_label: 'What Our Customers Say',
  section_title: 'Trusted by Thousands',
};

export const TestimonialsEditor = () => {
  const { content, isLoading } = useSiteContent('home', 'testimonials', defaultTestimonials);
  const updateContent = useUpdateSiteContent();
  const [form, setForm] = useState(defaultTestimonials);

  useEffect(() => {
    if (content) setForm({ ...defaultTestimonials, ...content });
  }, [content]);

  const handleSave = () => {
    updateContent.mutate({ page: 'home', section: 'testimonials', content: form });
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <Card>
      <CardHeader><CardTitle>Testimonials Section</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Reviews are managed from the Reviews page. Here you can edit the section headings.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Section Label</Label>
            <Input value={form.section_label} onChange={e => setForm(prev => ({ ...prev, section_label: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input value={form.section_title} onChange={e => setForm(prev => ({ ...prev, section_title: e.target.value }))} />
          </div>
        </div>
        <Button onClick={handleSave} disabled={updateContent.isPending}>
          {updateContent.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
};
