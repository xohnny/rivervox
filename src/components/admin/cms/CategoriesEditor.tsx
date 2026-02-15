import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSiteContent, useUpdateSiteContent } from '@/hooks/useSiteContent';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload } from 'lucide-react';

const defaultCategories = {
  section_label: 'Shop by Category',
  section_title: 'Explore Our Collections',
  items: [
    { name: 'Men', slug: 'men', description: 'Elegant thobes & kurtas', image: '' },
    { name: 'Women', slug: 'women', description: 'Graceful abayas & hijabs', image: '' },
    { name: 'Children', slug: 'children', description: 'Adorable modest wear', image: '' },
    { name: 'Accessories', slug: 'accessories', description: 'Complete your look', image: '' },
  ],
};

export const CategoriesEditor = () => {
  const { content, isLoading } = useSiteContent('home', 'categories', defaultCategories);
  const updateContent = useUpdateSiteContent();
  const [form, setForm] = useState(defaultCategories);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (content) setForm({ ...defaultCategories, ...content });
  }, [content]);

  const updateItem = (index: number, field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? { ...item, [field]: value } : item),
    }));
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIndex(index);
    const path = `cms/category-${form.items[index].slug}-${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('store-assets').upload(path, file);
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('store-assets').getPublicUrl(path);
      updateItem(index, 'image', publicUrl);
    }
    setUploadingIndex(null);
  };

  const handleSave = () => {
    updateContent.mutate({ page: 'home', section: 'categories', content: form });
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <Card>
      <CardHeader><CardTitle>Categories Section</CardTitle></CardHeader>
      <CardContent className="space-y-6">
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

        {form.items.map((item, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-4">
            <h4 className="font-semibold">{item.name} Category</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={item.name} onChange={e => updateItem(index, 'name', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={item.slug} onChange={e => updateItem(index, 'slug', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={item.description} onChange={e => updateItem(index, 'description', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors">
                  <Upload className="w-4 h-4" />
                  {uploadingIndex === index ? 'Uploading...' : 'Upload'}
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(index, e)} disabled={uploadingIndex === index} />
                </label>
                {item.image && <img src={item.image} alt={item.name} className="h-16 w-24 rounded-md object-cover" />}
              </div>
            </div>
          </div>
        ))}

        <Button onClick={handleSave} disabled={updateContent.isPending}>
          {updateContent.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
};
