import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../api/userApi";
import {
  User,
  Mail,
  Phone,
  Edit3,
  Save,
  CheckCircle,
  AlertCircle,
  Camera,
  MapPin,
  Calendar,
  Shield,
  Star,
  Truck,
  Package,
  Clock,
  Eye,
  Settings,
  Bell,
  Lock,
} from "lucide-react";

export default function Profile() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setForm({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
        });
      } catch (err) {
        setMessage(
          `❌ ${err.response?.data?.message || "Error fetching profile"}`
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const res = await updateProfile(form);
      setMessage(`✅ ${res.data.message || "Profile updated successfully!"}`);
      setIsEditing(false);
    } catch (err) {
      setMessage(
        `❌ ${err.response?.data?.message || "Error updating profile"}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setMessage("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "text-green-600 bg-green-50 border-green-200";
      case "In Transit":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "Pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const tabs = [
    {
      id: "profile",
      label: "Profile Info",
      icon: <User className="w-4 h-4" />,
    },
    {
      id: "orders",
      label: "Order History",
      icon: <Package className="w-4 h-4" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-600/15 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-600/10 rounded-full filter blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl mb-4 shadow-2xl border border-gray-200">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-black mb-2">
            <span className="text-gray-900">My </span>
            <span className="text-blue-600">Profile</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-2xl mb-8">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center">
                <span className="text-4xl font-black text-white">
                  {form.name ? form.name.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors duration-300">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-black text-gray-900 mb-2">
                {form.name || "Loading..."}
              </h2>
              <p className="text-gray-600 mb-4">{form.email || "Loading..."}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800">Member since 2024</span>
                </div>
                <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-600 fill-current" />
                  <span className="text-yellow-800">5.0 Rating</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-blue-600 mb-1">0</div>
                <div className="text-xs text-blue-800 font-medium">
                  Total Orders
                </div>
              </div>
              <div className="bg-green-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-green-600 mb-1">0</div>
                <div className="text-xs text-green-800 font-medium">Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-2 border border-white/40 mb-8">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-white text-blue-600 shadow-lg"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === "profile" && (
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Profile Information
                  </h3>
                  <button
                    onClick={handleEditToggle}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      isEditing
                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
                  </button>
                </div>

                {message && (
                  <div
                    className={`mb-6 p-4 rounded-2xl border ${
                      message.includes("✅")
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {message.includes("✅") ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <p className="text-sm font-medium">
                        {message.replace("✅", "").replace("❌", "")}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Name Field */}
                  <div className="group">
                    <label className="text-gray-700 text-sm font-semibold mb-2 block">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                      </div>
                      <input
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        required
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl text-gray-900 placeholder-gray-500 transition-all duration-300 ${
                          isEditing
                            ? "bg-white border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 hover:border-gray-300"
                            : "bg-gray-50 border-gray-200 cursor-not-allowed"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="group">
                    <label className="text-gray-700 text-sm font-semibold mb-2 block">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        readOnly
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Phone Field */}
                  <div className="group">
                    <label className="text-gray-700 text-sm font-semibold mb-2 block">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                      </div>
                      <input
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={form.phone}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        required
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl text-gray-900 placeholder-gray-500 transition-all duration-300 ${
                          isEditing
                            ? "bg-white border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 hover:border-gray-300"
                            : "bg-gray-50 border-gray-200 cursor-not-allowed"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  {isEditing && (
                    <button
                      onClick={handleSubmit}
                      disabled={isSaving}
                      className={`w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 transform relative overflow-hidden group ${
                        isSaving
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                      }`}
                    >
                      {!isSaving && (
                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                      )}
                      <div className="relative flex items-center justify-center space-x-2">
                        {isSaving ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Saving Changes...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-2xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Order History
                </h3>
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-gray-600 mb-2">
                    No Orders Yet
                  </h4>
                  <p className="text-gray-500 mb-6">
                    You haven't placed any orders yet. Start by booking your
                    first delivery!
                  </p>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700 transition-colors duration-300">
                    Book Your First Delivery
                  </button>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-2xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Account Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors duration-300">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-gray-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Notifications
                        </h4>
                        <p className="text-sm text-gray-600">
                          Manage your notification preferences
                        </p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Configure
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors duration-300">
                    <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-gray-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Security</h4>
                        <p className="text-sm text-gray-600">
                          Change password and security settings
                        </p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Manage
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors duration-300">
                    <div className="flex items-center space-x-3">
                      <Eye className="w-5 h-5 text-gray-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Privacy</h4>
                        <p className="text-sm text-gray-600">
                          Control your data and privacy
                        </p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Review
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-gray-200 shadow-2xl">
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h4>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-colors duration-300">
                  <Package className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">
                    Book Delivery
                  </span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-2xl transition-colors duration-300">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">
                    Track Order
                  </span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-2xl transition-colors duration-300">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-800 font-medium">
                    Saved Addresses
                  </span>
                </button>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-gray-200 shadow-2xl">
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                Account Status
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Account Type</span>
                  <span className="font-medium text-gray-900">Premium</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Verification</span>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-600">Verified</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Loyalty Points</span>
                  <span className="font-medium text-gray-900">1,250</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
