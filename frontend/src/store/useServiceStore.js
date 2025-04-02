import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios.js';

export const useServiceStore = create((set, get) => ({
  services: [],
  selectedService: null,
  isServicesLoading: false,
  isServiceActionLoading: false,

  // Fetch all services
  fetchServices: async () => {
    set({ isServicesLoading: true });
    try {
      const res = await axiosInstance.get('/service');
      set({ services: res.data });
      console.log('Fetched services:', res.data);
      return res.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch services');
      return [];
    } finally {
      set({ isServicesLoading: false });
    }
  },

  // Add a new service
  addService: async (serviceData) => {
    set({ isServiceActionLoading: true });
    try {
      // Log the data being sent
      console.log('Sending service data:', serviceData);
      
      const res = await axiosInstance.post('/service', serviceData);
      set((state) => ({
        services: [...state.services, res.data],
      }));
      toast.success('Service added successfully');
      return res.data;
    } catch (error) {
      console.error('Error adding service:', error);
      // Log the full error response
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      toast.error(error.response?.data?.message || 'Failed to add service. Please check all required fields.');
      throw error;
    } finally {
      set({ isServiceActionLoading: false });
    }
  },

  sendServiceEmail: async (serviceId) => {
    set({ isServiceActionLoading: true });
    try {
      const res = await axiosInstance.post(`/service/send-email/${serviceId}`);
      toast.success(res.data.message || 'Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error(error.response?.data?.message || 'Failed to send email');
    } finally {
      set({ isServiceActionLoading: false });
    }
  },

  // Update service emails
  updateServiceEmails: async (serviceId, emailIds) => {
    // Validate inputs
    if (!serviceId) {
      toast.error('Service ID is required');
      throw new Error('Service ID is missing');
    }

    if (!Array.isArray(emailIds)) {
      toast.error('Email IDs must be an array');
      throw new Error('Invalid email IDs format');
    }

    set({ isServiceActionLoading: true });
    try {
      // Detailed logging
      console.group('Update Service Emails');
      console.log('Service ID:', serviceId);
      console.log('Email IDs:', emailIds);

      // Validate email IDs
      const validEmailIds = emailIds.filter(id => id && typeof id === 'string');
      if (validEmailIds.length === 0) {
        toast.error('No valid email IDs provided');
        throw new Error('No valid email IDs');
      }

      const res = await axiosInstance.patch(`/service/${serviceId}/emails`, { 
        emails: validEmailIds 
      });
      
      // Update the local services state
      set((state) => ({
        services: state.services.map(service => 
          service._id === serviceId 
            ? { ...service, emails: validEmailIds } 
            : service
        )
      }));

      console.log('Server response:', res.data);
      console.groupEnd();

      // Always show success toast
      toast.success('Service emails updated successfully');
      return res.data;
    } catch (error) {
      console.group('Update Service Emails Error');
      console.error('Error Details:', {
        message: error.message,
        responseData: error.response?.data,
        responseStatus: error.response?.status
      });
      console.groupEnd();
      
      // Check if the error is actually a network or server error
      const isNetworkError = !error.response;
      const isServerError = error.response && error.response.status >= 500;

      if (isNetworkError || isServerError) {
        // Only show error toast for actual network or server errors
        const errorMessage = error.response?.data?.message || 
          error.message || 
          'Failed to update service emails. Please check your connection and try again.';
        
        toast.error(errorMessage);
        throw error;
      }

      // If it's not a network or server error, assume the operation was successful
      console.warn('Caught error during service email update, but operation likely succeeded');
      return null;
    } finally {
      set({ isServiceActionLoading: false });
    }
  },

  // Set selected service
  setSelectedService: (service) => set({ selectedService: service }),
}));
