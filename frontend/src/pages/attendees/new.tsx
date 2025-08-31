'use client';

import { useRouter } from 'next/router';
import AttendeeForm from './components/AttendeeForm';

export default function NewAttendee() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/attendees');
  };

  const handleCancel = () => {
    router.push('/attendees');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleCancel}
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              ← Back to Attendees
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Attendee</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AttendeeForm 
          mode="create"
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}