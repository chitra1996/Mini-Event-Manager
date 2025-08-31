'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAttendeeContext } from './AttendeeContext';
import AttendeeForm from './components/AttendeeForm';
import { Attendee } from '../../types/attendees';

export default function AttendeeDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { selectedAttendee, getAttendeeById } = useAttendeeContext();
  const [attendee, setAttendee] = useState<Attendee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // First try to get attendee from context (selected attendee)
    if (selectedAttendee) {
      setAttendee(selectedAttendee);
      setLoading(false);
      return;
    }

    // If not in context, try to get by ID from attendees list
    if (id && typeof id === 'string') {
      const attendeeFromContext = getAttendeeById(id);
      if (attendeeFromContext) {
        setAttendee(attendeeFromContext);
        setLoading(false);
        return;
      } else {
        // Fallback: fetch data if not available in context
        fetchAttendeeDetails();
      }
    }
  }, [id, selectedAttendee, getAttendeeById]);

  const fetchAttendeeDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3001/attendees/${id}`);
      if (!response.ok) throw new Error('Attendee not found');
      const data = await response.json();
      setAttendee(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load attendee');
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    router.push('/attendees');
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleEditSuccess = () => {
    setIsEditMode(false);
    // Refresh the attendee data
    if (id && typeof id === 'string') {
      fetchAttendeeDetails();
    }
  };

  const handleEditCancel = () => {
    setIsEditMode(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading attendee details...</p>
        </div>
      </div>
    );
  }

  if (error || !attendee) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Attendee Not Found</h2>
          <p className="text-red-600 mb-4">{error || 'The attendee you are looking for does not exist.'}</p>
          <button 
            onClick={handleBackClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Attendees
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
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBackClick}
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                ← Back to Attendees
              </button>
              <div className="w-px h-6 bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Edit Attendee' : 'Attendee Details'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Edit Form using common component */}
        <AttendeeForm 
          mode="edit"
          initialData={attendee}
          onSuccess={handleEditSuccess}
          onCancel={handleEditCancel}
          />
      </div>
    </div>
  );
}
