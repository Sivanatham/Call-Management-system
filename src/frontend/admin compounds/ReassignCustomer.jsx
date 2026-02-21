import React, { useState } from 'react';
import { RefreshCw, Users, User } from 'lucide-react';

const ReassignCustomer = ({ customers, teams, onSubmit }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    teamId: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData.customerId, formData.teamId);
    setFormData({
      customerId: '',
      teamId: ''
    });
  };

  return (
    <div className="glass-effect rounded-xl p-6 card-hover border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-500 text-white rounded-lg">
          <RefreshCw size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Reassign Customer</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label className="form-label">
            Select Customer
          </label>
          <select
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            required
            className="form-input"
          >
            <option value="">-- Select Customer --</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} ({customer.phone})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            Select New Team
          </label>
          <select
            name="teamId"
            value={formData.teamId}
            onChange={handleChange}
            required
            className="form-input"
          >
            <option value="">-- Select New Team --</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-warning w-full">
          <RefreshCw size={20} className="inline mr-2" />
          Reassign Customer
        </button>
      </form>
    </div>
  );
};

export default ReassignCustomer;
