import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    id: 1,
    name: 'Fatima Ahmed',
    location: 'Dubai, UAE',
    rating: 5,
    text: 'The quality of the thobes is exceptional. My husband was so impressed with the fabric and stitching. Will definitely be ordering again!',
    avatar: 'FA',
  },
  {
    id: 2,
    name: 'Aisha Rahman',
    location: 'London, UK',
    rating: 5,
    text: 'Finally found a store that understands modest fashion without compromising on style. The abayas are absolutely stunning and perfect for any occasion.',
    avatar: 'AR',
  },
  {
    id: 3,
    name: 'Omar Hassan',
    location: 'New York, USA',
    rating: 5,
    text: 'Fast shipping and excellent customer service. The kurta I ordered fits perfectly and the material is breathable even in summer.',
    avatar: 'OH',
  },
  {
    id: 4,
    name: 'Mariam Khan',
    location: 'Toronto, Canada',
    rating: 5,
    text: 'I ordered matching outfits for my kids and they love them! The colors are vibrant and the fabric is comfortable for all-day wear.',
    avatar: 'MK',
  },
  {
    id: 5,
    name: 'Yusuf Ibrahim',
    location: 'Dhaka, Bangladesh',
    rating: 5,
    text: 'Best quality Islamic wear I have found online. The attention to detail and craftsmanship is remarkable. Highly recommend!',
    avatar: 'YI',
  },
];

export const Testimonials = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

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

  return (
    <section className="py-16 md:py-24 bg-primary/5 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-accent font-medium text-sm uppercase tracking-[0.2em]">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Join thousands of satisfied customers who trust Rivervox for their Islamic fashion needs
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex-[0_0_100%] min-w-0 px-4"
                >
                  <div className="bg-card rounded-2xl p-8 md:p-10 shadow-premium relative">
                    {/* Quote Icon */}
                    <div className="absolute top-6 right-6 md:top-8 md:right-8">
                      <Quote className="w-10 h-10 text-primary/10" />
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
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
                    <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8">
                      "{testimonial.text}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.location}
                        </p>
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
              'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12',
              'w-12 h-12 rounded-full bg-card shadow-md flex items-center justify-center',
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
              'absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12',
              'w-12 h-12 rounded-full bg-card shadow-md flex items-center justify-center',
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
          {testimonials.map((_, index) => (
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
      </div>
    </section>
  );
};