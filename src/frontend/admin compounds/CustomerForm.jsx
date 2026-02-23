import React, { useState, useEffect } from 'react';
import { UserPlus, Phone, User, FileText } from 'lucide-react';
import api from '../api';

const CustomerForm = () => {

  const [campaigns, setCampaigns] = useState([]);

  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    priority: 'HIGH',
    campaign: '',
    remarks: ''
  });

  // Load campaigns dynamically
  useEffect(() => {
    api.get("/campaigns/")
      .then(res => {
        setCampaigns(res.data.campaigns);
      })
      .catch(() => setCampaigns([]));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/calls/", formData);
      alert("Customer Added Successfully ✅");

      setFormData({
        customer_name: '',
        phone: '',
        priority: 'HIGH',
        campaign: '',
        remarks: ''
      });

    } catch (err) {
      console.log(err);
      alert("Error adding customer ❌");
    }
  };

  return (
    <div className="glass-effect rounded-xl p-6 card-hover border border-gray-200">

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-500 text-white rounded-lg">
          <UserPlus size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          Add Customer Manually
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Customer Name */}
        <div className="form-input-with-icon">
          <User className="icon" size={20} />
          <input
            type="text"
            name="customer_name"
            placeholder="Customer Name"
            value={formData.customer_name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        {/* Phone */}
        <div className="form-input-with-icon">
          <Phone className="icon" size={20} />
          <input
  name="phone"
  placeholder="Phone"
  value={formData.phone}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, ""); // remove non-digits
    if (value.length <= 10) {
      setFormData({ ...formData, phone: value });
    }
  }}
  maxLength={10}
  inputMode="numeric"
  pattern="\d{10}"
  required
  style={inputStyle}
/>
        </div>

        {/* Priority */}
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="form-input"
        >
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>

        {/* Campaign */}
        <select
          name="campaign"
          value={formData.campaign}
          onChange={handleChange}
          required
          className="form-input"
        >
          <option value="">-- Select Campaign --</option>
          {campaigns.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Remarks */}
        <div className="form-input-with-icon">
          <FileText className="icon" size={20} />
          <textarea
            name="remarks"
            placeholder="Remarks"
            value={formData.remarks}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <button type="submit" className="btn-success w-full">
          <UserPlus size={20} className="inline mr-2" />
          Add Customer
        </button>

      </form>
    </div>
  );
};

export default CustomerForm;