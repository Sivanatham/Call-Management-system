import React from 'react';
import { 
  BarChart3, 
  Users, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  LogOut,
  Menu,
  UserPlus ,
  X
} from 'lucide-react';

const Sidebar = ({ activeSection, onSectionChange, isMobileMenuOpen, onMobileMenuToggle }) => {
const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'employees', label: 'Employees', icon: Users },
  { id: 'addCustomer', label: 'Add Customer', icon: UserPlus }, // must exist
  { id: 'completed', label: 'Completed Works', icon: CheckCircle },
  { id: 'pending', label: 'Pending Works', icon: Clock },
  { id: 'reassign', label: 'Reassign Works', icon: RefreshCw },
];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuToggle}
        className="mobile-menu-button lg:hidden"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay lg:hidden"
          onClick={onMobileMenuToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''} lg:static lg:translate-x-0`}>
        <div className="sidebar-content">
          {/* Header */}
          <div className="sidebar-header">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 size={28} />
              Manager Dashboard
            </h2>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onSectionChange(item.id);
                        onMobileMenuToggle();
                      }}
                      className={`sidebar-menu-item ${
                        activeSection === item.id ? 'active' : ''
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="sidebar-footer">
            <button 
              className="sidebar-menu-item"
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
