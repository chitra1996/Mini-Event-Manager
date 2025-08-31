'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAttendeeContext } from './AttendeeContext';
import { Attendee } from '../../types/attendees';


export default function AttendeesList() {
  const router = useRouter();
  const { attendees, setAttendees, setSelectedAttendee } = useAttendeeContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAttendees();
  }, []);

  const fetchAttendees = async () => {
    try {
      const response = await fetch('http://localhost:3001/attendees');
      if (!response.ok) throw new Error('Failed to fetch attendees');
      const data = await response.json();
      setAttendees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (attendee: Attendee) => {
    // Set the selected attendee in context
    setSelectedAttendee(attendee);
    
    // Create URL-friendly name by converting to lowercase and replacing spaces with hyphens
    const urlName = attendee.name.toLowerCase().replace(/\s+/g, '-');
    // Navigate with name in URL and id as query parameter
    router.push(`/attendees/${urlName}?id=${attendee.id}`);
  };

  const handleBackClick = () => {
    router.push('/events');
  };

  const handleCreateNewClick = () => {
    router.push('/attendees/new');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading attendees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Attendees</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={handleBackClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Events
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
                ← Back to Events
              </button>
              <div className="w-px h-6 bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">All Attendees</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>{attendees.length} attendees</span>
              </div>
              <button
                onClick={handleCreateNewClick}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create New Attendee</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Attendees List</h2>
            <p className="text-gray-600 mt-1">Click on any row to view detailed information</p>
          </div>
          
          {attendees.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-4xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No attendees found</h3>
              <p className="text-gray-500">No attendees have been registered yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendees.map((attendee, index) => (
                    <tr 
                      key={attendee.id} 
                      onClick={() => handleRowClick(attendee)}
                      className="hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-medium text-sm">
                              {attendee.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {attendee.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500">
                        {attendee.email}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500">
                        {attendee.phone}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
