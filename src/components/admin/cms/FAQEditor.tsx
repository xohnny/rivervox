import { useState, useEffect } from 'react';
import { useSiteContent, useUpdateSiteContent } from '@/hooks/useSiteContent';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Save, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FAQQuestion {
  q: string;
  a: string;
}

interface FAQCategory {
  category: string;
  questions: FAQQuestion[];
}

interface FAQContent {
  heading: string;
  subtitle: string;
  categories: FAQCategory[];
  ctaHeading: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonLink: string;
}

const defaultContent: FAQContent = {
  heading: 'Frequently Asked Questions',
  subtitle: 'Find answers to common questions about our products, shipping, returns, and more.',
  categories: [],
  ctaHeading: 'Still have questions?',
  ctaDescription: 'Our customer service team is here to help you.',
  ctaButtonText: 'Contact Us',
  ctaButtonLink: '/contact',
};

export const FAQEditor = () => {
  const { content } = useSiteContent<FAQContent>('faq', 'main', defaultContent);
  const updateContent = useUpdateSiteContent();
  const [form, setForm] = useState<FAQContent>(defaultContent);
  const [openCategories, setOpenCategories] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (content) setForm(content);
  }, [content]);

  const handleSave = () => {
    updateContent.mutate({ page: 'faq', section: 'main', content: form as unknown as Record<string, any> });
  };

  const toggleCategory = (index: number) => {
    setOpenCategories(p => ({ ...p, [index]: !p[index] }));
  };

  const addCategory = () => {
    setForm(p => ({ ...p, categories: [...p.categories, { category: 'New Category', questions: [{ q: '', a: '' }] }] }));
  };

  const removeCategory = (index: number) => {
    setForm(p => ({ ...p, categories: p.categories.filter((_, i) => i !== index) }));
  };

  const updateCategory = (index: number, name: string) => {
    setForm(p => ({ ...p, categories: p.categories.map((c, i) => i === index ? { ...c, category: name } : c) }));
  };

  const addQuestion = (catIndex: number) => {
    setForm(p => ({
      ...p,
      categories: p.categories.map((c, i) => i === catIndex ? { ...c, questions: [...c.questions, { q: '', a: '' }] } : c),
    }));
  };

  const removeQuestion = (catIndex: number, qIndex: number) => {
    setForm(p => ({
      ...p,
      categories: p.categories.map((c, i) => i === catIndex ? { ...c, questions: c.questions.filter((_, j) => j !== qIndex) } : c),
    }));
  };

  const updateQuestion = (catIndex: number, qIndex: number, field: 'q' | 'a', value: string) => {
    setForm(p => ({
      ...p,
      categories: p.categories.map((c, i) => i === catIndex ? {
        ...c,
        questions: c.questions.map((q, j) => j === qIndex ? { ...q, [field]: value } : q),
      } : c),
    }));
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
            <Textarea value={form.subtitle} onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))} rows={2} />
          </div>
        </CardContent>
      </Card>

      {form.categories.map((cat, catIndex) => (
        <Card key={catIndex}>
          <Collapsible open={openCategories[catIndex] !== false}>
            <CardHeader className="cursor-pointer" onClick={() => toggleCategory(catIndex)}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{cat.category} ({cat.questions.length} questions)</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeCategory(catIndex); }}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon">
                      {openCategories[catIndex] !== false ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Category Name</label>
                  <Input value={cat.category} onChange={e => updateCategory(catIndex, e.target.value)} />
                </div>
                {cat.questions.map((q, qIndex) => (
                  <div key={qIndex} className="p-3 border border-border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Question {qIndex + 1}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeQuestion(catIndex, qIndex)}>
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </Button>
                    </div>
                    <Input placeholder="Question" value={q.q} onChange={e => updateQuestion(catIndex, qIndex, 'q', e.target.value)} />
                    <Textarea placeholder="Answer" value={q.a} onChange={e => updateQuestion(catIndex, qIndex, 'a', e.target.value)} rows={3} />
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addQuestion(catIndex)}>
                  <Plus className="w-4 h-4 mr-1" /> Add Question
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}

      <Button variant="outline" onClick={addCategory} className="w-full">
        <Plus className="w-4 h-4 mr-2" /> Add Category
      </Button>

      <Card>
        <CardHeader><CardTitle className="text-base">Bottom CTA Section</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-sm font-medium">CTA Heading</label>
            <Input value={form.ctaHeading} onChange={e => setForm(p => ({ ...p, ctaHeading: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium">CTA Description</label>
            <Input value={form.ctaDescription} onChange={e => setForm(p => ({ ...p, ctaDescription: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Button Text</label>
              <Input value={form.ctaButtonText} onChange={e => setForm(p => ({ ...p, ctaButtonText: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium">Button Link</label>
              <Input value={form.ctaButtonLink} onChange={e => setForm(p => ({ ...p, ctaButtonLink: e.target.value }))} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={updateContent.isPending} className="w-full">
        {updateContent.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save FAQ Page
      </Button>
    </div>
  );
};
