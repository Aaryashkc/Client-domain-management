import React, { useState, useEffect } from 'react';
import { useServiceStore } from '../store/useServiceStore';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Search, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FilePlus2, 
  Mail, 
  Loader,
  Eye
} from 'lucide-react';
import { useEmailStore } from '../store/useEmailStore';

// Utility function to calculate days remaining
const calculateDaysRemaining = (endDate) => {
  const today = new Date();
  const end = new Date(endDate);
  const diffTime = end - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Status Badge Component
const StatusBadge = ({ daysRemaining }) => {
  if (daysRemaining < 0) {
    return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Expired</span>;
  } else if (daysRemaining <= 30) {
    return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Expires Soon</span>;
  } else {
    return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</span>;
  }
};

// Detail Modal Component
const DetailModal = ({ isOpen, onClose, service }) => {
  const navigate = useNavigate();
  const { updateServiceEmails } = useServiceStore();
  const { emails, fetchEmails, isLoading: isEmailLoading, error: emailError } = useEmailStore();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailLoadError, setEmailLoadError] = useState(null);
  const [selectedService, setSelectedService] = useState(service);

  // Fetch emails when modal opens with improved error handling
  useEffect(() => {
    const loadEmails = async () => {
      if (isOpen) {
        try {
          const fetchedEmails = await fetchEmails();
          if (fetchedEmails.length === 0) {
            setEmailLoadError('No emails found. Please add emails first.');
          }
        } catch (err) {
          setEmailLoadError(err.message || 'Failed to load emails');
          toast.error('Could not load emails');
        }
      }
    };
    loadEmails();
  }, [isOpen, fetchEmails]);

  if (!isOpen) return null;

  // Improved email filtering with fallback
  const serviceEmails = emails.filter(email => 
    service?.emails?.some(serviceEmailId => 
      serviceEmailId === email._id || serviceEmailId === email.email
    )
  );

  // Email Selection Modal component
  const EmailSelectionModal = ({ isOpen, onClose }) => {
    const { updateServiceEmails } = useServiceStore();
    const { emails, isLoading } = useEmailStore();
    const [modalSelectedEmails, setModalSelectedEmails] = useState(service?.emails || []);

    // Reset selected emails when modal opens
    useEffect(() => {
      if (isOpen) {
        setModalSelectedEmails(service?.emails || []);
      }
    }, [isOpen, service?.emails]);

    const handleEmailToggle = (email) => {
      setModalSelectedEmails((prevSelected) =>
        prevSelected.includes(email._id)
          ? prevSelected.filter((e) => e !== email._id)
          : [...prevSelected, email._id]
      );
    };

    const handleConfirm = async () => {
      try {
        // Validate email selection
        if (modalSelectedEmails.length === 0) {
          toast.error('Please select at least one email');
          return;
        }

        const result = await updateServiceEmails(service._id, modalSelectedEmails);

        // Update local state and service immediately
        if (result !== null) {
          // Update the parent component's state
          setSelectedService(prevService => ({
            ...prevService,
            emails: modalSelectedEmails
          }));

          // Immediately update the service object
          service.emails = modalSelectedEmails;

          // Show success toast with specific message
          toast.success('Notification Emails Updated Successfully');

          // Close the email selection modal
          onClose();
        }
      } catch (error) {
        console.error('Failed to update service emails', {
          error: error.message,
          serviceId: service._id,
          selectedEmails: modalSelectedEmails
        });

        // Only show error toast if it's a genuine error
        if (error.response || error.message) {
          toast.error(
            error.response?.data?.message || 
            'Failed to update service emails. Please check your connection and try again.'
          );
        }
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto overflow-hidden relative">
          {/* Loading state */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
              <Loader className="animate-spin text-blue-600" />
            </div>
          )}
          
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-4">
            <h2 className="text-xl font-bold">Update Notification Emails</h2>
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Existing Service Details */}
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Domain Name</p>
            <p className="text-base text-gray-900">{service?.serviceName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Service Type</p>
            <p className="text-base text-gray-900">{service?.serviceType || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Domain Cost/Year</p>
            <p className="text-base text-gray-900">
              {(service?.serviceType === 'domain only' || service?.serviceType === 'domain + hosting') 
                ? `Nrs. ${service.domainCostPerYear}` 
                : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Hosting Cost/GB</p>
            <p className="text-base text-gray-900">
              {(service?.serviceType === 'hosting only' || service?.serviceType === 'domain + hosting') 
                ? `Nrs.${service.hostingCostPerGB}` 
                : 'N/A'}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Notification Emails</h3>
          <div className="space-y-2">
            {serviceEmails.length > 0 ? (
              <div className="bg-gray-100 rounded-lg p-4">
                {serviceEmails.map((email) => (
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
              onClick={() => setIsEmailModalOpen(true)}
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
        </div>

        {/* Email Selection Modal */}
        <EmailSelectionModal 
          isOpen={isEmailModalOpen} 
          onClose={() => setIsEmailModalOpen(false)} 
        />
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, color, title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
    <div className={`rounded-full ${color} p-3 mr-4`}>
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const { 
    services, 
    fetchServices, 
    isServicesLoading, 
    sendServiceEmail, 
    updateServiceEmails
  } = useServiceStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const [loadingEmails, setLoadingEmails] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    expiringSoon: 0
  });
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    if (services) {
      const calculatedStats = calculateServiceStats(services);
      setFilteredServices(services);
      setStats(calculatedStats);
    }
  }, [services]);

  const calculateServiceStats = (servicesList) => {
    return servicesList.reduce((stats, service) => {
      const daysRemaining = calculateDaysRemaining(service.endDate);
      
      stats.total++;
      
      if (daysRemaining < 0) {
        stats.expired++;
      } else if (daysRemaining <= 30) {
        stats.expiringSoon++;
      } else {
        stats.active++;
      }
      
      return stats;
    }, { total: 0, active: 0, expired: 0, expiringSoon: 0 });
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  
    const filtered = term.trim() === '' 
      ? services 
      : services.filter(service => 
          service.clientId?.companyName.toLowerCase().includes(term) || 
          service.serviceProviderId?.providerName.toLowerCase().includes(term) ||
          service.serviceType.toLowerCase().includes(term)
        );
    
    setFilteredServices(filtered);
  };

  const handleSendEmail = async (serviceId) => {
    try {
      setLoadingEmails(prev => ({ ...prev, [serviceId]: true }));
      await sendServiceEmail(serviceId);
    } catch (error) {
      toast.error('Failed to send email');
    } finally {
      setLoadingEmails(prev => ({ ...prev, [serviceId]: false }));
    }
  };

  const openDetailModal = (service) => {
    setSelectedService(service);
    setDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedService(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Services Dashboard</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 shadow-sm"
                placeholder="Search by company, provider, service..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Link 
              to="/addservice" 
              className="bg-blue-900 hover:bg-blue-700 text-white px-6 py-2.5 flex items-center justify-center rounded-lg transition-colors text-center font-medium shadow-sm"
            >   
             <FilePlus2 className="h-5 w-5 mr-2" />
              <span>Add Service</span>
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            icon={Users} 
            color="bg-blue-100" 
            title="Total Services" 
            value={stats.total} 
          />
          <StatCard 
            icon={CheckCircle} 
            color="bg-green-100" 
            title="Active" 
            value={stats.active} 
          />
          <StatCard 
            icon={Clock} 
            color="bg-yellow-100" 
            title="Expiring Soon" 
            value={stats.expiringSoon} 
          />
          <StatCard 
            icon={AlertTriangle} 
            color="bg-red-100" 
            title="Expired" 
            value={stats.expired} 
          />
        </div>

        {isServicesLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex justify-center items-center h-64">
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service Provider
                    </th>
                    {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Domain Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Domain Cost/Year
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hosting Cost/GB
                    </th> */}
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Days Remaining
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => {
                    const daysRemaining = calculateDaysRemaining(service.endDate);
                    const isEmailLoading = loadingEmails[service._id] || false;
                    return (
                      <tr key={service._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {service.clientId?.companyName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {service.serviceProviderId?.providerName}
                          </div>
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{service.serviceType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{service.serviceName}</div>
                        </td> */}
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {service.serviceType === 'domain only' || service.serviceType === 'domain + hosting' 
                              ? `$${service.domainCostPerYear}` 
                              : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {service.serviceType === 'hosting only' || service.serviceType === 'domain + hosting' 
                              ? `$${service.hostingCostPerGB}` 
                              : '-'}
                          </div>
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(service.startDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(service.endDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{daysRemaining}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge daysRemaining={daysRemaining} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => openDetailModal(service)}
                              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => handleSendEmail(service._id)}
                              disabled={isEmailLoading}
                              className={`flex items-center transition-colors ${
                                isEmailLoading
                                  ? 'text-gray-400 cursor-not-allowed'
                                  : 'text-blue-600 hover:text-blue-900'
                              }`}
                            >
                              {isEmailLoading ? (
                                <>
                                  <Loader className="h-4 w-4 mr-1 animate-spin" />
                                  <span>Sending...</span>
                                </>
                              ) : (
                                <>
                                  <Mail className="h-4 w-4 mr-1" />
                                  <span>Email</span>
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="11" className="px-6 py-10 text-center text-sm text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-gray-500">No services found matching your search criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {/* Details Modal */}
      <DetailModal 
        isOpen={detailModalOpen} 
        onClose={closeDetailModal} 
        service={selectedService} 
      />
    </div>
  );
};

export default Dashboard;