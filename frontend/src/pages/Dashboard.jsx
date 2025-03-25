import React, { useState, useEffect } from 'react';
import { useServiceStore } from '../store/useServiceStore';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Search, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FilePlus2, 
  Mail, 
  Loader 
} from 'lucide-react';

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
    sendServiceEmail 
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
          service.serviceProviderId?.providerName.toLowerCase().includes(term) || 
          service.clientId?.companyName.toLowerCase().includes(term) ||
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Domain Name
                    </th>
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{service.serviceType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{service.serviceName}</div>
                        </td>
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
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-10 text-center text-sm text-gray-500">
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
    </div>
  );
};

export default Dashboard;