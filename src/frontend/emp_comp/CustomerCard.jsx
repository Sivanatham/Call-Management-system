import { useState } from "react";

const CustomerCard = ({ data, onSave, darkMode }) => {
  const [status, setStatus] = useState(data.status || "Pending");
  const [callDuration, setCallDuration] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSave = () => {
    if (status !== "Pending") {
      onSave(data, status, callDuration, feedback);
    }
  };

  return (
    <div style={{
      background: darkMode ? '#374151' : 'white',
      padding: '24px',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: darkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
      transition: 'all 0.3s ease'
    }}>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px',
        paddingBottom: '16px',
        borderBottom: '2px solid #f3f4f6'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '700', 
          color: darkMode ? '#f9fafb' : '#1f2937',
          margin: 0
        }}>
          {data.name}
        </h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {data.isTeamTask && (
            <span style={{
              background: '#f59e0b',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              color: 'white',
              fontWeight: '600'
            }}>
              👥 Team
            </span>
          )}
          <span style={{
            background: '#3b82f6',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '13px',
            color: 'white',
            fontWeight: '600'
          }}>
            {data.phone}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <p style={{ 
          fontSize: '14px', 
          color: darkMode ? '#d1d5db' : '#6b7280',
          margin: 0
        }}>
          <b style={{ color: darkMode ? '#f9fafb' : '#374151' }}>📅 Assigned:</b> {data.assignedDate}
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '16px' 
      }}>
        <a
          href={`tel:${data.phone}`}
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '12px',
            borderRadius: '10px',
            fontWeight: '600',
            textDecoration: 'none',
            background: '#10b981',
            color: 'white',
            fontSize: '14px',
            transition: '0.2s'
          }}
        >
          {data.phone}
        </a>
        <div
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '12px',
              borderRadius: '10px',
              fontWeight: '600',
              background: '#6366f1',
              color: 'white',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            📢 {data.campaign || "No Campaign"}
      </div>
      </div>

      <select 
        value={status} 
        onChange={(e) => setStatus(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '10px',
          border: darkMode ? '1px solid #4b5563' : '2px solid #e5e7eb',
          fontSize: '14px',
          fontWeight: '500',
          color: darkMode ? '#f9fafb' : '#374151',
          background: darkMode ? '#4b5563' : 'white',
          marginBottom: '12px',
          cursor: 'pointer'
        }}
      >
        <option>Pending</option>
        <option>Attended</option>
        <option>Not Attended</option>
        <option>Not Reachable</option>
      </select>

      {status === "Attended" && (
        <input
          type="text"
          placeholder="Call duration (e.g., 5 mins)"
          value={callDuration}
          onChange={(e) => setCallDuration(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: darkMode ? '1px solid #4b5563' : '2px solid #e5e7eb',
            fontSize: '14px',
            marginBottom: '12px',
            boxSizing: 'border-box',
            background: darkMode ? '#4b5563' : 'white',
            color: darkMode ? '#f9fafb' : '#1f2937'
          }}
        />
      )}

      <textarea 
        placeholder="Enter call notes..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '10px',
          border: darkMode ? '1px solid #4b5563' : '2px solid #e5e7eb',
          fontSize: '14px',
          minHeight: '80px',
          resize: 'vertical',
          marginBottom: '12px',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
          background: darkMode ? '#4b5563' : 'white',
          color: darkMode ? '#f9fafb' : '#1f2937'
        }}
      ></textarea>

      <button 
        onClick={handleSave}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '10px',
          border: 'none',
          fontWeight: '700',
          background: '#3b82f6',
          color: 'white',
          cursor: 'pointer',
          fontSize: '15px',
          transition: '0.2s'
        }}
      >
        Save Call Update
      </button>
    </div>
  );
};

export default CustomerCard;
