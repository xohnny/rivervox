import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSiteContent, useUpdateSiteContent } from '@/hooks/useSiteContent';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload } from 'lucide-react';

const defaultHero = {
  badge_text: 'New Collection 2026',
  title_line1: 'Elegance Meets',
  title_line2: 'Modesty',
  description: 'Discover our premium collection of Islamic-inspired fashion. Crafted with love, designed for the modern family.',
  button1_text: 'Shop Collection',
  button1_link: '/shop',
  button2_text: 'Contact Us',
  button2_link: '/contact',
  background_image: '',
};

export const HeroEditor = () => {
  const { content, isLoading } = useSiteContent('home', 'hero', defaultHero);
  const updateContent = useUpdateSiteContent();
  const [form, setForm] = useState(defaultHero);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (content) setForm({ ...defaultHero, ...content });
  }, [content]);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `cms/hero-${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('store-assets').upload(path, file);
    if (error) { setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('store-assets').getPublicUrl(path);
    handleChange('background_image', publicUrl);
    setUploading(false);
  };

  const handleSave = () => {
    updateContent.mutate({ page: 'home', section: 'hero', content: form });
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <Card>
      <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Badge Text</Label>
            <Input value={form.badge_text} onChange={e => handleChange('badge_text', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Title Line 1</Label>
            <Input value={form.title_line1} onChange={e => handleChange('title_line1', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Title Line 2 (Accent)</Label>
            <Input value={form.title_line2} onChange={e => handleChange('title_line2', e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={form.description} onChange={e => handleChange('description', e.target.value)} rows={3} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Button 1 Text</Label>
            <Input value={form.button1_text} onChange={e => handleChange('button1_text', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Button 1 Link</Label>
            <Input value={form.button1_link} onChange={e => handleChange('button1_link', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Button 2 Text</Label>
            <Input value={form.button2_text} onChange={e => handleChange('button2_text', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Button 2 Link</Label>
            <Input value={form.button2_link} onChange={e => handleChange('button2_link', e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Background Image</Label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors">
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Upload Image'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
            {form.background_image && (
              <img src={form.background_image} alt="Preview" className="h-16 rounded-md object-cover" />
            )}
          </div>
          {!form.background_image && <p className="text-xs text-muted-foreground">Using default image. Upload to replace.</p>}
        </div>
        <Button onClick={handleSave} disabled={updateContent.isPending}>
          {updateContent.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
};
