import React from 'react';
import {
  BarChart3, Users, CheckCircle, Clock,
  RefreshCw, LogOut, Menu, UserPlus, X
} from 'lucide-react';

const Sidebar = ({ activeSection, onSectionChange, isMobileMenuOpen, onMobileMenuToggle }) => {

  const menuItems = [
    { id: 'dashboard',     label: 'Dashboard',      icon: BarChart3 },
    { id: 'employees',     label: 'Employees',      icon: Users },
    { id: 'assignedTasks', label: 'Assigned Tasks', icon: CheckCircle },
    { id: 'addCustomer',   label: 'Add Customer',   icon: UserPlus },
    { id: 'completed',     label: 'Completed Works', icon: CheckCircle },
    { id: 'pending',       label: 'Pending Works',    icon: Clock },
    { id: 'reassign',      label: 'Reassign Works',   icon: RefreshCw },
  ];

  const handleClick = (item) => {
    onSectionChange(item.id);
    if (window.innerWidth < 1024) onMobileMenuToggle();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .mobile-menu-button {
          position: fixed;
          top: 16px;
          left: 16px;
          z-index: 1100; /* Higher than sidebar and overlay */
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: #1e3a8a;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          z-index: 900;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .sidebar-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 280px;
          background: linear-gradient(180deg, #1e3a8a 0%, #172554 100%);
          color: white;
          z-index: 1000;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }

        .sidebar.open {
          transform: translateX(0);
        }

        .sidebar-menu-item {
          width: calc(100% - 24px);
          margin: 4px 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.8);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          justify-content: flex-start;
        }

        .sidebar-menu-item:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        .sidebar-menu-item.active {
          background: #3b82f6;
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        @media (min-width: 1024px) {
          .mobile-menu-button, .sidebar-overlay { display: none !important; }
          .sidebar {
            position: sticky;
            transform: translateX(0);
          }
        }
      `}} />

      <button
        className="mobile-menu-button lg:hidden"
        onClick={onMobileMenuToggle}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`sidebar-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={onMobileMenuToggle}
      />

      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 size={24} /> Manager
          </h2>
        </div>

        <nav className="flex-1 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item)}
                className={`sidebar-menu-item ${activeSection === item.id ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            className="sidebar-menu-item text-red-300 hover:text-red-100"
            onClick={() => { localStorage.clear(); window.location.href = '/'; }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;