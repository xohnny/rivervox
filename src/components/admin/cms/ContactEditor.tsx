import { useState, useEffect } from 'react';
import { useSiteContent, useUpdateSiteContent } from '@/hooks/useSiteContent';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';

interface ContactContent {
  heading: string;
  subtitle: string;
  infoHeading: string;
  infoDescription: string;
  addressLabel: string;
  address: string;
  phone: string;
  emailLabel: string;
  emails: string[];
  formHeading: string;
}

const defaultContent: ContactContent = {
  heading: 'Contact Us',
  subtitle: "We'd love to hear from you. Get in touch with our team.",
  infoHeading: 'Get in Touch',
  infoDescription: 'Have questions about our products, orders, or anything else? Our dedicated team is here to help you with anything you need.',
  addressLabel: 'Our Address',
  address: '8206 Louisiana Blvd NE, Ste A #8412\nAlbuquerque, NM 87113\nUSA',
  phone: '+1 (781) 870-4028',
  emailLabel: 'Email Us',
  emails: ['hello@rivervox.com', 'support@rivervox.com'],
  formHeading: 'Send Us a Message',
};

export const ContactEditor = () => {
  const { content } = useSiteContent<ContactContent>('contact', 'main', defaultContent);
  const updateContent = useUpdateSiteContent();
  const [form, setForm] = useState<ContactContent>(defaultContent);

  useEffect(() => {
    if (content) setForm(content);
  }, [content]);

  const handleSave = () => {
    updateContent.mutate({ page: 'contact', section: 'main', content: form as unknown as Record<string, any> });
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
        <CardHeader><CardTitle className="text-base">Contact Information</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm font-medium">Info Section Heading</label>
            <Input value={form.infoHeading} onChange={e => setForm(p => ({ ...p, infoHeading: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium">Info Description</label>
            <Textarea value={form.infoDescription} onChange={e => setForm(p => ({ ...p, infoDescription: e.target.value }))} rows={3} />
          </div>
          <div>
            <label className="text-sm font-medium">Address Label</label>
            <Input value={form.addressLabel} onChange={e => setForm(p => ({ ...p, addressLabel: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium">Address</label>
            <Textarea value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} rows={3} />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium">Email Label</label>
            <Input value={form.emailLabel} onChange={e => setForm(p => ({ ...p, emailLabel: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium">Email Addresses</label>
            {form.emails.map((email, i) => (
              <div key={i} className="flex gap-2 items-center mt-2">
                <Input value={email} onChange={e => {
                  const emails = [...form.emails];
                  emails[i] = e.target.value;
                  setForm(p => ({ ...p, emails }));
                }} />
                <Button variant="ghost" size="icon" onClick={() => setForm(p => ({ ...p, emails: p.emails.filter((_, j) => j !== i) }))}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="mt-2" onClick={() => setForm(p => ({ ...p, emails: [...p.emails, ''] }))}><Plus className="w-4 h-4 mr-1" /> Add Email</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Form</CardTitle></CardHeader>
        <CardContent>
          <label className="text-sm font-medium">Form Heading</label>
          <Input value={form.formHeading} onChange={e => setForm(p => ({ ...p, formHeading: e.target.value }))} />
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={updateContent.isPending} className="w-full">
        {updateContent.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save Contact Page
      </Button>
    </div>
  );
};
