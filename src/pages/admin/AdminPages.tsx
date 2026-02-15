import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeroEditor } from '@/components/admin/cms/HeroEditor';
import { FeaturesEditor } from '@/components/admin/cms/FeaturesEditor';
import { CategoriesEditor } from '@/components/admin/cms/CategoriesEditor';
import { TestimonialsEditor } from '@/components/admin/cms/TestimonialsEditor';
import { FooterEditor } from '@/components/admin/cms/FooterEditor';
import { HeaderEditor } from '@/components/admin/cms/HeaderEditor';
import { ContactEditor } from '@/components/admin/cms/ContactEditor';
import { FAQEditor } from '@/components/admin/cms/FAQEditor';
import { PolicyEditor } from '@/components/admin/cms/PolicyEditor';
import { SizeGuideEditor } from '@/components/admin/cms/SizeGuideEditor';

const AdminPages = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Pages</h1>
        <p className="text-muted-foreground">Edit your website content</p>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="terms">Terms</TabsTrigger>
          <TabsTrigger value="size-guide">Size Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="hero"><HeroEditor /></TabsContent>
        <TabsContent value="features"><FeaturesEditor /></TabsContent>
        <TabsContent value="categories"><CategoriesEditor /></TabsContent>
        <TabsContent value="testimonials"><TestimonialsEditor /></TabsContent>
        <TabsContent value="header"><HeaderEditor /></TabsContent>
        <TabsContent value="footer"><FooterEditor /></TabsContent>
        <TabsContent value="contact"><ContactEditor /></TabsContent>
        <TabsContent value="faq"><FAQEditor /></TabsContent>
        <TabsContent value="shipping">
          <PolicyEditor
            page="shipping-policy"
            title="Shipping Policy"
            defaultContent={{
              heading: 'Shipping Policy',
              sections: [],
            }}
          />
        </TabsContent>
        <TabsContent value="returns">
          <PolicyEditor
            page="returns-exchanges"
            title="Returns & Exchanges"
            defaultContent={{
              heading: 'Returns & Exchanges',
              sections: [],
            }}
          />
        </TabsContent>
        <TabsContent value="privacy">
          <PolicyEditor
            page="privacy-policy"
            title="Privacy Policy"
            showIntro
            showLastUpdated
            defaultContent={{
              heading: 'Privacy Policy',
              intro: '',
              lastUpdated: '',
              sections: [],
            }}
          />
        </TabsContent>
        <TabsContent value="terms">
          <PolicyEditor
            page="terms-of-service"
            title="Terms of Service"
            showIntro
            showLastUpdated
            defaultContent={{
              heading: 'Terms of Service',
              intro: '',
              lastUpdated: '',
              sections: [],
            }}
          />
        </TabsContent>
        <TabsContent value="size-guide"><SizeGuideEditor /></TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPages;
