import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Ruler, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SizeGuide = () => {
  return (
    <Layout>
      <SEO
        title="Size Guide - Find Your Perfect Fit"
        description="Use our detailed size guide to find the perfect fit for thobes, abayas, and other Islamic fashion. Includes measurements for men, women, and children."
        keywords="thobe size guide, abaya size chart, Islamic clothing sizes, modest fashion measurements"
        canonicalPath="/size-guide"
      />
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-display font-bold mb-4">Size Guide</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Find your perfect fit with our comprehensive size charts.
          </p>

          {/* How to Measure */}
          <div className="p-6 bg-card border border-border rounded-xl mb-8">
            <div className="flex items-start gap-4">
              <Ruler className="w-8 h-8 text-primary shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">How to Measure</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.</li>
                  <li><strong>Waist:</strong> Measure around your natural waistline, the narrowest part of your torso.</li>
                  <li><strong>Hips:</strong> Measure around the fullest part of your hips.</li>
                  <li><strong>Length:</strong> Measure from the shoulder down to your desired length.</li>
                </ul>
              </div>
            </div>
          </div>

          <Tabs defaultValue="men" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="men">Men</TabsTrigger>
              <TabsTrigger value="women">Women</TabsTrigger>
              <TabsTrigger value="children">Children</TabsTrigger>
            </TabsList>

            <TabsContent value="men" className="space-y-6">
              <h2 className="text-2xl font-display font-semibold">Men's Size Chart</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-card rounded-lg overflow-hidden">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Size</th>
                      <th className="text-center py-3 px-4 font-semibold">Chest (in)</th>
                      <th className="text-center py-3 px-4 font-semibold">Waist (in)</th>
                      <th className="text-center py-3 px-4 font-semibold">Length (in)</th>
                      <th className="text-center py-3 px-4 font-semibold">Shoulder (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr><td className="py-3 px-4 font-medium">S</td><td className="py-3 px-4 text-center">36-38</td><td className="py-3 px-4 text-center">30-32</td><td className="py-3 px-4 text-center">54</td><td className="py-3 px-4 text-center">17</td></tr>
                    <tr><td className="py-3 px-4 font-medium">M</td><td className="py-3 px-4 text-center">38-40</td><td className="py-3 px-4 text-center">32-34</td><td className="py-3 px-4 text-center">55</td><td className="py-3 px-4 text-center">18</td></tr>
                    <tr><td className="py-3 px-4 font-medium">L</td><td className="py-3 px-4 text-center">40-42</td><td className="py-3 px-4 text-center">34-36</td><td className="py-3 px-4 text-center">56</td><td className="py-3 px-4 text-center">19</td></tr>
                    <tr><td className="py-3 px-4 font-medium">XL</td><td className="py-3 px-4 text-center">42-44</td><td className="py-3 px-4 text-center">36-38</td><td className="py-3 px-4 text-center">57</td><td className="py-3 px-4 text-center">20</td></tr>
                    <tr><td className="py-3 px-4 font-medium">XXL</td><td className="py-3 px-4 text-center">44-46</td><td className="py-3 px-4 text-center">38-40</td><td className="py-3 px-4 text-center">58</td><td className="py-3 px-4 text-center">21</td></tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="women" className="space-y-6">
              <h2 className="text-2xl font-display font-semibold">Women's Size Chart</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-card rounded-lg overflow-hidden">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Size</th>
                      <th className="text-center py-3 px-4 font-semibold">Bust (in)</th>
                      <th className="text-center py-3 px-4 font-semibold">Waist (in)</th>
                      <th className="text-center py-3 px-4 font-semibold">Hips (in)</th>
                      <th className="text-center py-3 px-4 font-semibold">Length (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr><td className="py-3 px-4 font-medium">S</td><td className="py-3 px-4 text-center">32-34</td><td className="py-3 px-4 text-center">26-28</td><td className="py-3 px-4 text-center">35-37</td><td className="py-3 px-4 text-center">52</td></tr>
                    <tr><td className="py-3 px-4 font-medium">M</td><td className="py-3 px-4 text-center">34-36</td><td className="py-3 px-4 text-center">28-30</td><td className="py-3 px-4 text-center">37-39</td><td className="py-3 px-4 text-center">53</td></tr>
                    <tr><td className="py-3 px-4 font-medium">L</td><td className="py-3 px-4 text-center">36-38</td><td className="py-3 px-4 text-center">30-32</td><td className="py-3 px-4 text-center">39-41</td><td className="py-3 px-4 text-center">54</td></tr>
                    <tr><td className="py-3 px-4 font-medium">XL</td><td className="py-3 px-4 text-center">38-40</td><td className="py-3 px-4 text-center">32-34</td><td className="py-3 px-4 text-center">41-43</td><td className="py-3 px-4 text-center">55</td></tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="children" className="space-y-6">
              <h2 className="text-2xl font-display font-semibold">Children's Size Chart</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-card rounded-lg overflow-hidden">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Size</th>
                      <th className="text-center py-3 px-4 font-semibold">Age</th>
                      <th className="text-center py-3 px-4 font-semibold">Height (in)</th>
                      <th className="text-center py-3 px-4 font-semibold">Chest (in)</th>
                      <th className="text-center py-3 px-4 font-semibold">Waist (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr><td className="py-3 px-4 font-medium">2-3Y</td><td className="py-3 px-4 text-center">2-3 years</td><td className="py-3 px-4 text-center">36-38</td><td className="py-3 px-4 text-center">21-22</td><td className="py-3 px-4 text-center">20-21</td></tr>
                    <tr><td className="py-3 px-4 font-medium">4-5Y</td><td className="py-3 px-4 text-center">4-5 years</td><td className="py-3 px-4 text-center">40-43</td><td className="py-3 px-4 text-center">22-23</td><td className="py-3 px-4 text-center">21-22</td></tr>
                    <tr><td className="py-3 px-4 font-medium">6-7Y</td><td className="py-3 px-4 text-center">6-7 years</td><td className="py-3 px-4 text-center">44-48</td><td className="py-3 px-4 text-center">24-25</td><td className="py-3 px-4 text-center">22-23</td></tr>
                    <tr><td className="py-3 px-4 font-medium">8-9Y</td><td className="py-3 px-4 text-center">8-9 years</td><td className="py-3 px-4 text-center">49-53</td><td className="py-3 px-4 text-center">26-27</td><td className="py-3 px-4 text-center">23-24</td></tr>
                    <tr><td className="py-3 px-4 font-medium">10-11Y</td><td className="py-3 px-4 text-center">10-11 years</td><td className="py-3 px-4 text-center">54-58</td><td className="py-3 px-4 text-center">28-30</td><td className="py-3 px-4 text-center">24-26</td></tr>
                    <tr><td className="py-3 px-4 font-medium">12-13Y</td><td className="py-3 px-4 text-center">12-13 years</td><td className="py-3 px-4 text-center">59-63</td><td className="py-3 px-4 text-center">30-32</td><td className="py-3 px-4 text-center">26-28</td></tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>

          {/* Tips */}
          <div className="mt-12 p-6 bg-muted/50 rounded-xl">
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div className="space-y-3">
                <h3 className="font-semibold">Sizing Tips</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• If you're between sizes, we recommend sizing up for a more comfortable fit.</li>
                  <li>• Our thobes and abayas are designed with a relaxed, modest fit.</li>
                  <li>• For a more fitted look, consider sizing down.</li>
                  <li>• Still unsure? Contact our customer service for personalized sizing advice.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SizeGuide;
