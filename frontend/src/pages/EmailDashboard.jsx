import React, { useEffect, useState } from 'react';
import { useEmailStore } from '../store/useEmailStore';
import { toast } from 'react-hot-toast';

const EmailDashboard = () => {
  const { emails, fetchEmails, addEmail, deleteEmail, isLoading, isActionLoading } = useEmailStore();
  const [email, setEmail] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState(null);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  const handleAddEmail = async () => {
    if (!email) {
      toast.error('Please enter a valid email address');
      return;
    }
    try {
      await addEmail({ email });
      setEmail('');
    } catch (error) {
      toast.error('Failed to add email');
    }
  };


  const handleDeleteEmail = async () => {
    if (emailToDelete) {
      await deleteEmail(emailToDelete);
      setIsDeleteConfirmOpen(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Email Management</h2>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        {/* Add Email Section */}
        <div className="flex space-x-4 mb-6">
          <input
            type="email"
            className="border p-2 rounded-md w-80"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleAddEmail}
            className="bg-blue-900 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
            disabled={isActionLoading}
          >
            {isActionLoading ? 'Adding...' : 'Add Email'}
          </button>
        </div>

        <div>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
              <span className="ml-3">Loading emails...</span>
            </div>
          ) : (
            <ul>
              {emails.map((emailItem) => (
                <li key={emailItem._id} className="flex justify-between items-center py-2">
                  <span>{emailItem.email}</span>
                  <button
                    onClick={() => {
                      setEmailToDelete(emailItem._id);
                      setIsDeleteConfirmOpen(true);
                    }}
                    className="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Are you sure you want to delete this email?</h3>
            <div className="flex space-x-4">
              <button
                onClick={handleDeleteEmail}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailDashboard;
