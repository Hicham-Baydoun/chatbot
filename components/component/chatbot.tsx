"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from "ai/react";
import Markdown from "react-markdown";
import { SendIcon, SquareIcon, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Review {
  id: string;
  rating: number;
  feedback: string;
  timestamp?: Date;
}

export function Chatbot() {
  const { messages, input, handleInputChange, handleSubmit: handleChatSubmit, isLoading, stop, setMessages } = useChat({ api: "/api/chat" });
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userFeedback, setUserFeedback] = useState<string>('');
  const [rating, setRating] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchReviews = async () => {
    const q = query(collection(db, 'feedback'), orderBy('timestamp', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);
    
    const fetchedReviews: Review[] = querySnapshot.docs.map(doc => {
      const data = doc.data() as Omit<Review, 'id'>;
      return { id: doc.id, ...data };
    });
  
    setReviews(fetchedReviews);
  };

  const handleFeedbackSubmit = async (rating: number) => {
    try {
      await addDoc(collection(db, 'feedback'), {
        rating,
        feedback: userFeedback,
        timestamp: new Date(),
      });
      fetchReviews();
      setShowReviews(false);
      setUserFeedback('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
      
      <div className="flex flex-col items-center mb-4">
        <p className="text-gray-600">Welcome to the Chatbot! Ask me anything.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded-lg p-3 ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              <Markdown>{message.content}</Markdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleChatSubmit} className="p-4 bg-gray-100 flex items-center space-x-2">
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-1 resize-none"
          rows={1}
        />
        <Button type="submit" disabled={isLoading} className="bg-black hover:bg-gray-800 text-white">
          {isLoading ? (
            <SquareIcon className="animate-spin" />
          ) : (
            <SendIcon />
          )}
        </Button>
      </form>
      
      <div className="p-4 bg-gray-100 flex justify-between items-center">
        <div className="flex space-x-2">
          <Button onClick={() => handleFeedbackSubmit(1)} className="bg-green-500 hover:bg-green-600 text-white">
            <ThumbsUp size={20} />
          </Button>
          <Button onClick={() => handleFeedbackSubmit(0)} className="bg-red-500 hover:bg-red-600 text-white">
            <ThumbsDown size={20} />
          </Button>
        </div>
        <Textarea
          value={userFeedback}
          onChange={(e) => setUserFeedback(e.target.value)}
          placeholder="Any additional feedback?"
          className="flex-1 mx-2 resize-none"
          rows={1}
        />
        <Button 
          onClick={() => setShowReviews(!showReviews)} 
          className="bg-black hover:bg-gray-800 text-white"
        >
          Reviews
        </Button>
      </div>

      {showReviews && (
        <div className="absolute bottom-24 right-4 w-64 bg-white p-4 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
          <h3 className="font-bold mb-2">Recent Reviews</h3>
          {reviews.map(review => (
            <div key={review.id} className="mb-2 p-2 bg-gray-100 rounded">
              <p>Rating: {review.rating ? '👍' : '👎'}</p>
              <p className="text-sm">{review.feedback}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
