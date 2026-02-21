import React from 'react';
import { Users, Phone, Mail, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const CustomerTable = ({ customers, title, showStatus = true, filterStatus = null }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Willing':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'Pending':
        return <Clock size={16} className="text-orange-500" />;
      case 'Not Interested':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Willing':
        return 'status-willing';
      case 'Pending':
        return 'status-pending';
      case 'Not Interested':
        return 'status-not-interested';
      default:
        return 'status-not-interested';
    }
  };

  const filteredCustomers = filterStatus 
    ? customers.filter(customer => customer.status === filterStatus)
    : customers;

  return (
    <div className="glass-effect rounded-xl p-6 card-hover border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-500 text-white rounded-lg">
          <Users size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <span className="ml-auto bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
          {filteredCustomers.length} {filteredCustomers.length === 1 ? 'Customer' : 'Customers'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
              {showStatus && (
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              )}
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={showStatus ? 5 : 4} className="text-center py-8 text-gray-500">
                  No customers found
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr 
                  key={customer.id} 
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-3 px-4 text-gray-600 font-medium">#{customer.id}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="avatar avatar-sm bg-gray-200">
                        <Users size={16} className="text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-900">{customer.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={16} />
                      {customer.phone}
                    </div>
                  </td>
                  {showStatus && (
                    <td className="py-3 px-4">
                      <div className={`status-badge ${getStatusBadgeClass(customer.status)}`}>
                        {getStatusIcon(customer.status)}
                        {customer.status}
                      </div>
                    </td>
                  )}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={16} />
                      {customer.email}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;
