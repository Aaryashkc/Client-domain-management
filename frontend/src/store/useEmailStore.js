import {create} from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios.js'; 

export const useEmailStore = create((set, get) => ({
  emails: [],
  isLoading: false,
  isActionLoading: false,

  fetchEmails: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/email');
      set({ emails: res.data });
      return res.data;  // Return fetched emails
    } catch (error) {
      console.error('Detailed error fetching emails:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to fetch emails');
      return [];  // Return empty array instead of undefined
    } finally {
      set({ isLoading: false });
    }
  },

  // Add a new email
  addEmail: async (emailData) => {
    set({ isActionLoading: true });
    try {
      // Check if email already exists
      const existingEmail = get().emails.find(e => e.email === emailData.email);
      if (existingEmail) {
        return existingEmail;  // Return existing email if found
      }

      const res = await axiosInstance.post('/email/create', emailData);
      const newEmail = res.data;
      
      set((state) => ({
        emails: [...state.emails, newEmail],
      }));
      
      toast.success('Email added successfully');
      return newEmail;
    } catch (error) {
      console.error('Detailed error adding email:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to add email');
      throw error;  // Rethrow to allow caller to handle
    } finally {
      set({ isActionLoading: false });
    }
  },

  // Delete an email by ID
  deleteEmail: async (emailId) => {
    set({ isActionLoading: true });
    try {
      await axiosInstance.delete(`/email/${emailId}`); 
      set((state) => ({
        emails: state.emails.filter(email => email._id !== emailId),
      }));
      toast.success('Email deleted successfully');
    } catch (error) {
      console.error('Error deleting email:', error);
      toast.error('Failed to delete email');
    } finally {
      set({ isActionLoading: false });
    }
  },
}));
