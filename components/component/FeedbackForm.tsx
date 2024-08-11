import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface FeedbackData {
  rating: number;
  feedback: string;
}

interface FeedbackFormProps {
  onSubmit: (data: FeedbackData) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ rating, feedback });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
      <textarea
        className="w-full p-2 border rounded"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Please leave your feedback here..."
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Submit Feedback
      </button>
    </form>
  );
};

export default FeedbackForm;