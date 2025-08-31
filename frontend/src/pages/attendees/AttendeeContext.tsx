'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Attendee } from '../../types/attendees';

interface AttendeeContextType {
  attendees: Attendee[];
  setAttendees: (attendees: Attendee[]) => void;
  selectedAttendee: Attendee | null;
  setSelectedAttendee: (attendee: Attendee | null) => void;
  getAttendeeById: (id: string) => Attendee | undefined;
}

const AttendeeContext = createContext<AttendeeContextType | undefined>(undefined);

export const useAttendeeContext = () => {
  const context = useContext(AttendeeContext);
  if (context === undefined) {
    throw new Error('useAttendeeContext must be used within an AttendeeProvider');
  }
  return context;
};

interface AttendeeProviderProps {
  children: ReactNode;
}

export const AttendeeProvider: React.FC<AttendeeProviderProps> = ({ children }) => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);

  const getAttendeeById = (id: string): Attendee | undefined => {
    return attendees?.find(attendee => attendee.id === id);
  };

  const value: AttendeeContextType = {
    attendees,
    setAttendees,
    selectedAttendee,
    setSelectedAttendee,
    getAttendeeById,
  };

  return (
    <AttendeeContext.Provider value={value}>
      {children}
    </AttendeeContext.Provider>
  );
};
