import React, { useState, useEffect } from 'react';
import { useProviderStore } from '../store/useProviderStore';
import { Link } from 'react-router-dom';
import { Database, Search } from 'lucide-react'; 

const ServiceProvider = () => {
  const { providers, fetchProviders, isProvidersLoading } = useProviderStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProviders, setFilteredProviders] = useState([]);

  useEffect(() => {
    fetchProviders(); 
  }, [fetchProviders]);

  // Update filtered providers whenever providers change
  useEffect(() => {
    setFilteredProviders(providers);
  }, [providers]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Filter providers based on search term
    const filtered = providers.filter(provider => 
      provider.providerName.toLowerCase().includes(term.toLowerCase()) ||
      provider.providerEmail.toLowerCase().includes(term.toLowerCase()) ||
      provider.providerPhone.toLowerCase().includes(term.toLowerCase()) ||
      provider.providerAddress.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProviders(filtered);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Service Providers</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 shadow-sm"
                placeholder="Search by provider, email, phone..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Link 
              to="/addprovider" 
              className="bg-blue-900 hover:bg-blue-700 text-white px-6 py-2.5 flex items-center justify-center rounded-lg transition-colors text-center font-medium shadow-sm"
            >   
              <Database className="h-5 w-5 mr-2" />
              <span>Add Provider</span>
            </Link>
          </div>
        </div>

        {isProvidersLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {filteredProviders.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                {searchTerm 
                  ? `No providers found matching "${searchTerm}"` 
                  : "No service providers available."
                }
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProviders.map((provider) => (
                    <tr key={provider._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 whitespace-nowrap">{provider.providerName}</td>
                      <td className="p-3 whitespace-nowrap">{provider.providerEmail}</td>
                      <td className="p-3 whitespace-nowrap">{provider.providerPhone}</td>
                      <td className="p-3">{provider.providerAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceProvider;