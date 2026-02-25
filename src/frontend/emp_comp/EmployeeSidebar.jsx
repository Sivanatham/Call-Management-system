import React from "react";
import { LayoutDashboard, UserPlus, Upload, History } from "lucide-react";

const EmployeeSidebar = ({
  activeSection,
  setActiveSection,
  sidebarOpen,
  setSidebarOpen,
  isMobile
}) => {
  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "addCustomer", label: "Add Customer", icon: UserPlus },
    { key: "bulkUpload", label: "Bulk Upload", icon: Upload },
    { key: "history", label: "Task History", icon: History },
  ];

  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        background: "#1e293b",
        color: "white",
        padding: "24px",
        position: "fixed",
        left: isMobile ? (sidebarOpen ? "0" : "-260px") : "0",
        top: 0,
        transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: 1000,
        boxShadow: isMobile && sidebarOpen ? "4px 0 20px rgba(0,0,0,0.3)" : "none",
        overflowY: "auto"
      }}
    >
      {/* CLOSE BUTTON FOR MOBILE */}
      {isMobile && (
        <div
          style={{
            textAlign: "right",
            cursor: "pointer",
            marginBottom: "24px",
            padding: "8px",
            borderRadius: "6px",
            transition: "background 0.2s"
          }}
          onMouseEnter={(e) => e.target.style.background = "#334155"}
          onMouseLeave={(e) => e.target.style.background = "transparent"}
          onClick={() => setSidebarOpen(false)}
        >
          <span style={{ fontSize: "20px", fontWeight: "bold" }}>×</span>
        </div>
      )}

      <h2 style={{ 
        marginBottom: "32px", 
        fontSize: "20px",
        fontWeight: "600"
      }}>
        Employee Panel
      </h2>

      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.key}
            onClick={() => {
              setActiveSection(item.key);
              if (isMobile) setSidebarOpen(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 16px",
              cursor: "pointer",
              borderRadius: "10px",
              background: activeSection === item.key ? "#334155" : "transparent",
              marginBottom: "8px",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              fontWeight: activeSection === item.key ? "600" : "500"
            }}
            onMouseEnter={(e) => {
              if (activeSection !== item.key) {
                e.target.style.background = "#334155";
              }
            }}
            onMouseLeave={(e) => {
              if (activeSection !== item.key) {
                e.target.style.background = "transparent";
              }
            }}
          >
            <Icon size={20} />
            <span style={{ fontSize: "15px" }}>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default EmployeeSidebar;
