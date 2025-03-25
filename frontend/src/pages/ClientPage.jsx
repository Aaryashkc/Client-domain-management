import React, { useState, useEffect } from 'react';
import { useClientStore } from '../store/useClientStore';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Search, UserPlus, Users, CheckCircle, XCircle } from 'lucide-react';

const ClientPage = () => {
  const { clients, fetchClients, isClientsLoading, toggleClientStatus } = useClientStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    if (clients) {
      setFilteredClients(clients);
      calculateStats(clients);
    }
  }, [clients]);

  const calculateStats = (clientList) => {
    const newStats = {
      total: clientList.length,
      active: clientList.filter(client => client.clientStatus).length,
      inactive: clientList.filter(client => !client.clientStatus).length
    };
    setStats(newStats);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client => 
        client.clientName.toLowerCase().includes(term) ||
        client.companyName.toLowerCase().includes(term) ||
        client.clientEmail.toLowerCase().includes(term) ||
        client.clientPhone.toLowerCase().includes(term) ||
        client.clientType.toLowerCase().includes(term) ||
        client.address.toLowerCase().includes(term)
      );
      setFilteredClients(filtered);
    }
  };

  const handleToggleStatus = async (clientId) => {
    try {
      await toggleClientStatus(clientId);
    } catch (error) {
      console.error("Error toggling client status:", error);
      toast.error('Failed to update client status');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Client Management</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 shadow-sm"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Link 
              to="/dataentry" 
              className="bg-blue-900 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors text-center font-medium shadow-sm flex items-center justify-center gap-2"
            >
              <UserPlus className="h-5 w-5" />
              <span>Add Client</span>
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Clients</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Clients</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.active}</h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Inactive Clients</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.inactive}</h3>
            </div>
          </div>
        </div>

        {isClientsLoading ? (
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
                      Client Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
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
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client) => (
                      <tr key={client._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{client.companyName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{client.clientName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{client.clientEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{client.clientPhone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {client.clientType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 line-clamp-1">{client.address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {client.clientStatus ? (
                            <span className="px-2 py-1 inline-flex text-xs font-medium rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-1 inline-flex text-xs font-medium rounded-full bg-red-100 text-red-800">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleToggleStatus(client._id)}
                              className={`px-3 py-1 rounded-md text-white text-xs font-medium ${
                                client.clientStatus 
                                  ? 'bg-red-700 hover:bg-red-600' 
                                  : 'bg-green-700 hover:bg-green-600'
                              } transition-colors`}
                            >
                              {client.clientStatus ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-10 text-center text-sm text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <Search className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-gray-500">No clients found matching your search criteria</p>
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

export default ClientPage;