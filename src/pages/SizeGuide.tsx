import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Ruler, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSiteContent } from '@/hooks/useSiteContent';

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

const SizeTable = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse bg-card rounded-lg overflow-hidden">
      <thead className="bg-muted">
        <tr>
          {headers.map((h, i) => (
            <th key={i} className={`${i === 0 ? 'text-left' : 'text-center'} py-3 px-4 font-semibold`}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {rows.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
              <td key={ci} className={`py-3 px-4 ${ci === 0 ? 'font-medium' : 'text-center'}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const SizeGuide = () => {
  const { content } = useSiteContent<SizeGuideContent>('size-guide', 'main', defaultContent);

  return (
    <Layout>
      <SEO
        title="Size Guide - Find Your Perfect Fit"
        description="Use our detailed size guide to find the perfect fit for thobes, abayas, and other Islamic fashion."
        keywords="thobe size guide, abaya size chart, Islamic clothing sizes"
        canonicalPath="/size-guide"
        pageKey="size-guide"
      />
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-display font-bold mb-4">{content.heading}</h1>
          <p className="text-lg text-muted-foreground mb-8">{content.subtitle}</p>

          {content.howToMeasure.length > 0 && (
            <div className="p-6 bg-card border border-border rounded-xl mb-8">
              <div className="flex items-start gap-4">
                <Ruler className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">How to Measure</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    {content.howToMeasure.map((item, i) => (
                      <li key={i}><strong>{item.label}:</strong> {item.description}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <Tabs defaultValue="men" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="men">Men</TabsTrigger>
              <TabsTrigger value="women">Women</TabsTrigger>
              <TabsTrigger value="children">Children</TabsTrigger>
            </TabsList>

            <TabsContent value="men" className="space-y-6">
              <h2 className="text-2xl font-display font-semibold">Men's Size Chart</h2>
              <SizeTable headers={content.menHeaders} rows={content.menRows} />
            </TabsContent>

            <TabsContent value="women" className="space-y-6">
              <h2 className="text-2xl font-display font-semibold">Women's Size Chart</h2>
              <SizeTable headers={content.womenHeaders} rows={content.womenRows} />
            </TabsContent>

            <TabsContent value="children" className="space-y-6">
              <h2 className="text-2xl font-display font-semibold">Children's Size Chart</h2>
              <SizeTable headers={content.childrenHeaders} rows={content.childrenRows} />
            </TabsContent>
          </Tabs>

          {content.sizingTips.length > 0 && (
            <div className="mt-12 p-6 bg-muted/50 rounded-xl">
              <div className="flex items-start gap-4">
                <Info className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div className="space-y-3">
                  <h3 className="font-semibold">Sizing Tips</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    {content.sizingTips.map((tip, i) => (
                      <li key={i}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SizeGuide;
