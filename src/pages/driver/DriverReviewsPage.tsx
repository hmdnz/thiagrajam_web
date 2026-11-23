import React from 'react';
import { useReviewsReceived, useMyRatingSummary } from '../../hooks/useReviews';
import { Card } from '../../components/Card';
import { Loader } from '../../components/Loader';
import { RatingStars } from '../../components/RatingStars';
import { EmptyState } from '../../components/EmptyState';
import { Star, ThumbsUp, ShieldCheck, MessageSquare } from 'lucide-react';

export const DriverReviewsPage: React.FC = () => {
  const { data: reviews, isLoading: reviewsLoading } = useReviewsReceived();
  const { data: summary, isLoading: summaryLoading } = useMyRatingSummary();

  if (reviewsLoading || summaryLoading) {
    return <Loader fullScreen message="Loading feedback and reviews..." />;
  }

  const averageRating = summary?.average_rating || 0;
  const totalReviews = summary?.total_reviews || reviews?.length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Passenger Reviews & Ratings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Feedback and ratings submitted by passengers on completed trips.
        </p>
      </div>

      {/* Summary Scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 shadow-lg">
          <span className="text-amber-100 text-xs font-bold uppercase tracking-wider">Overall Rating</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold">{averageRating.toFixed(1)}</span>
            <span className="text-amber-200 text-sm">/ 5.0</span>
          </div>
          <div className="mt-3 flex items-center">
            <RatingStars rating={averageRating} size={18} />
          </div>
        </Card>

        <Card className="bg-white border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Reviews</span>
            <MessageSquare className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-gray-900">{totalReviews}</span>
          </div>
          <p className="mt-2 text-xs text-gray-500">From verified passengers</p>
        </Card>

        <Card className="bg-white border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Driver Standing</span>
            <ShieldCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-gray-900">
              {averageRating >= 4.5 ? 'Top Rated Driver' : averageRating >= 4.0 ? 'Good Standing' : 'Active Driver'}
            </span>
          </div>
          <p className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
            <ThumbsUp className="w-3.5 h-3.5" /> High completion rate
          </p>
        </Card>
      </div>

      {/* Reviews List */}
      <Card title="Recent Reviews">
        {!reviews || reviews.length === 0 ? (
          <EmptyState
            title="No Reviews Yet"
            description="When passengers complete rides with you, their ratings and reviews will appear here."
            icon={<Star className="w-12 h-12 text-gray-300" />}
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {reviews.map((rev) => (
              <div key={rev.id} className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RatingStars rating={rev.rating} size={16} />
                    <span className="text-xs font-bold text-gray-700">{rev.rating}.0</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </span>
                </div>

                {rev.comment ? (
                  <p className="text-sm text-gray-800 italic">"{rev.comment}"</p>
                ) : (
                  <p className="text-xs text-gray-400 italic">No written comment provided.</p>
                )}

                {rev.tags && rev.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {rev.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
