import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeroEditor } from '@/components/admin/cms/HeroEditor';
import { FeaturesEditor } from '@/components/admin/cms/FeaturesEditor';
import { CategoriesEditor } from '@/components/admin/cms/CategoriesEditor';
import { TestimonialsEditor } from '@/components/admin/cms/TestimonialsEditor';

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
        </TabsList>

        <TabsContent value="hero"><HeroEditor /></TabsContent>
        <TabsContent value="features"><FeaturesEditor /></TabsContent>
        <TabsContent value="categories"><CategoriesEditor /></TabsContent>
        <TabsContent value="testimonials"><TestimonialsEditor /></TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPages;
