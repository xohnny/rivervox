import { Layout } from '@/components/layout/Layout';
import { Hero } from '@/components/home/Hero';
import { Categories } from '@/components/home/Categories';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Features } from '@/components/home/Features';
import { Testimonials } from '@/components/home/Testimonials';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <Features />
      <Categories />
      <FeaturedProducts />
      <Testimonials />
    </Layout>
  );
};

export default Index;
