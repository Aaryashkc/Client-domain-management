import React, { useState } from 'react';
import { useProviderStore } from '../store/useProviderStore.js'; 
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Database } from 'lucide-react';

const AddProvider = () => {
  const { addProvider, isProviderActionLoading } = useProviderStore();
  const navigate = useNavigate();

  const [providerData, setProviderData] = useState({
    providerName: '',
    providerEmail: '',
    providerPhone: '',
    providerAddress: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProviderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const { providerName, providerEmail, providerPhone, providerAddress } = providerData;
    if (!providerName || !providerEmail || !providerPhone || !providerAddress) {
      toast.error('All fields are required!');
      return;
    }

    try {
      await addProvider(providerData);
      toast.success('Service provider added successfully');
      navigate('/providers'); // Redirect to providers list after successful addition
    } catch (error) {
      toast.error('Failed to add service provider');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mt-20 max-w-md mx-auto bg-white shadow-md rounded-lg p-8">
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add a New Service Provider</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { 
              label: 'Provider Name', 
              name: 'providerName', 
              type: 'text', 
              placeholder: 'Enter provider name' 
            },
            { 
              label: 'Provider Email', 
              name: 'providerEmail', 
              type: 'email', 
              placeholder: 'Enter provider email' 
            },
            { 
              label: 'Provider Phone', 
              name: 'providerPhone', 
              type: 'tel', 
              placeholder: 'Enter provider phone' 
            },
            { 
              label: 'Provider Address', 
              name: 'providerAddress', 
              type: 'text', 
              placeholder: 'Enter provider address' 
            }
          ].map((field) => (
            <div key={field.name} className="space-y-2">
              <label 
                htmlFor={field.name} 
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
              <input
                id={field.name}
                type={field.type}
                name={field.name}
                value={providerData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm 
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                  sm:text-sm"
              />
            </div>
          ))}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isProviderActionLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${isProviderActionLoading 
                  ? 'bg-blue-900 cursor-not-allowed' 
                  : 'bg-blue-900 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
            >
              {isProviderActionLoading ? (
                <div className="flex items-center">
                  <svg 
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    ></circle>
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding Provider...
                </div>
              ) : (
                'Add Provider'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProvider;