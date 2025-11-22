import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'wouter';
import { FirebaseService } from '@/lib/firebaseService';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function Reviews() {
  const { user, userLicense } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [filter, setFilter] = useState<number | 'all'>('all');
  const { toast } = useToast();

  const hasActiveLicense = userLicense?.isActive && userLicense?.type !== 'None';

  const { data: reviews = [], isLoading: isLoadingReviews } = useQuery({
    queryKey: ['/api/reviews'],
    queryFn: async () => {
      try {
        return await FirebaseService.getReviews();
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        return [];
      }
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: { userId: string; userEmail: string; rating: number; comment: string }) => {
      return await FirebaseService.createReview(reviewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      toast({
        title: 'Review Submitted',
        description: 'Thank you for your feedback!',
      });
      setRating(0);
      setComment('');
    },
    onError: (error: any) => {
      toast({
        title: 'Submission Failed',
        description: error.message || 'Failed to submit review',
        variant: 'destructive',
      });
    },
  });

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(r => r.rating === filter);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim() || !user) return;

    createReviewMutation.mutate({
      userId: user.uid,
      userEmail: user.email || 'Anonymous',
      rating,
      comment: comment.trim(),
    });
  };

  if (!user || !hasActiveLicense) {
    return (
      <div className="min-h-screen py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <Card className="p-8 md:p-12 text-center space-y-6">
            <Lock className="w-16 h-16 text-muted-foreground mx-auto" />
            <h1 className="text-3xl font-bold">Reviews Section</h1>
            <p className="text-lg text-muted-foreground">
              This section is available only to users with an active license.
            </p>
            {!user ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">Please sign in and purchase a license to access reviews.</p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => window.location.href = '/signin'} data-testid="button-signin">
                    Sign In
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/pricing'} data-testid="button-view-pricing">
                    View Pricing
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">You need an active license to access this section.</p>
                <Button onClick={() => window.location.href = '/pricing'} data-testid="button-get-license">
                  Get a License
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6 md:px-8 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold" data-testid="text-reviews-headline">
            Customer Reviews
          </h1>
          <p className="text-lg text-muted-foreground">
            Share your experience with ShopFlow POS
          </p>
        </div>

        <Card className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-6" data-testid="text-submit-review">
            Submit Your Review
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">
                Rating <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110 active:scale-95"
                    data-testid={`button-star-${star}`}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-primary text-primary'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium mb-2">
                Your Review <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your experience with ShopFlow..."
                className="min-h-32"
                required
                data-testid="input-review-comment"
              />
            </div>

            <Button 
              type="submit" 
              disabled={rating === 0 || !comment.trim() || createReviewMutation.isPending}
              className="w-full md:w-auto" 
              data-testid="button-submit-review"
            >
              {createReviewMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </Button>
          </form>
        </Card>

        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-2xl font-semibold" data-testid="text-all-reviews">
              All Reviews ({filteredReviews.length})
            </h2>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
                data-testid="button-filter-all"
              >
                All
              </Button>
              {[5, 4, 3, 2, 1].map((stars) => (
                <Button
                  key={stars}
                  variant={filter === stars ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(stars)}
                  data-testid={`button-filter-${stars}-stars`}
                >
                  {stars} <Star className="w-3 h-3 ml-1 fill-current" />
                </Button>
              ))}
            </div>
          </div>

          {isLoadingReviews ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredReviews.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                {filter === 'all' 
                  ? 'No reviews yet. Be the first to share your experience!' 
                  : `No ${filter}-star reviews yet.`}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <Card key={review.id} className="p-6" data-testid={`card-review-${review.id}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {review.userEmail.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium" data-testid={`text-reviewer-email-${review.id}`}>
                            {review.userEmail}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1" data-testid={`stars-rating-${review.id}`}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed" data-testid={`text-comment-${review.id}`}>
                    {review.comment}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
