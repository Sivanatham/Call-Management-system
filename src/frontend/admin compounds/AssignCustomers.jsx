import React, { useState } from 'react';
import { Users, CheckSquare, UserPlus } from 'lucide-react';

const AssignCustomers = ({ customers, teams, onSubmit }) => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  const handleCustomerToggle = (customerId) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map(c => c.id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTeam && selectedCustomers.length > 0) {
      onSubmit(selectedTeam, selectedCustomers);
      setSelectedTeam('');
      setSelectedCustomers([]);
    }
  };

  return (
    <div className="glass-effect rounded-xl p-6 card-hover border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-teal-500 text-white rounded-lg">
          <UserPlus size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Assign Customers to Team</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Team Selection */}
        <div className="form-group">
          <label className="form-label">
            Select Team
          </label>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            required
            className="form-input"
          >
            <option value="">-- Select Team --</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {/* Customer Selection */}
        <div className="form-group">
          <div className="flex items-center justify-between mb-4">
            <label className="form-label">
              Select Customers
            </label>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {selectedCustomers.length === customers.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="customer-checkbox-list">
            {customers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No customers available
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {customers.map((customer) => (
                  <label
                    key={customer.id}
                    className="customer-checkbox-item"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => handleCustomerToggle(customer.id)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div className="customer-checkbox-info">
                      <div className="customer-checkbox-name">
                        <div className="avatar avatar-sm bg-gray-200">
                          <Users size={14} className="text-gray-600" />
                        </div>
                        <span>{customer.name}</span>
                      </div>
                      <div className="customer-checkbox-phone">
                        {customer.phone}
                      </div>
                    </div>
                    {customer.status && (
                      <div className={`status-badge ${getStatusBadgeClass(customer.status)}`}>
                        {customer.status}
                      </div>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>

          {selectedCustomers.length > 0 && (
            <div className="mt-3 text-sm text-gray-600">
              {selectedCustomers.length} customer{selectedCustomers.length !== 1 ? 's' : ''} selected
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!selectedTeam || selectedCustomers.length === 0}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckSquare size={20} className="inline mr-2" />
          Assign Selected Customers ({selectedCustomers.length})
        </button>
      </form>
    </div>
  );
};

// Helper function for status badge classes
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

export default AssignCustomers;
