import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSiteContent, useUpdateSiteContent } from '@/hooks/useSiteContent';
import { Loader2 } from 'lucide-react';

const iconOptions = ['Truck', 'Shield', 'RefreshCw', 'Headphones', 'Heart', 'Star', 'Clock', 'Gift', 'Zap', 'Award'];

const defaultFeatures = {
  items: [
    { icon: 'Truck', title: 'Free Shipping', description: 'On orders over $100' },
    { icon: 'Shield', title: 'Secure Payment', description: '100% secure checkout' },
    { icon: 'RefreshCw', title: 'Easy Returns', description: '30-day return policy' },
    { icon: 'Headphones', title: '24/7 Support', description: 'Dedicated assistance' },
  ],
};

export const FeaturesEditor = () => {
  const { content, isLoading } = useSiteContent('home', 'features', defaultFeatures);
  const updateContent = useUpdateSiteContent();
  const [form, setForm] = useState(defaultFeatures);

  useEffect(() => {
    if (content) setForm({ ...defaultFeatures, ...content });
  }, [content]);

  const updateItem = (index: number, field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? { ...item, [field]: value } : item),
    }));
  };

  const handleSave = () => {
    updateContent.mutate({ page: 'home', section: 'features', content: form });
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <Card>
      <CardHeader><CardTitle>Features Bar</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        {form.items.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={item.icon} onValueChange={v => updateItem(index, 'icon', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {iconOptions.map(icon => (
                    <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={item.title} onChange={e => updateItem(index, 'title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={item.description} onChange={e => updateItem(index, 'description', e.target.value)} />
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
