import { useState } from 'react';
import { Review } from '@/types';
import { StarRating } from './StarRating';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { CheckCircle, User, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getProductReviews, getAverageRating, getRatingDistribution } from '@/data/reviews';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

const reviewSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  comment: z.string().trim().min(10, 'Review must be at least 10 characters').max(500, 'Review must be less than 500 characters'),
  rating: z.number().min(1, 'Please select a rating').max(5),
});

export const ProductReviews = ({ productId, productName }: ProductReviewsProps) => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(getProductReviews(productId));
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 0,
    title: '',
    comment: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const averageRating = getAverageRating(productId);
  const distribution = getRatingDistribution(productId);
  const totalReviews = reviews.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      reviewSchema.parse(newReview);
      
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const review: Review = {
        id: Date.now().toString(),
        productId,
        customerName: newReview.name.trim(),
        rating: newReview.rating,
        title: newReview.title.trim(),
        comment: newReview.comment.trim(),
        createdAt: new Date(),
        verified: false,
      };

      setReviews(prev => [review, ...prev]);
      setNewReview({ name: '', rating: 0, title: '', comment: '' });
      setShowReviewForm(false);
      
      toast({
        title: 'Review Submitted!',
        description: 'Thank you for sharing your feedback.',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="mt-16 pt-16 border-t border-border">
      <h2 className="text-2xl font-display font-bold mb-8">Customer Reviews</h2>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Rating Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-primary mb-2">
                {averageRating > 0 ? averageRating.toFixed(1) : '-'}
              </div>
              <StarRating rating={averageRating} size="lg" />
              <p className="text-sm text-muted-foreground mt-2">
                Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(star => {
                const count = distribution[star] || 0;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm w-3">{star}</span>
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Write Review Button */}
            <Button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="w-full mt-6"
              variant={showReviewForm ? 'outline' : 'default'}
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </Button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Review Form */}
          {showReviewForm && (
            <div className="bg-card border border-border rounded-xl p-6 animate-fade-in">
              <h3 className="font-semibold mb-4">Write Your Review</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Rating <span className="text-destructive">*</span>
                  </label>
                  <StarRating
                    rating={newReview.rating}
                    size="lg"
                    interactive
                    onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                  />
                  {errors.rating && (
                    <p className="text-sm text-destructive mt-1">{errors.rating}</p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={newReview.name}
                    onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your name"
                    maxLength={50}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Review Title <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={newReview.title}
                    onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Summarize your experience"
                    maxLength={100}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Review <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your experience with this product..."
                    rows={4}
                    maxLength={500}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.comment && (
                      <p className="text-sm text-destructive">{errors.comment}</p>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {newReview.comment.length}/500
                    </span>
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </form>
            </div>
          )}

          {/* Reviews */}
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div
                key={review.id}
                className={cn(
                  'bg-card border border-border rounded-xl p-6',
                  index === 0 && !showReviewForm && 'animate-fade-in'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.customerName}</span>
                        {review.verified && (
                          <span className="inline-flex items-center gap-1 text-xs text-primary">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                </div>

                <h4 className="font-semibold mt-4 mb-2">{review.title}</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {review.comment}
                </p>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                  <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <p className="text-muted-foreground mb-4">
                No reviews yet. Be the first to review this product!
              </p>
              <Button onClick={() => setShowReviewForm(true)}>
                Write a Review
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component used in the file
const Star = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
