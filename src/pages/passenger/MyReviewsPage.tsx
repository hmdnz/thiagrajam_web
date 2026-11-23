import React, { useState, useEffect } from 'react';
import { useMyRatingSummary, useReviewsGiven, useReviewsReceived } from '../../hooks/useReviews';
import { Card } from '../../components/Card';
import { RatingStars } from '../../components/RatingStars';
import { EmptyState } from '../../components/EmptyState';
import { Loader } from '../../components/Loader';
import { Star, MessageSquare } from 'lucide-react';

export const MyReviewsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'received' | 'given'>('received');

  const { data: summary, isLoading: loadingSummary, refetch: refetchSummary } = useMyRatingSummary();
  const { data: given = [], isLoading: loadingGiven, refetch: refetchGiven } = useReviewsGiven();
  const { data: received = [], isLoading: loadingReceived, refetch: refetchReceived } =
    useReviewsReceived();

  useEffect(() => {
    document.title = 'My Reviews & Ratings | Wenyfour';
  }, []);

  const reviewsList = activeTab === 'received' ? received : given;
  const isLoading = loadingSummary || (activeTab === 'received' ? loadingReceived : loadingGiven);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ratings & Reviews</h1>
        <p className="text-sm text-slate-500">Your community reputation score and feedback history</p>
      </div>

      {/* Aggregate Score Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="text-center sm:border-r border-slate-100 sm:pr-8">
            <span className="text-5xl font-black text-brand-600">
              {summary?.average_rating ? summary.average_rating.toFixed(1) : '5.0'}
            </span>
            <div className="flex justify-center mt-2">
              <RatingStars rating={summary?.average_rating || 5} size="md" />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Based on {summary?.total_reviews || 0} reviews
            </p>
          </div>

          {/* Breakdown bars */}
          {summary?.rating_breakdown && (
            <div className="flex-1 w-full space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = summary.rating_breakdown[String(stars)] || 0;
                const total = summary.total_reviews || 1;
                const pct = Math.min(100, Math.round((count / total) * 100));

                return (
                  <div key={stars} className="flex items-center gap-3 text-xs">
                    <span className="w-6 font-semibold text-slate-600">{stars}★</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-right text-slate-400">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('received')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'received'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Reviews Received ({received.length})
        </button>
        <button
          onClick={() => setActiveTab('given')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'given'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Reviews Given ({given.length})
        </button>
      </div>

      {isLoading ? (
        <Loader message="Loading reviews..." />
      ) : reviewsList.length === 0 ? (
        <EmptyState
          title={`No Reviews ${activeTab === 'received' ? 'Received' : 'Given'} Yet`}
          description="Complete trips with co-travellers to exchange genuine ratings and comments."
        />
      ) : (
        <div className="space-y-4">
          {reviewsList.map((item) => (
            <Card key={item.id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {item.reviewer?.full_name || (activeTab === 'received' ? 'Co-rider' : 'You')}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                <RatingStars rating={item.rating} size="sm" />
              </div>

              {item.tags && (
                <p className="text-xs text-brand-700 font-medium italic mt-2">Tags: {item.tags}</p>
              )}

              {item.comment && (
                <p className="text-sm text-slate-700 mt-3 leading-relaxed">"{item.comment}"</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
