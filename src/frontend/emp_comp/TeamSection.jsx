import React from 'react';

const TeamSection = ({ teamData, darkMode }) => {
  if (!teamData) return null;

  return (
    <div style={{
      background: darkMode ? '#374151' : 'white',
      padding: '24px',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      marginBottom: '24px'
    }}>
      <h2 style={{ 
        fontSize: '20px', 
        fontWeight: '700',
        color: darkMode ? '#f9fafb' : '#1f2937',
        marginBottom: '20px'
      }}>
        👥 {teamData.team_name}
      </h2>

      {/* Team Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: darkMode ? '#4b5563' : '#f3f4f6',
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>
            {teamData.total_tasks}
          </div>
          <div style={{ fontSize: '12px', color: darkMode ? '#d1d5db' : '#6b7280' }}>
            Total Tasks
          </div>
        </div>
        <div style={{
          background: darkMode ? '#4b5563' : '#f3f4f6',
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>
            {teamData.pending_tasks}
          </div>
          <div style={{ fontSize: '12px', color: darkMode ? '#d1d5db' : '#6b7280' }}>
            Pending
          </div>
        </div>
        <div style={{
          background: darkMode ? '#4b5563' : '#f3f4f6',
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
            {teamData.completed_tasks}
          </div>
          <div style={{ fontSize: '12px', color: darkMode ? '#d1d5db' : '#6b7280' }}>
            Completed
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: darkMode ? '#f9fafb' : '#1f2937',
          marginBottom: '12px'
        }}>
          Team Members ({teamData.members.length})
        </h3>
        <div style={{
          display: 'grid',
          gap: '8px'
        }}>
          {teamData.members.map((member) => (
            <div key={member.id} style={{
              background: darkMode ? '#4b5563' : '#f9fafb',
              padding: '12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
                fontSize: '16px'
              }}>
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: '600',
                  color: darkMode ? '#f9fafb' : '#1f2937',
                  fontSize: '14px'
                }}>
                  {member.name}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: darkMode ? '#d1d5db' : '#6b7280'
                }}>
                  📧 {member.email}
                </div>
              </div>
              <div style={{
                fontSize: '12px',
                color: darkMode ? '#d1d5db' : '#6b7280'
              }}>
                📞 {member.phone}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
