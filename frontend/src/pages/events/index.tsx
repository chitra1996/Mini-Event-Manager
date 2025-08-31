'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';

interface Attendee {
  id: number;
  name: string;
  email: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  attendees: Attendee[];
}

export default function Events() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3001/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Memoize events data to prevent unnecessary re-renders
  const memoizedEvents = useMemo(() => events, [events]);

  const formatDate = (dateString: string) => {
    return moment(dateString).format('MMM DD, YYYY h:mm A');
  };

  const handleCardClick = (eventId: number) => {
    // Navigate to event details page using Pages Router
    router.push(`/events/${eventId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-500 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-white text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
          <p className="text-white mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-white text-red-500 px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-blue-600">
                Events
              </h1>
              <p className="text-gray-600 mt-1">Discover and join amazing events</p>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>{memoizedEvents.length} events available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {memoizedEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No events found</h3>
            <p className="text-gray-500">Check back later for upcoming events!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {memoizedEvents.map((event) => (
              <div 
                key={event.id} 
                onClick={() => handleCardClick(event.id)}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 cursor-pointer"
              >
                {/* Card Content */}
                <div className="p-6">
                  {/* Header with title and attendee count */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 pr-4">
                      <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {event.title}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        📍 {event.location}
                      </p>
                    </div>
                    {/* Attendee count circle */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                        {event.attendees.length}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Date at bottom */}
                  <div className="flex items-center text-sm text-gray-500 pt-3 border-t border-gray-100">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(event.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}