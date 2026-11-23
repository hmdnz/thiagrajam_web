import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubmitReview } from '../../hooks/useReviews';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { RatingStars } from '../../components/RatingStars';
import { ErrorBanner } from '../../components/ErrorBanner';
import { getErrorMessage } from '../../api/client';
import { ArrowLeft } from 'lucide-react';

const TAGS = [
  'Punctual',
  'Polite & Friendly',
  'Clean Car',
  'Smooth Driving',
  'Great Music',
  'Safe Driver',
];

export const RateTripPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const idNum = parseInt(bookingId || '0', 10);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const submitReviewMutation = useSubmitReview();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Rate Trip Experience | Wenyfour';
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await submitReviewMutation.mutateAsync({
        booking_id: idNum,
        rating,
        comment: comment.trim() || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      });

      setSuccessMessage('Thank you! Your review has been published.');
      setTimeout(() => navigate('/bookings'), 1500);
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Rate your Trip Experience</h1>
        <p className="text-sm text-slate-500">Booking #{idNum}</p>
      </div>

      <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage(null)} />

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating Card */}
        <Card className="p-8 text-center space-y-3">
          <p className="text-sm font-bold text-slate-900">How would you rate the ride?</p>
          <div className="flex justify-center py-2">
            <RatingStars
              rating={rating}
              maxStars={5}
              size="lg"
              onRatingChange={setRating}
            />
          </div>
          <p className="text-sm font-bold text-brand-600">
            {rating === 5
              ? 'Excellent (5/5)'
              : rating === 4
              ? 'Very Good (4/5)'
              : rating === 3
              ? 'Average (3/5)'
              : rating === 2
              ? 'Poor (2/5)'
              : 'Terrible (1/5)'}
          </p>
        </Card>

        {/* Feedback Badges */}
        <Card className="p-6 space-y-3">
          <p className="text-sm font-bold text-slate-900">What went well?</p>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Written Review */}
        <Card className="p-6 space-y-2">
          <label className="block text-sm font-bold text-slate-900">
            Written Feedback (Optional)
          </label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details about driver punctuality, car comfort, or the trip..."
            className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </Card>

        <Button
          type="submit"
          size="lg"
          className="w-full font-bold"
          loading={submitReviewMutation.isPending}
        >
          Submit Review
        </Button>
      </form>
    </div>
  );
};
