import { Layout } from '@/components/layout/Layout';
import { Hero } from '@/components/home/Hero';
import { Categories } from '@/components/home/Categories';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Features } from '@/components/home/Features';
import { Testimonials } from '@/components/home/Testimonials';
import { SEO } from '@/components/SEO';

const Index = () => {
  return (
    <Layout>
      <SEO
        title="Premium Islamic Fashion for Men, Women & Kids"
        description="Shop elegant thobes, abayas, hijabs and modest fashion accessories at Rivervox. Premium quality Islamic clothing with free US & UK shipping on select orders."
        keywords="Islamic fashion, modest clothing, thobe, abaya, hijab, Muslim fashion, modest wear, Islamic clothing online, men thobe, women abaya, kids Islamic wear"
        canonicalPath="/"
      />
      <Hero />
      <Features />
      <Categories />
      <FeaturedProducts />
      <Testimonials />
    </Layout>
  );
};

export default Index;
