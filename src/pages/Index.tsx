import { Layout } from '@/components/layout/Layout';
import { Hero } from '@/components/home/Hero';
import { Categories } from '@/components/home/Categories';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Features } from '@/components/home/Features';
import { Testimonials } from '@/components/home/Testimonials';
import { SEO } from '@/components/SEO';
import { HomeJsonLd } from '@/components/HomeJsonLd';

const Index = () => {
  return (
    <Layout>
      <SEO
        title="Premium Islamic Fashion for Men, Women & Kids"
        description="Shop elegant thobes, abayas, hijabs and modest fashion accessories at Rivervox. Premium quality Islamic clothing with free US & UK shipping on select orders."
        keywords="Islamic fashion, modest clothing, thobe, abaya, hijab, Muslim fashion, modest wear, Islamic clothing online, men thobe, women abaya, kids Islamic wear"
        canonicalPath="/"
        pageKey="home"
      />
      <HomeJsonLd />
      <Hero />
      <div className="content-deferred">
        <Features />
      </div>
      <div className="content-deferred">
        <Categories />
      </div>
      <div className="content-deferred">
        <FeaturedProducts />
      </div>
      <div className="content-deferred">
        <Testimonials />
      </div>
    </Layout>
  );
};

export default Index;
