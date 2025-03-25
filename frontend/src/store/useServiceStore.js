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

  // Set selected service
  setSelectedService: (service) => set({ selectedService: service }),
}));
