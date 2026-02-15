import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { ReviewForm } from './ReviewForm';
import { useSiteContent } from '@/hooks/useSiteContent';

// Import fallback avatar images
import fatimaAhmed from '@/assets/testimonials/fatima-ahmed.jpg';
import aishaRahman from '@/assets/testimonials/aisha-rahman.jpg';
import omarHassan from '@/assets/testimonials/omar-hassan.jpg';
import mariamKhan from '@/assets/testimonials/mariam-khan.jpg';
import yusufIbrahim from '@/assets/testimonials/yusuf-ibrahim.jpg';

const defaultAvatars = [fatimaAhmed, aishaRahman, omarHassan, mariamKhan, yusufIbrahim];

interface Review {
  id: string;
  user_name: string;
  user_location: string | null;
  rating: number;
  review_text: string;
  image_url: string | null;
  created_at: string;
}

// Fallback testimonials if no reviews in database
const fallbackTestimonials: Review[] = [
  {
    id: 'fallback-1',
    user_name: 'Fatima Ahmed',
    user_location: 'Dubai, UAE',
    rating: 5,
    review_text: 'The quality of the thobes is exceptional. My husband was so impressed with the fabric and stitching. Will definitely be ordering again!',
    image_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'fallback-2',
    user_name: 'Aisha Rahman',
    user_location: 'London, UK',
    rating: 5,
    review_text: 'Finally found a store that understands modest fashion without compromising on style. The abayas are absolutely stunning and perfect for any occasion.',
    image_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'fallback-3',
    user_name: 'Omar Hassan',
    user_location: 'New York, USA',
    rating: 5,
    review_text: 'Fast shipping and excellent customer service. The kurta I ordered fits perfectly and the material is breathable even in summer.',
    image_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'fallback-4',
    user_name: 'Mariam Khan',
    user_location: 'Toronto, Canada',
    rating: 5,
    review_text: 'I ordered matching outfits for my kids and they love them! The colors are vibrant and the fabric is comfortable for all-day wear.',
    image_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'fallback-5',
    user_name: 'Yusuf Ibrahim',
    user_location: 'Dhaka, Bangladesh',
    rating: 5,
    review_text: 'Best quality Islamic wear I have found online. The attention to detail and craftsmanship is remarkable. Highly recommend!',
    image_url: null,
    created_at: new Date().toISOString(),
  },
];

export const Testimonials = () => {
  const { content: headings } = useSiteContent('home', 'testimonials', { section_label: 'Testimonials', section_title: 'What Our Customers Say' });
  const [reviews, setReviews] = useState<Review[]>(fallbackTestimonials);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    skipSnaps: false,
    slidesToScroll: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const fetchReviews = useCallback(async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data && data.length > 0) {
      setReviews(data);
    }
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    // Auto-play
    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      clearInterval(autoplay);
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Get avatar for review (use uploaded image or default avatars in rotation)
  const getAvatar = (review: Review, index: number) => {
    return review.image_url || defaultAvatars[index % defaultAvatars.length];
  };

  return (
    <section className="py-16 md:py-24 bg-primary/5 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-accent font-medium text-sm uppercase tracking-[0.2em]">
            {headings.section_label || 'Testimonials'}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">
            {headings.section_title || 'What Our Customers Say'}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Join thousands of satisfied customers who trust Rivervox for their Islamic fashion needs
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="flex-[0_0_100%] lg:flex-[0_0_33.333%] min-w-0 px-3"
                >
                  <div className="bg-card rounded-2xl p-8 md:p-10 shadow-premium relative h-full flex flex-col">
                    {/* Quote Icon */}
                    <div className="absolute top-6 right-6 md:top-8 md:right-8">
                      <Quote className="w-10 h-10 text-primary/10" />
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(review.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-accent fill-accent"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8 flex-1">
                      "{review.review_text}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <img 
                        src={getAvatar(review, index)} 
                        alt={review.user_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-foreground">
                          {review.user_name}
                        </p>
                        {review.user_location && (
                          <p className="text-sm text-muted-foreground">
                            {review.user_location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12',
              'w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-card shadow-md flex items-center justify-center',
              'transition-all duration-200 hover:bg-primary hover:text-primary-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
            )}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12',
              'w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-card shadow-md flex items-center justify-center',
              'transition-all duration-200 hover:bg-primary hover:text-primary-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
            )}
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-all duration-300',
                selectedIndex === index
                  ? 'bg-primary w-8'
                  : 'bg-primary/20 hover:bg-primary/40'
              )}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Review Form - same container width as carousel */}
        <div className="mt-12 container mx-auto px-4">
          <ReviewForm onReviewSubmitted={fetchReviews} />
        </div>
      </div>
    </section>
  );
};
