import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu as MenuIcon, Close as CloseIcon, Analytics as AnalyticsIcon, Chat as ChatIcon, AdminPanelSettings as AdminIcon, Person as PersonIcon, Settings as SettingsIcon, Calculate as CalculateIcon, Build as BuildIcon, Receipt as ReceiptIcon, LocalShipping as ShippingIcon, AccountBalance as LedgerIcon, LocalShipping, AccountBalance } from "@mui/icons-material";
import ClientAdministration from "./dashboard/clientAdministration/ClientAdministration";
import UserAdministration from "./dashboard/userAdministration/UserAdministration";
import Calculator from "./dashboard/calculator/Calculator";
import CalculatorMob from "./dashboard/calculator/CalculatorMob";
import QuotationAdministration from "./dashboard/quotation/QuotationAdministration";
import ShippingTracker from "./dashboard/shipping/ShippingTracker";
import LedgerTracker from "./dashboard/ledger/LedgerTracker";
import SimpleChatBox from "./SimpleChatBox";
import Material from "./dashboard/material/Material";
import AnalyticsDashboard from "./dashboard/AnalyticsDashboard";

const DynamicDashboard = () => {
  const userDetails = useSelector((state) => state.user.userDetails || {});
  const { dashboardTabs, user } = useSelector(
    (state) => state.user.userDetails || {}
  );
  const isMobile = useSelector((state) => state.user.isMobile);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeComponent, setActiveComponent] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  // Get the current page from URL or localStorage
  const getCurrentPage = useCallback(() => {
    const path = location.pathname;
    if (path === "/dashboard" || path === "/dashboard/") return "dashboard";
    if (path?.includes("/dashboard/calculator")) return "calculator";
    if (path?.includes("/dashboard/material")) return "material";
    if (path?.includes("/dashboard/quotation")) return "quotation";
    if (path?.includes("/dashboard/client")) return "client";
    if (path?.includes("/dashboard/admin")) return "admin";
    if (path?.includes("/dashboard/agent")) return "agent";
    if (path?.includes("/dashboard/shipping")) return "shipping";
    if (path?.includes("/dashboard/ledger")) return "ledger";
    if (path?.includes("/dashboard/chat")) return "chat";

    // Fallback to localStorage
    const savedPage = localStorage.getItem("dashboard_current_page");
    return savedPage || null;
  }, [location.pathname]);

  // Set current page in localStorage
  const setCurrentPage = (page) => {
    localStorage.setItem("dashboard_current_page", page);
  };

  // Initialize active component based on URL or saved state
  useEffect(() => {
    const currentPage = getCurrentPage();
    if (currentPage) {
      setActiveComponent(currentPage);
      // Update URL if needed
      if (currentPage === "dashboard") {
        navigate(`/dashboard`, { replace: true });
      } else if (!location.pathname?.includes(`/dashboard/${currentPage}`)) {
        navigate(`/dashboard/${currentPage}`, { replace: true });
      }
    }
  }, [getCurrentPage, location.pathname, navigate]);

  const handleComponentChange = (component) => {
    setActiveComponent(component);
    setCurrentPage(component);
    if (component === "dashboard") {
      navigate(`/dashboard`, { replace: true });
    } else {
      navigate(`/dashboard/${component}`, { replace: true });
    }
    if (isMobile) {
      setPanelOpen(false);
    }
  };

  const renderSidebarButtons = () => {
    const buttons = [];

    if (dashboardTabs?.includes("analytics")) {
      buttons.push(
        <button
          key="dashboard"
          onClick={() => handleComponentChange("dashboard")}
          className={`px-4 py-3 mb-4 rounded-lg w-full text-left font-medium transition-all duration-200 ${
            activeComponent === "dashboard"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          <div className="flex items-center">
            <AnalyticsIcon className="mr-2" />
            Analytics
          </div>
        </button>
      );
    }

    // Add Chat button
    if (dashboardTabs?.includes("chat")) {
      buttons.push(
        <button
          key="chat"
          onClick={() => handleComponentChange("chat")}
          className={`px-4 py-3 mb-4 rounded-lg w-full text-left font-medium transition-all duration-200 ${
            activeComponent === "chat"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          <div className="flex items-center">
            <ChatIcon className="mr-2" />
            Team Chat
          </div>
        </button>
      );
    }

    if (dashboardTabs?.includes("administration")) {
      buttons.push(
        <button
          key="admin"
          onClick={() => handleComponentChange("admin")}
          className={`px-4 py-3 mb-4 rounded-lg w-full text-left font-medium transition-all duration-200 ${
            activeComponent === "admin"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          <div className="flex items-center">
            <AdminIcon className="mr-2" />
            {user} Administration
          </div>
        </button>
      );
    }

    if (dashboardTabs?.includes("agent_administration")) {
      buttons.push(
        <button
          key="agent"
          onClick={() => handleComponentChange("agent")}
          className={`px-4 py-3 mb-4 rounded-lg w-full text-left font-medium transition-all duration-200 ${
            activeComponent === "agent"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          <div className="flex items-center">
            <PersonIcon className="mr-2" />
            {user} Administration
          </div>
        </button>
      );
    }

    if (dashboardTabs?.includes("client_administration")) {
      buttons.push(
        <button
          key="client"
          onClick={() => handleComponentChange("client")}
          className={`px-4 py-3 mb-4 rounded-lg w-full text-left font-medium transition-all duration-200 ${
            activeComponent === "client"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          <div className="flex items-center">
            <PersonIcon className="mr-2" />
            Client Administration
          </div>
        </button>
      );
    }

    if (dashboardTabs?.includes("calculator")) {
      buttons.push(
        <button
          key="calculator"
          onClick={() => handleComponentChange("calculator")}
          className={`px-4 py-3 mb-4 rounded-lg w-full text-left font-medium transition-all duration-200 ${
            activeComponent === "calculator"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          <CalculateIcon className="mr-2" />
          Calculator
        </button>
      );
    }

    if (dashboardTabs?.includes("material")) {
      buttons.push(
        <button
          key="material"
          onClick={() => handleComponentChange("material")}
          className={`px-4 py-3 mb-4 rounded-lg w-full text-left font-medium transition-all duration-200 ${
            activeComponent === "material"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          <BuildIcon className="mr-2" />
          Material
        </button>
      );
    }

    if (dashboardTabs?.includes("quotation")) {
      buttons.push(
        <button
          key="quotation"
          onClick={() => handleComponentChange("quotation")}
          className={`px-4 py-3 mb-4 rounded-lg w-full text-left font-medium transition-all duration-200 ${
            activeComponent === "quotation"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          <ReceiptIcon className="mr-2" />
          Quotation
        </button>
      );
    }

    // Add Shipping button
    if (dashboardTabs?.includes("shipping")) {
      buttons.push(
        <button
          key="shipping"
          onClick={() => handleComponentChange("shipping")}
          className={`px-4 py-3 mb-4 rounded-lg w-full text-left font-medium transition-all duration-200 ${
            activeComponent === "shipping"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          <ShippingIcon className="mr-2" />
          Shipping Tracker
        </button>
      );
    }

    // Add Ledger button
    if (dashboardTabs?.includes("ledger")) {
      buttons.push(
        <button
          key="ledger"
          onClick={() => handleComponentChange("ledger")}
          className={`px-4 py-3 mb-4 rounded-lg w-full text-left font-medium transition-all duration-200 ${
            activeComponent === "ledger"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          <LedgerIcon className="mr-2" />
          Ledger Tracker
        </button>
      );
    }

    return buttons;
  };

  const renderSidebarButtonsMobile = () => {
    const buttons = [];

    if (dashboardTabs?.includes("analytics")) {
      buttons.push(
        <button
          key="dashboard"
          onClick={() => handleComponentChange("dashboard")}
          className={`px-3 py-2 mb-3 rounded-md w-full text-left font-medium transition-all duration-200 text-sm ${
            activeComponent === "dashboard"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          <AnalyticsIcon className="mr-2" />
          Analytics
        </button>
      );
    }

    // Add Chat button
    if (dashboardTabs?.includes("chat")) {
      buttons.push(
        <button
          key="chat"
          onClick={() => handleComponentChange("chat")}
          className={`px-3 py-2 mb-3 rounded-md w-full text-left font-medium transition-all duration-200 text-sm ${
            activeComponent === "chat"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          <ChatIcon className="mr-2" />
          Team Chat
        </button>
      );
    }

    if (dashboardTabs?.includes("administration")) {
      buttons.push(
        <button
          key="admin"
          onClick={() => handleComponentChange("admin")}
          className={`px-3 py-2 mb-3 rounded-md w-full text-left font-medium transition-all duration-200 text-sm ${
            activeComponent === "admin"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          <AdminIcon className="mr-2" />
          {user} Administration
        </button>
      );
    }

    if (dashboardTabs?.includes("agent_administration")) {
      buttons.push(
        <button
          key="agent"
          onClick={() => handleComponentChange("agent")}
          className={`px-3 py-2 mb-3 rounded-md w-full text-left font-medium transition-all duration-200 text-sm ${
            activeComponent === "agent"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          <PersonIcon className="mr-2" />
          {user} Administration
        </button>
      );
    }

    if (dashboardTabs?.includes("client_administration")) {
      buttons.push(
        <button
          key="client"
          onClick={() => handleComponentChange("client")}
          className={`px-3 py-2 mb-3 rounded-md w-full text-left font-medium transition-all duration-200 text-sm ${
            activeComponent === "client"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          <PersonIcon className="mr-2" />
          Client Administration
        </button>
      );
    }

    if (dashboardTabs?.includes("calculator")) {
      buttons.push(
        <button
          key="calculator"
          onClick={() => handleComponentChange("calculator")}
          className={`px-3 py-2 mb-3 rounded-md w-full text-left font-medium transition-all duration-200 text-sm ${
            activeComponent === "calculator"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          <CalculateIcon className="mr-2" />
          Calculator
        </button>
      );
    }

    if (dashboardTabs?.includes("material")) {
      buttons.push(
        <button
          key="material"
          onClick={() => handleComponentChange("material")}
          className={`px-3 py-2 mb-3 rounded-md w-full text-left font-medium transition-all duration-200 text-sm ${
            activeComponent === "material"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          <BuildIcon className="mr-2" />
          Material
        </button>
      );
    }

    if (dashboardTabs?.includes("quotation")) {
      buttons.push(
        <button
          key="quotation"
          onClick={() => handleComponentChange("quotation")}
          className={`px-3 py-2 mb-3 rounded-md w-full text-left font-medium transition-all duration-200 text-sm ${
            activeComponent === "quotation"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          <ReceiptIcon className="mr-2" />
          Quotation
        </button>
      );
    }

    // Add Shipping button
    if (dashboardTabs?.includes("shipping")) {
      buttons.push(
        <button
          key="shipping"
          onClick={() => handleComponentChange("shipping")}
          className={`px-3 py-2 mb-3 rounded-md w-full text-left font-medium transition-all duration-200 text-sm ${
            activeComponent === "shipping"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          <ShippingIcon className="mr-2" />
          Shipping Tracker
        </button>
      );
    }

    // Add Ledger button
    if (dashboardTabs?.includes("ledger")) {
      buttons.push(
        <button
          key="ledger"
          onClick={() => handleComponentChange("ledger")}
          className={`px-3 py-2 mb-3 rounded-md w-full text-left font-medium transition-all duration-200 text-sm ${
            activeComponent === "ledger"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
          }`}
        >
          <AccountBalance className="mr-2" />
          Ledger Tracker
        </button>
      );
    }

    return buttons;
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "chat":
        return (
          <SimpleChatBox
            currentUser={{
              id: userDetails.id || 1,
              username: userDetails.username || user || "user",
              name: userDetails.name || userDetails.username || user || "User",
              role: userDetails.role || "USER",
            }}
          />
        );
      case "material":
        return <Material />;
      case "dashboard":
        return <AnalyticsDashboard />;
      case "agent":
        return <UserAdministration />;
      case "admin":
        return <UserAdministration />;
      case "client":
        return <ClientAdministration />;
      case "calculator":
        return (isMobile ? <CalculatorMob /> : <Calculator />);
      case "quotation":
        return <QuotationAdministration />;
      case "shipping":
        return <ShippingTracker />;
      case "ledger":
        return <LedgerTracker />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  if (!isMobile) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex">
        <div className="w-72 bg-white text-gray-900 p-6 shadow-lg border-r border-gray-200">
          <div className="flex items-center gap-4 mb-8 pt-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            </div>
          </div>
          {renderSidebarButtons()}
        </div>

        <div className="flex-1 p-6 bg-gray-50 h-full overflow-hidden">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 h-full flex flex-col">
            {renderActiveComponent()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="bg-gray-50 h-full overflow-hidden">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
          {renderActiveComponent()}
        </div>
      </div>

      {/* Floating button */}
      <button
        onClick={() => setPanelOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
      >
        <MenuIcon />
      </button>

      {/* Mobile panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 w-full h-80 bg-white !shadow-xl !rounded-t-lg transition-transform duration-300 ${
          panelOpen ? 'translate-y-0' : 'translate-y-full'
        } z-50 p-6`}
      >
        <button
          onClick={() => setPanelOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <CloseIcon />
        </button>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h3>
        <div className="overflow-y-auto max-h-[calc(100%-3rem)] pr-2 pl-2 pb-4">
          {renderSidebarButtonsMobile()}
        </div>
      </div>
    </div>
  );
};

export default DynamicDashboard;
