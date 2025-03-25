import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios.js';

export const useClientStore = create((set, get) => ({
  clients: [],
  selectedClient: null, 
  isClientsLoading: false,
  isClientActionLoading: false,

  fetchClients: async () => {
    set({ isClientsLoading: true });
    try {
      const res = await axiosInstance.get('/client');
      console.log('Fetched clients:', res.data); 
      set({ clients: res.data });
      return res.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch clients');
      return [];
    } finally {
      set({ isClientsLoading: false });
    }
  },

  // Add a new client
  addClient: async (clientData) => {
    set({ isClientActionLoading: true });
    try {
      const res = await axiosInstance.post('/client/create', clientData);
      set((state) => ({
        // Ensure clients is always an array and add the new client to the list
        clients: Array.isArray(state.clients) ? [...state.clients, res.data] : [res.data],
      }));
      toast.success('Client added successfully');
      return res.data;
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error(error.response?.data?.message || 'Failed to add client');
      throw error;
    } finally {
      set({ isClientActionLoading: false });
    }
  },
    toggleClientStatus: async (clientId) => {
    set({ isClientActionLoading: true });
    try {
      const res = await axiosInstance.put(`/client/toggle-status/${clientId}`);
      const updatedClient = res.data.client;

      // Update the client status in the local state
      set((state) => ({
        clients: state.clients.map((client) =>
          client._id === updatedClient._id ? { ...client, clientStatus: updatedClient.clientStatus } : client
        ),
      }));

      toast.success(`Client status updated to ${updatedClient.clientStatus ? 'Active' : 'Inactive'}`);
    } catch (error) {
      console.error('Error toggling client status:', error);
      toast.error('Failed to toggle client status');
    } finally {
      set({ isClientActionLoading: false });
    }
  },
  setSelectedClient: (client) => set({ selectedClient: client }),
}));
