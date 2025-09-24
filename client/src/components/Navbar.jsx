import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Package,
  MapPin,
  DollarSign,
  Phone,
  LogOut,
  User,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Settings,
  HelpCircle,
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // 👈 yaha store karenge
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setIsProfileMenuOpen(false);
    navigate("/auth/login");
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const navItems = [
    {
      name: "Book Delivery",
      path: "/customer/book",
      icon: <Package className="w-4 h-4" />,
    },
    {
      name: "Track Order",
      path: "/customer/track",
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      name: "Pricing",
      path: "/pricing",
      icon: <DollarSign className="w-4 h-4" />,
    },
    { name: "Contact", path: "/contact", icon: <Phone className="w-4 h-4" /> },
  ];

  const getRoleBadge = (role) => {
    switch (role) {
      case "driver":
        return { label: "Driver", color: "bg-green-100 text-green-800" };
      case "admin":
        return { label: "Admin", color: "bg-red-100 text-red-800" };
      default:
        return { label: "Customer", color: "bg-blue-100 text-blue-800" };
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => handleNavigate("/")}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="text-3xl font-black">
              <span className="text-black">PICK</span>
              <span className="text-blue-600 relative">
                4U
                <div className="absolute -top-1 -right-2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-b-8 border-b-blue-600 transform rotate-90"></div>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden lg:flex relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Track your order..."
                className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 w-64"
              />
            </div>

            {isLoggedIn && user ? (
              <>
                {/* Notifications */}
                {/* <div className="relative">
                  <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300">
                    <Bell className="w-5 h-5" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {notifications}
                      </span>
                    )}
                  </button>
                </div> */}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div
                        className={`text-xs ${
                          getRoleBadge(user.role).color
                        } px-2 py-1 rounded-full inline-block`}
                      >
                        {getRoleBadge(user.role).label}
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        isProfileMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                        <div
                          className={`text-xs ${
                            getRoleBadge(user.role).color
                          } px-2 py-1 rounded-full inline-block mt-1`}
                        >
                          {getRoleBadge(user.role).label}
                        </div>
                      </div>

                      <button
                        onClick={() => handleNavigate("/customer/profile")}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          My Profile
                        </span>
                      </button>

                      <button
                        onClick={() => handleNavigate("/customer/orders")}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50"
                      >
                        <Package className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">My Orders</span>
                      </button>

                      <button
                        onClick={() => handleNavigate("/settings")}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50"
                      >
                        <Settings className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Settings</span>
                      </button>

                      <button
                        onClick={() => handleNavigate("/help")}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50"
                      >
                        <HelpCircle className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          Help & Support
                        </span>
                      </button>

                      <div className="border-t border-gray-100 mt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 text-red-600"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/auth/register"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all"
              >
                Login/Signup
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        isLoggedIn={isLoggedIn}
        user={user}
        navItems={navItems}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </nav>
  );
}

// ✅ MobileMenu Updated
function MobileMenu({
  isOpen,
  isLoggedIn,
  user,
  navItems,
  onNavigate,
  onLogout,
  onClose,
}) {
  const getRoleBadge = (role) => {
    switch (role) {
      case "driver":
        return { label: "Driver", color: "bg-green-100 text-green-800" };
      case "admin":
        return { label: "Admin", color: "bg-red-100 text-red-800" };
      default:
        return { label: "Customer", color: "bg-blue-100 text-blue-800" };
    }
  };

  return (
    <div
      className={`md:hidden transition-all ${
        isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      } overflow-hidden bg-white border-t`}
    >
      <div className="px-4 py-6 space-y-4">
        {/* Search on Mobile */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Track your order..."
            className="w-full pl-10 pr-4 py-3 bg-gray-100 border rounded-xl focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {isLoggedIn && user && (
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {user.name}
                </div>
                <div className="text-xs text-gray-500">{user.email}</div>
                <div
                  className={`text-xs ${
                    getRoleBadge(user.role).color
                  } px-2 py-1 rounded-full inline-block`}
                >
                  {getRoleBadge(user.role).label}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav Items */}
        <div className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={onClose}
              className="w-full flex items-center space-x-3 p-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </div>

        {isLoggedIn ? (
          <div className="pt-4 border-t">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="pt-4 border-t">
            <Link
              to="/auth/register"
              onClick={onClose}
              className="block w-full p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-center hover:shadow-lg"
            >
              Login/Signup
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
