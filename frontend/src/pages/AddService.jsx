import React, { useState, useEffect, useRef } from 'react';
import { useServiceStore } from '../store/useServiceStore';
import { useClientStore } from '../store/useClientStore';
import { useProviderStore } from '../store/useProviderStore';
import { Navigate } from 'react-router-dom';

const AddService = () => {
  const { clients, fetchClients, isClientsLoading } = useClientStore();
  const { providers, fetchProviders, isProvidersLoading } = useProviderStore();
  const { addService } = useServiceStore();
  
  const [serviceData, setServiceData] = useState({
    clientId: '',
    serviceProviderId: '', 
    startDate: '',
    duration: '1 month',
    serviceType: 'domain only',
    serviceName: '',
    endDate: ''
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [providerSearchQuery, setProviderSearchQuery] = useState('');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);
  const [selectedClientName, setSelectedClientName] = useState('');
  const [selectedProviderName, setSelectedProviderName] = useState('');
  const [selectedServiceName, setSelectedServiceName] = useState('');
  const clientDropdownRef = useRef(null);
  const providerDropdownRef = useRef(null);
  const [calculatedEndDate, setCalculatedEndDate] = useState('');
  const [isServiceCreated, setIsServiceCreated] = useState(false);

  // Fetch clients and service providers on component mount
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

    const newService = { ...serviceData };

    try {
      await addService(newService);
      setServiceData({
        clientId: '',
        serviceProviderId: '',
        startDate: '',
        duration: '1 month',
        serviceType: 'domain only',
        serviceName: '',
        endDate: ''
      });
      setSearchQuery('');
      setProviderSearchQuery('');
      setSelectedClientName('');
      setSelectedProviderName('');
      setCalculatedEndDate('');
      setSelectedServiceName('');
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

  const filteredClients = clients.filter(client =>
    client.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProviders = providers.filter(provider =>
    provider.providerName.toLowerCase().includes(providerSearchQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setServiceData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

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
      <div className="mt-20 flex justify-center items-center h-64 bg-gray-200 text-blue-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        <span className="ml-3">Loading clients and providers...</span>
      </div>
    );
  }

  if (isServiceCreated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="bg-gray-200 text-blue-900 mt-20 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h1 className="text-2xl font-bold text-center mb-6">Create New Service</h1>

        {/* Client Dropdown */}
        <div className="space-y-2" ref={clientDropdownRef}>
          <label className="block text-sm font-medium">Client</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Type to search clients..."
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
              className="bg-gray-300 text-blue-900 w-full p-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            
            {isClientDropdownOpen && filteredClients.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-gray-300 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredClients.map((client) => (
                  <div
                    key={client._id}
                    onClick={() => handleClientSelect(client)}
                    className="px-4 py-2 font-medium hover:bg-blue-600 hover:text-white cursor-pointer"
                  >
                    {client.clientName}
                  </div>
                ))}
              </div>
            )}
            
            {isClientDropdownOpen && searchQuery && filteredClients.length === 0 && (
              <div className="absolute z-10 mt-1 w-full bg-gray-300 border border-gray-700 rounded-md shadow-lg p-2">
                No clients found
              </div>
            )}
          </div>
        </div>

        {/* Service Provider Dropdown */}
        <div className="space-y-2" ref={providerDropdownRef}>
          <label className="block text-sm font-medium">Service Provider</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for service provider..."
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
              className="bg-gray-300 text-blue-900 w-full p-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            
            {isProviderDropdownOpen && filteredProviders.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-gray-300 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredProviders.map((provider) => (
                  <div
                    key={provider._id}
                    onClick={() => handleProviderSelect(provider)}
                    className="px-4 py-2 font-medium hover:bg-blue-600 hover:text-white cursor-pointer"
                  >
                    {provider.providerName}
                  </div>
                ))}
              </div>
            )}
            
            {isProviderDropdownOpen && providerSearchQuery && filteredProviders.length === 0 && (
              <div className="absolute z-10 mt-1 w-full bg-gray-300 border border-gray-700 rounded-md shadow-lg p-2">
                No providers found
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={serviceData.startDate}
              onChange={handleChange}
              required
              className="bg-gray-300 text-blue-900 w-full p-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Duration</label>
            <select
              name="duration"
              value={serviceData.duration}
              onChange={handleChange}
              required
              className="bg-gray-300 text-blue-900 w-full p-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="1 month">1 month</option>
              <option value="3 months">3 months</option>
              <option value="6 months">6 months</option>
              <option value="1 year">1 year</option>
              <option value="2 years">2 years</option>
              <option value="5 years">5 years</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">End Date</label>
          <div className="bg-gray-300 text-blue-900 w-full p-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
            {calculatedEndDate ? formatDate(calculatedEndDate) : 'Select start date and duration'}
          </div>
          <p className="text-xs text-gray-700 italic">End date is automatically calculated</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Service Type</label>
          <select
            name="serviceType"
            value={serviceData.serviceType}
            onChange={handleChange}
            required
            className="bg-gray-300 text-blue-900 w-full p-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <option value="domain only">Domain Only</option>
            <option value="domain + hosting">Domain + Hosting</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Domain Name</label>
          <input
            type="text"
            placeholder="Enter domain name"
            name="serviceName"
            value={serviceData.serviceName}
            onChange={handleInputChange}
            className="bg-gray-300 text-blue-900 w-full p-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!serviceData.clientId || !serviceData.serviceProviderId || !serviceData.startDate || !serviceData.serviceName}
        >
          Create Service
        </button>
      </form>
    </div>
  );
};

export default AddService;