import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios.js';

export const useProviderStore = create((set, get) => ({
  providers: [], 
  isProvidersLoading: false, 
  isProviderActionLoading: false, 


  fetchProviders: async () => {
    set({ isProvidersLoading: true });
    try {
      console.log('Fetching providers...');
      const res = await axiosInstance.get('/service-provider');
      console.log('Fetched providers:', res.data); 
      set({ providers: res.data });
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast.error('Failed to fetch service providers');
    } finally {
      set({ isProvidersLoading: false });
    }
  },


  addProvider: async (providerData) => {
    set({ isProviderActionLoading: true });
    try {
      console.log('Adding provider with data:', providerData);
      const res = await axiosInstance.post('/service-provider/create', providerData);
      console.log('Provider added:', res.data); 
      set((state) => ({
        providers: [...state.providers, res.data], 
      }));
      toast.success('Service provider added successfully');
      return res.data;
    } catch (error) {
      console.error('Error adding provider:', error);
      toast.error(error.response?.data?.message || 'Failed to add service provider');
    } finally {
      set({ isProviderActionLoading: false });
    }
  },

  setSelectedProvider: (provider) => set({ selectedProvider: provider }),

}));
