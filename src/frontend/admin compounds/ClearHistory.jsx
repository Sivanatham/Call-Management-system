import React, { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

const ClearHistory = ({ onClearHistory }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isConfirmed) {
      onClearHistory();
      setIsConfirmed(false);
    }
  };

  return (
    <div className="glass-effect rounded-xl p-6 card-hover border border-red-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-500 text-white rounded-lg">
          <Trash2 size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Call History Management</h3>
      </div>

      <div className="space-y-4">
        <div className="warning-box">
          <div className="warning-content">
            <AlertTriangle size={20} className="text-red-600 mt-0.5" />
            <div>
              <h4 className="warning-title">Warning</h4>
              <p className="warning-text">
                This action will permanently delete all call history records. 
                This cannot be undone and may affect reporting and analytics.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="confirmation-group">
            <input
              type="checkbox"
              id="confirm-clear"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="confirmation-checkbox"
            />
            <label htmlFor="confirm-clear" className="confirmation-label">
              I understand the consequences and want to proceed
            </label>
          </div>

          <button
            type="submit"
            disabled={!isConfirmed}
            className="btn-danger w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={20} className="inline mr-2" />
            Clear All Call History
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClearHistory;
