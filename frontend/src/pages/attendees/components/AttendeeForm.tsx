'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { Attendee } from '../../../types/attendees';
import { useToast } from '../../../contexts/ToastContext';

interface AttendeeFormProps {
  mode: 'create' | 'edit';
  initialData?: Attendee;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AttendeeForm({ mode, initialData, onSuccess, onCancel }: AttendeeFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<Attendee>({
    id: '',
    name: '',
    email: '',
    age: 0,
    gender: '',
    phone: '',
    address: '',
    emergencyContact: '',
    dietaryRestrictions: '',
    specialRequirements: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'create') {
      // Generate new attendee ID for create mode
      setFormData(prev => ({
        ...prev,
        id: uuidv4()
      }));
    } else if (mode === 'edit' && initialData) {
      // Populate form with existing data for edit mode, ensuring all fields are present
      setFormData({
        id: initialData?.id,
        name: initialData?.name,
        email: initialData?.email,
        age: initialData?.age,
        gender: initialData?.gender,
        phone: initialData?.phone,
        address: initialData?.address,
        emergencyContact: initialData?.emergencyContact,
        dietaryRestrictions: initialData?.dietaryRestrictions,
        specialRequirements: initialData?.specialRequirements,
      });
    }
  }, [mode, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'create') {
        // Create new attendee
        const response = await fetch('http://localhost:3001/attendees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          showToast('Attendee created successfully!', 'success');
          if (onSuccess) {
            onSuccess();
          } else {
            router.push('/attendees');
          }
        } else {
          throw new Error('Failed to create attendee');
        }
      } else {
        // Update existing attendee
        const response = await fetch(`http://localhost:3001/attendees/${formData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          showToast('Attendee updated successfully!', 'success');
          if (onSuccess) {
            onSuccess();
          } else {
            router.push('/attendees');
          }
        } else {
          throw new Error('Failed to update attendee');
        }
      }
    } catch (error) {
      showToast(`Error ${mode === 'create' ? 'creating' : 'updating'} attendee. Please try again.`, 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/attendees');
    }
  };

  const isCreateMode = mode === 'create';
  const title = isCreateMode ? 'Create New Attendee' : 'Edit Attendee Information';
  const description = isCreateMode 
    ? 'Fill in the attendee information below to register them for events.' 
    : 'Update the attendee information below.';
  const buttonText = isCreateMode ? 'Create Attendee' : 'Update Attendee';
  const buttonIcon = isCreateMode ? (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  ) : (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-8 py-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          </div>

          {/* Name - Required */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter full name"
            />
          </div>

          {/* Email - Required */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>

          {/* Phone - Required */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter phone number"
            />
          </div>

          {/* Emergency Contact - Optional */}
          <div>
            <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Contact
            </label>
            <input
              type="text"
              id="emergencyContact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Phone number of emergency contact"
            />
          </div>

          {/* Age - Optional */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age || ''}
              onChange={handleInputChange}
              min="1"
              max="120"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter age"
            />
          </div>

          {/* Gender - Optional */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          {/* Address - Optional */}
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter full address"
            />
          </div>

          {/* Dietary Restrictions - Optional */}
          <div className="md:col-span-2">
            <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700 mb-2">
              Dietary Restrictions
            </label>
            <textarea
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              value={formData.dietaryRestrictions}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any dietary restrictions or allergies"
            />
          </div>

          {/* Special Requirements - Optional */}
          <div className="md:col-span-2">
            <label htmlFor="specialRequirements" className="block text-sm font-medium text-gray-700 mb-2">
              Special Requirements
            </label>
            <textarea
              id="specialRequirements"
              name="specialRequirements"
              value={formData.specialRequirements}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any special requirements, accessibility needs, or additional information"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isCreateMode ? 'Creating...' : 'Updating...'}
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {buttonIcon}
                </svg>
                {buttonText}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
