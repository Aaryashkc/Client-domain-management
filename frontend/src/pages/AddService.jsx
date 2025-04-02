import React, { useState, useEffect, useRef } from 'react';
import { useServiceStore } from '../store/useServiceStore';
import { useClientStore } from '../store/useClientStore';
import { useProviderStore } from '../store/useProviderStore';
import { useEmailStore } from '../store/useEmailStore';
import { Navigate } from 'react-router-dom';

const AddService = () => {
  const { clients, fetchClients, isClientsLoading } = useClientStore();
  const { providers, fetchProviders, isProvidersLoading } = useProviderStore();
  const { addService } = useServiceStore();
  
  const [serviceData, setServiceData] = useState({
    clientId: '',
    serviceProviderId: '', 
    startDate: new Date().toISOString().split('T')[0],
    duration: '1 month',
    serviceType: 'domain only',
    serviceName: '',
    endDate: '',
    emails: [],
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [providerSearchQuery, setProviderSearchQuery] = useState(''); 
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);
  const [selectedClientName, setSelectedClientName] = useState('');
  const [selectedProviderName, setSelectedProviderName] = useState('');
  const clientDropdownRef = useRef(null);
  const providerDropdownRef = useRef(null);
  const [calculatedEndDate, setCalculatedEndDate] = useState('');
  const [isServiceCreated, setIsServiceCreated] = useState(false);
  const [domainCost, setDomainCost] = useState('');
  const [hostingCost, setHostingCost] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectedEmailDetails, setSelectedEmailDetails] = useState([]);

  // Email Selection Modal component
  const EmailSelectionModal = ({ isOpen, onClose }) => {
    const { emails } = useEmailStore();
    const [modalSelectedEmails, setModalSelectedEmails] = useState(selectedEmails || []);
  
    const handleEmailToggle = (email) => {
      setModalSelectedEmails((prevSelected) =>
        prevSelected.includes(email._id)
          ? prevSelected.filter((e) => e !== email._id)
          : [...prevSelected, email._id]
      );
    };
  
    const handleConfirm = () => {
      // Update selected emails
      setSelectedEmails(modalSelectedEmails);
      
      // Update selected email details
      const updatedEmailDetails = emails.filter(email => 
        modalSelectedEmails.includes(email._id)
      );
      setSelectedEmailDetails(updatedEmailDetails);
      
      // Close the modal
      onClose();
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto overflow-hidden relative">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-4">
            <h2 className="text-xl font-bold">Select Notification Emails</h2>
          </div>

          {/* Email List */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {emails.length > 0 ? (
              <div className="space-y-3">
                {emails.map((email) => (
                  <div
                    key={email._id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      modalSelectedEmails.includes(email._id)
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'hover:bg-gray-100 border-2 border-transparent'
                    }`}
                    onClick={() => handleEmailToggle(email)}
                  >
                    <div className={`w-6 h-6 mr-4 rounded border-2 flex items-center justify-center ${
                      modalSelectedEmails.includes(email._id)
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-400'
                    }`}>
                      {modalSelectedEmails.includes(email._id) && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-800 font-medium">{email.email}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8 text-sm">No emails available</p>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="bg-gray-100 px-6 py-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Emails section in the form
  const renderEmailSection = () => {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Notification Emails</h3>
        <div className="space-y-2">
          {selectedEmailDetails.length > 0 ? (
            <div className="bg-gray-100 rounded-lg p-4">
              {selectedEmailDetails.map((email) => (
                <div 
                  key={email._id} 
                  className="flex items-center justify-between py-2 border-b last:border-b-0 border-gray-200"
                >
                  <div className="flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-blue-600 mr-3" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                      />
                    </svg>
                    <span className="text-gray-800 font-medium">{email.email}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 text-gray-500 rounded-lg p-4 text-center">
              No notification emails added
            </div>
          )}
          <button 
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            Manage Emails
          </button>
        </div>

        {/* Email Selection Modal */}
        <EmailSelectionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    );
  };

  useEffect(() => {
    fetchClients();
    fetchProviders();
  }, [fetchClients, fetchProviders]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target)) {
        setIsClientDropdownOpen(false);
      }
      if (providerDropdownRef.current && !providerDropdownRef.current.contains(event.target)) {
        setIsProviderDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calculate endDate based on startDate and duration
  const calculateEndDate = (startDate, duration) => {
    if (!startDate) return '';
    
    const start = new Date(startDate);
    let monthsToAdd = 0;

    switch (duration) {
      case "1 month": monthsToAdd = 1; break;
      case "3 months": monthsToAdd = 3; break;
      case "6 months": monthsToAdd = 6; break;
      case "1 year": monthsToAdd = 12; break;
      case "2 years": monthsToAdd = 24; break;
      case "5 years": monthsToAdd = 60; break;
      default: monthsToAdd = 1;
    }

    start.setMonth(start.getMonth() + monthsToAdd);
    return start.toISOString().split('T')[0];
  };

  // Update end date whenever start date or duration changes
  useEffect(() => {
    const endDate = calculateEndDate(serviceData.startDate, serviceData.duration);
    setCalculatedEndDate(endDate);
    setServiceData(prev => ({ ...prev, endDate }));
  }, [serviceData.startDate, serviceData.duration]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serviceData.clientId) {
      alert('Please select a client');
      return;
    }
  
    if (!serviceData.serviceProviderId) {
      alert('Please select a service provider');
      return;
    }
  
    if (!serviceData.startDate) {
      alert('Please select a start date');
      return;
    }

    if (['domain only', 'domain + hosting'].includes(serviceData.serviceType) && !domainCost) {
      alert('Please enter domain cost per year');
      return;
    }

    if (['hosting only', 'domain + hosting'].includes(serviceData.serviceType) && !hostingCost) {
      alert('Please enter hosting cost per GB');
      return;
    }

    const newService = { 
      ...serviceData,
      emails: selectedEmails,
      domainCostPerYear: ['domain only', 'domain + hosting'].includes(serviceData.serviceType) ? Number(domainCost) : undefined,
      hostingCostPerGB: ['hosting only', 'domain + hosting'].includes(serviceData.serviceType) ? Number(hostingCost) : undefined
    };

    try {
      await addService(newService);
      setIsServiceCreated(true);
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleClientSelect = (client) => {
    setServiceData((prevData) => ({
      ...prevData,
      clientId: client._id
    }));
    setSelectedClientName(client.clientName);
    setSearchQuery(client.clientName);
    setIsClientDropdownOpen(false);
  };

  const handleProviderSelect = (provider) => {
    setServiceData((prevData) => ({
      ...prevData,
      serviceProviderId: provider._id
    }));
    setSelectedProviderName(provider.providerName);
    setProviderSearchQuery(provider.providerName);
    setIsProviderDropdownOpen(false);
  };

  const filteredClients = clients
    .filter(client => client.clientStatus === true) 
    .filter(client =>
      client.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filteredProviders = providers.filter(provider =>
    provider.providerName.toLowerCase().includes(providerSearchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isClientsLoading || isProvidersLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-blue-900 font-medium">Loading clients and providers...</p>
        </div>
      </div>
    );
  }

  if (isServiceCreated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-900 text-white p-6">
            <h1 className="text-2xl font-bold">Create New Service</h1>
            <p className="text-blue-100 mt-1">Add a new service for your clients</p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Client Selection */}
                <div className="space-y-2" ref={clientDropdownRef}>
                  <label className="block text-sm font-medium text-gray-700">Client *</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for a client..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsClientDropdownOpen(true);
                        if (e.target.value === '') {
                          setServiceData(prev => ({ ...prev, clientId: '' }));
                          setSelectedClientName('');
                        }
                      }}
                      onClick={() => setIsClientDropdownOpen(true)}
                      className="bg-gray-200 text-blue-900 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    
                    {isClientDropdownOpen && filteredClients.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredClients.map((client) => (
                          <div
                            key={client._id}
                            onClick={() => handleClientSelect(client)}
                            className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-800">{client.clientName}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {isClientDropdownOpen && searchQuery && filteredClients.length === 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-3 text-center text-gray-500">
                        No clients found
                      </div>
                    )}
                  </div>
                  {selectedClientName && (
                    <div className="mt-1 text-sm text-green-600">Selected: {selectedClientName}</div>
                  )}
                </div>

                {/* Service Provider Selection */}
                <div className="space-y-2" ref={providerDropdownRef}>
                  <label className="block text-sm font-medium text-gray-700">Service Provider *</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for a service provider..."
                      value={providerSearchQuery}
                      onChange={(e) => {
                        setProviderSearchQuery(e.target.value);
                        setIsProviderDropdownOpen(true);
                        if (e.target.value === '') {
                          setServiceData(prev => ({ ...prev, serviceProviderId: '' }));
                          setSelectedProviderName('');
                        }
                      }}
                      onClick={() => setIsProviderDropdownOpen(true)}
                      className="bg-gray-200 text-blue-900 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    
                    {isProviderDropdownOpen && filteredProviders.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredProviders.map((provider) => (
                          <div
                            key={provider._id}
                            onClick={() => handleProviderSelect(provider)}
                            className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-800">{provider.providerName}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {isProviderDropdownOpen && providerSearchQuery && filteredProviders.length === 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-3 text-center text-gray-500">
                        No providers found
                      </div>
                    )}
                  </div>
                  {selectedProviderName && (
                    <div className="mt-1 text-sm text-green-600">Selected: {selectedProviderName}</div>
                  )}
                </div>

                {/* Domain Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Domain Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., example.com"
                    name="serviceName"
                    value={serviceData.serviceName}
                    onChange={handleChange}
                    required
                    className="bg-gray-200 text-blue-900 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Service Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Service Type *</label>
                  <select
                    name="serviceType"
                    value={serviceData.serviceType}
                    onChange={handleChange}
                    required
                    className="bg-gray-200 text-blue-900 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="domain only">Domain Only</option>
                    <option value="domain + hosting">Domain + Hosting</option>
                    <option value="hosting only">Hosting Only</option>
                  </select>
                </div>

                {/* Conditional Cost Inputs */}
                {['domain only', 'domain + hosting'].includes(serviceData.serviceType) && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Domain Cost Per Year *</label>
                    <input 
                      type="number" 
                      placeholder="e.g., 15.99"
                      value={domainCost} 
                      onChange={(e) => setDomainCost(e.target.value)}
                      className="bg-gray-200 text-blue-900 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                )}

                {['hosting only', 'domain + hosting'].includes(serviceData.serviceType) && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Hosting Cost Per GB *</label>
                    <input 
                      type="number" 
                      placeholder="e.g., 5.00"
                      value={hostingCost} 
                      onChange={(e) => setHostingCost(e.target.value)}
                      className="bg-gray-200 text-blue-900 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Date and Duration Section */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={serviceData.startDate}
                    onChange={handleChange}
                    required
                    className="bg-gray-200 text-blue-900 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Duration *</label>
                  <select
                    name="duration"
                    value={serviceData.duration}
                    onChange={handleChange}
                    required
                    className="bg-gray-200 text-blue-900 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1 month">1 month</option>
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="1 year">1 year</option>
                    <option value="2 years">2 years</option>
                    <option value="5 years">5 years</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">End Date (Calculated)</label>
                  <div className="bg-gray-100 text-blue-900 w-full p-3 rounded-md border border-gray-300">
                    {calculatedEndDate ? formatDate(calculatedEndDate) : 'Select start date and duration'}
                  </div>
                </div>

                {/* Email Notifications */}
                {renderEmailSection()}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button 
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!serviceData.clientId || !serviceData.serviceProviderId || !serviceData.startDate || !serviceData.serviceName}
              >
                Create Service
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Email Selection Modal */}
      <EmailSelectionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default AddService;