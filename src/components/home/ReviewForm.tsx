import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Star, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface ReviewFormProps {
  onReviewSubmitted?: () => void;
}

export const ReviewForm = ({ onReviewSubmitted }: ReviewFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [userName, setUserName] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to submit a review.',
        variant: 'destructive',
      });
      return;
    }

    if (!reviewText.trim() || !userName.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please fill in your name and review.',
        variant: 'destructive',
      });
      return;
    }

    if (reviewText.trim().length < 10) {
      toast({
        title: 'Review too short',
        description: 'Please write at least 10 characters.',
        variant: 'destructive',
      });
      return;
    }

    if (reviewText.trim().length > 500) {
      toast({
        title: 'Review too long',
        description: 'Please keep your review under 500 characters.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('reviews').insert({
        user_id: user.id,
        user_name: userName.trim().substring(0, 100),
        user_location: userLocation.trim().substring(0, 100) || null,
        rating,
        review_text: reviewText.trim().substring(0, 500),
      });

      if (error) throw error;

      toast({
        title: 'Review submitted!',
        description: 'Thank you for sharing your experience with us.',
      });

      // Reset form
      setRating(5);
      setReviewText('');
      setUserName('');
      setUserLocation('');
      
      onReviewSubmitted?.();
    } catch (error: any) {
      toast({
        title: 'Error submitting review',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-card rounded-xl p-6 md:p-8 text-center border border-border">
        <h3 className="text-lg font-semibold mb-2">Share Your Experience</h3>
        <p className="text-muted-foreground mb-4">
          Log in to leave a review and help other customers
        </p>
        <Link to="/login">
          <Button>Log In to Review</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-6 md:p-8 border border-border">
      <h3 className="text-lg font-semibold mb-4">Share Your Experience</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">Your Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    'w-7 h-7 transition-colors',
                    (hoveredRating || rating) >= star
                      ? 'text-accent fill-accent'
                      : 'text-muted-foreground'
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Name and Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Your Name *</label>
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              maxLength={100}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Location (optional)</label>
            <Input
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
              placeholder="City, Country"
              maxLength={100}
            />
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium mb-2">Your Review *</label>
          <Textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Tell us about your experience with Rivervox..."
            rows={4}
            maxLength={500}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            {reviewText.length}/500 characters
          </p>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            'Submitting...'
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Review
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
