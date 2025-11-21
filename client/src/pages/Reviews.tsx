import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'wouter';

export default function Reviews() {
  const { user, userLicense } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [filter, setFilter] = useState<number | 'all'>('all');

  // Check if user has an active license
  const hasActiveLicense = userLicense?.isActive && userLicense?.type !== 'None';

  // Mock reviews for display (will be replaced with Firestore data in Task 2)
  const mockReviews = [
    {
      id: '1',
      userEmail: 'rajesh@example.com',
      rating: 5,
      comment: 'Excellent POS system! Very easy to use and great support.',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      userEmail: 'priya@example.com',
      rating: 5,
      comment: 'Best investment for my store. Highly recommended!',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      userEmail: 'amit@example.com',
      rating: 4,
      comment: 'Good features, could use more customization options.',
      createdAt: new Date().toISOString(),
    },
  ];

  const filteredReviews = filter === 'all' 
    ? mockReviews 
    : mockReviews.filter(r => r.rating === filter);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) return;

    // Will be implemented with Firestore in Task 2
    console.log('Submitting review:', { rating, comment });
    
    // Reset form
    setRating(0);
    setComment('');
  };

  // Show access denied message if user doesn't have an active license
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
                  <Link href="/signin">
                    <Button data-testid="button-signin">Sign In</Button>
                  </Link>
                  <Link href="/pricing">
                    <Button variant="outline" data-testid="button-view-pricing">View Pricing</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">You need an active license to access this section.</p>
                <Link href="/pricing">
                  <Button data-testid="button-get-license">Get a License</Button>
                </Link>
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
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold" data-testid="text-reviews-headline">
            Customer Reviews
          </h1>
          <p className="text-lg text-muted-foreground">
            Share your experience and read what others have to say
          </p>
        </div>

        {/* Submit Review Form */}
        <Card className="p-6 md:p-8" data-testid="card-review-form">
          <h2 className="text-2xl font-semibold mb-6">Write a Review</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                    data-testid={`button-star-${star}`}
                  >
                    <Star
                      className={`w-10 h-10 cursor-pointer transition-colors ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Input */}
            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium">
                Your Review
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with ShopFlow..."
                rows={4}
                className="resize-none"
                data-testid="input-review-comment"
              />
            </div>

            <Button
              type="submit"
              disabled={rating === 0 || !comment.trim()}
              data-testid="button-submit-review"
            >
              Submit Review
            </Button>
          </form>
        </Card>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 justify-center" data-testid="filter-tabs">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className="rounded-full"
            data-testid="button-filter-all"
          >
            All Reviews
          </Button>
          {[5, 4, 3, 2, 1].map((stars) => (
            <Button
              key={stars}
              variant={filter === stars ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(stars)}
              className="rounded-full"
              data-testid={`button-filter-${stars}-stars`}
            >
              {stars} Stars
            </Button>
          ))}
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No reviews match your filter.</p>
            </Card>
          ) : (
            filteredReviews.map((review) => (
              <Card key={review.id} className="p-6" data-testid={`card-review-${review.id}`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {review.userEmail.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{review.userEmail}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{review.rating}</span>
                    </div>
                  </Badge>
                </div>
                <p className="text-foreground/90 leading-relaxed">{review.comment}</p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
