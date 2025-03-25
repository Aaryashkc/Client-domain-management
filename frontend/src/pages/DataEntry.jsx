import React, { useState } from 'react';
import { useClientStore } from '../store/useClientStore'; 
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

const DataEntry = () => {
  const { addClient, isClientActionLoading } = useClientStore();
  const [companyName, setCompanyName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [address, setAddress] = useState('');
  const [clientType, setClientType] = useState('external');
  

  const [isClientCreated, setIsClientCreated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();  

    // Validation
    if (!companyName || !clientName ||  !clientEmail || !clientPhone || !address || !clientType) {
      toast.error('All fields are required!');
      return;
    }

    const newClient = { companyName, clientName, clientEmail, clientPhone, address, clientType };

    try {
      await addClient(newClient); 
      setIsClientCreated(true); 
      resetForm();  
    } catch (error) {
      toast.error('Failed to add client');
    }
  };

  const resetForm = () => {
    setCompanyName('');
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setAddress('');
    setClientType('external');
  };

  if (isClientCreated) {
    return <Navigate to="/clientlist" />;
  }

  return (
    <div className="mt-20 max-w-2xl mx-auto p-6 bg-gray-200 text-blue-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Client</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Company Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Comapany Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="mt-1 p-2 w-full bg-gray-300 text-blue-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-700"
            placeholder="Enter client name"
          />
        </div>
        {/* Client Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Client Name</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="mt-1 p-2 w-full bg-gray-300 text-blue-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-700"
            placeholder="Enter client name"
          />
        </div>

        {/* Client Email */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Client Email</label>
          <input
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            className="mt-1 p-2 w-full bg-gray-300 text-blue-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-700"
            placeholder="Enter client email"
          />
        </div>

        {/* Two-column layout for phone and address on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Client Phone */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Client Phone</label>
            <input
              type="text"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="mt-1 p-2 w-full bg-gray-300 text-blue-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-700"
              placeholder="Enter client phone"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 p-2 w-full bg-gray-300 text-blue-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-700"
              placeholder="Enter client address"
            />
          </div>
        </div>

        {/* Client Type (Radio buttons) */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Client Type</label>
          <div className="flex items-center space-x-8 p-3 bg-gray-300 text-blue-900 rounded-md border border-gray-700">
            <div className="flex items-center">
              <input
                type="radio"
                id="external"
                name="clientType"
                value="external"
                checked={clientType === 'external'}
                onChange={(e) => setClientType(e.target.value)}
                className="h-5 w-5 text-gray-600 focus:ring-2 focus:ring-gray-500"
              />
              <label htmlFor="external" className="ml-2 text-gray-600 cursor-pointer">External</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="internal"
                name="clientType"
                value="internal"
                checked={clientType === 'internal'}
                onChange={(e) => setClientType(e.target.value)}
                className="h-5 w-5 text-gray-600 focus:ring-2 focus:ring-gray-500"
              />
              <label htmlFor="internal" className="ml-2 text-gray-600 cursor-pointer">Internal</label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className={`w-full p-3 text-white rounded-md font-bold transition duration-200 ${
              isClientActionLoading 
                ? 'bg-blue-900 cursor-not-allowed' 
                : 'bg-blue-800 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }`}
            disabled={isClientActionLoading}
          >
            {isClientActionLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Adding Client...
              </div>
            ) : 'Add Client'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataEntry;
