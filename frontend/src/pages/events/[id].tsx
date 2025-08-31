'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import { Attendee } from '@/types/attendees';
import { useToast } from '../../contexts/ToastContext';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  attendees: string[];
}

export default function EventDetail() {
  const router = useRouter();
  const { showToast } = useToast();
  const { id } = router.query;
  const [event, setEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<Attendee[] | null>([]);
  const [eventAttendees, setEventAttendees] = useState<Attendee[]>([]);
  const [availableAttendees, setAvailableAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddAttendeesModalOpen, setIsAddAttendeesModalOpen] = useState(false);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [addingAttendee, setAddingAttendee] = useState<string | null>(null);
  const [removingAttendee, setRemovingAttendee] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3001/events/${id}`);
      if (!response.ok) throw new Error('Event not found');
      const eventData = await response.json();
      setEvent(eventData);
      // Fetch attendees separately to avoid any response body issues
      await fetchAttendees(eventData);
    } catch (err) {
      console.error('Error in fetchEventDetails:', err);
      setError(err instanceof Error ? err.message : 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendees = async (eventData?: Event) => {
    try {
      const response = await fetch('http://localhost:3001/attendees');
      if (!response.ok) throw new Error('Failed to fetch attendees');
      const attendeesData = await response.json();
      if (eventData && attendeesData?.length) {
        setEventAttendeesList(attendeesData, eventData);
        setAvailableAttendeesList(attendeesData, eventData);
      }
      setAttendees(attendeesData);
    } catch (err) {
      console.error('Error in fetchAttendees:', err);
      setError(err instanceof Error ? err.message : 'Failed to load attendees');
    }
  };

  const setAvailableAttendeesList = (attendeeData?: Attendee[], eventData?: Event) => {
    setLoadingAttendees(true);
    try {
      // Use the current event data from local state to filter out existing attendees
      const data = attendeeData?.filter((attendee: Attendee) => !eventData?.attendees?.includes(attendee.id))
      setAvailableAttendees(data || []);
    } catch (err) {
      console.error('Error fetching attendees:', err);
    } finally {
      setLoadingAttendees(false);
    }
  };

  const setEventAttendeesList = (attendeeData?: Attendee[], eventData?: Event) => {
    setLoadingAttendees(true);
    try {
      // Use the current event data from local state to filter out existing attendees
      const data = attendeeData?.filter((attendee: Attendee) => eventData?.attendees?.includes(attendee.id))
      setEventAttendees(data || []);
    } catch (err) {
      console.error('Error fetching attendees:', err);
    } finally {
      setLoadingAttendees(false);
    }
  };

  const handleAddAttendee = async (attendeeId: string) => {
    setAddingAttendee(attendeeId);
    try {
      const response = await fetch(`http://localhost:3001/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...event, attendees: [...(event?.attendees || []), attendeeId] }),
      });

      if (response.ok) {
        // Update local state instead of refetching
        if (event) {
          const updatedEvent = { ...event, attendees: [...(event.attendees || []), attendeeId] };
          setEvent(updatedEvent);
          
          // Remove the attendee from available list
          setAvailableAttendees(attendees?.filter(a => !updatedEvent.attendees.includes(a.id)) || []);
          // Update event attendees list
          const attendeeToAdd = attendees?.find((a: Attendee) => a.id === attendeeId);
          setEventAttendees(prev => [...prev, attendeeToAdd as Attendee]);
        }
      } else {
        throw new Error('Failed to add attendee');
      }
    } catch (error) {
      showToast('Error adding attendee. Please try again.', 'error');
      console.error('Error:', error);
    } finally {
      setAddingAttendee(null);
    }
  };

  const handleOpenAddAttendeesModal = () => {
    setIsAddAttendeesModalOpen(true);
  };

  const handleCloseAddAttendeesModal = () => {
    setIsAddAttendeesModalOpen(false);
  };

  const handleRemoveAttendee = async (attendeeId: string) => {
    setRemovingAttendee(attendeeId);
    try {
      const response = await fetch(`http://localhost:3001/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...event, attendees: event?.attendees?.filter((attendee: string) => attendee !== attendeeId) })
      });

      if (response.ok) {
        // Update local state instead of refetching
        if (event) {
          const updatedEvent = { ...event, attendees: event.attendees.filter((attendee: string) => attendee !== attendeeId) };
          setEvent(updatedEvent);
        }
        // Remove from event attendees list
        setEventAttendees(prev => prev.filter(a => a.id !== attendeeId));
        // Add the attendee to available list if it is not already in the list
        const attendeeToRemove = attendees?.find((attendee: Attendee) => attendee.id === attendeeId);
        if (attendeeToRemove) {
          setAvailableAttendees(prev => [...prev, attendeeToRemove]);
        }
      } else {
        throw new Error('Failed to remove attendee');
      }
    } catch (error) {
      showToast('Error removing attendee. Please try again.', 'error');
      console.error('Error:', error);
    } finally {
      setRemovingAttendee(null);
    }
  };

  const formatDate = (dateString: string) => {
    return moment(dateString).format('MMMM DD, YYYY [at] h:mm A');
  };

  const handleBackClick = () => {
    router.push('/events');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-red-600 mb-4">{error || 'The event you are looking for does not exist.'}</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Event Details</h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>Event ID: {event?.id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{event?.title}</h2>
                <p className="text-gray-600 text-lg">{event?.description}</p>
              </div>
              <div className="flex-shrink-0 ml-6">
                <div className="bg-blue-500 text-white px-4 py-2 rounded-lg text-center">
                  <div className="text-2xl font-bold">{event?.attendees.length}</div>
                  <div className="text-sm">Attendees</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">Date & Time:</span>
                  <span className="ml-2">{formatDate(event?.date)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">Location:</span>
                  <span className="ml-2">{event?.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendees Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Attendees ({event?.attendees.length})</h3>
              <button
                onClick={handleOpenAddAttendeesModal}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Attendees</span>
              </button>
            </div>
          </div>

          {event?.attendees.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-4xl mb-4">👥</div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">No attendees yet</h4>
              <p className="text-gray-500">Be the first to join this event!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-2 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {eventAttendees?.map((attendee, index) => (
                    <tr key={attendee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-4 whitespace-nowrap">
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
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {attendee.email}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Confirmed
                        </span>
                      </td>
                      <td className="px-2 py-4 whitespace-nowrap">
                        <div className="relative group">
                          <button
                            onClick={() => handleRemoveAttendee(attendee.id)}
                            disabled={removingAttendee === attendee.id}
                            className="inline-flex items-center justify-center w-8 h-8 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors2"
                          >
                            {removingAttendee === attendee.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            )}
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                            Remove attendee
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Attendees Modal */}
      {isAddAttendeesModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Add Attendees to Event</h2>
                  <p className="text-gray-600 mt-1">Select attendees to add to &quot;{event?.title}&quot;</p>
                </div>
                <button
                  onClick={handleCloseAddAttendeesModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              {loadingAttendees ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading available attendees...</p>
                </div>
              ) : availableAttendees?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-4">👥</div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">No available attendees</h4>
                  <p className="text-gray-500">All attendees are already registered for this event?.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {availableAttendees?.map((attendee) => (
                        <tr key={attendee.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {attendee.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {attendee.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="relative group">
                              <button
                                onClick={() => handleAddAttendee(attendee.id)}
                                disabled={addingAttendee === attendee.id}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                {addingAttendee === attendee.id ? (
                                  <>
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                    Adding...
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                  </>
                                )}
                              </button>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                Add attendee
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-t-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
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
      )}
    </div>
  );
}