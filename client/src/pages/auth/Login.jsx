import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Navigation,
  UserCircle,
  Truck,
  Shield,
} from "lucide-react";
import { loginUser } from "../../api/authApi"; // Adjust path as needed

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage?.getItem?.("token");
    const role = localStorage?.getItem?.("role");
    if (token && role) {
      console.log(`User already logged in as ${role}`);
      setMessage(`✅ Already logged in as ${role}. Redirecting...`);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setMessage("❌ Please fill all required fields");
      setIsLoading(false);
      return;
    }

    try {
      // Actual API call using axios
      const response = await loginUser(formData);

      if (response.data.success) {
        setMessage("✅ Login successful! Redirecting...");

        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role || "user");
        localStorage.setItem("user", JSON.stringify(user));

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("savedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("savedEmail");
        }

        // Redirect after delay
        setTimeout(() => {
          navigate("/"); // ✅ home page redirect
        }, 1500);
      } else {
        setMessage(`❌ ${response.data.message || "Login failed"}`);
      }
    } catch (error) {
      console.error("Login error:", error);

      // Better error handling
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data.message || "Login failed";
        setMessage(`❌ ${errorMessage}`);
      } else if (error.request) {
        // Network error
        setMessage("❌ Network error. Please check your connection.");
      } else {
        // Other errors
        setMessage("❌ Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    console.log("Navigate to register");
    // Add your navigation logic here
    // Example: navigate('/register');
  };

  const handleForgotPassword = () => {
    console.log("Navigate to forgot password");
    // Add your navigation logic here
    // Example: navigate('/forgot-password');
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "user":
        return <UserCircle className="w-5 h-5" />;
      case "driver":
        return <Truck className="w-5 h-5" />;
      case "admin":
        return <Shield className="w-5 h-5" />;
      default:
        return <UserCircle className="w-5 h-5" />;
    }
  };

  // Pre-fill email if remember me was checked
  useEffect(() => {
    if (localStorage?.getItem?.("rememberMe") === "true") {
      const savedEmail = localStorage?.getItem?.("savedEmail");
      if (savedEmail) {
        setFormData((prev) => ({ ...prev, email: savedEmail }));
        setRememberMe(true);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-600/15 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-600/10 rounded-full filter blur-3xl animate-pulse delay-500"></div>

        {/* Geometric Pattern */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-blue-600/20 transform rotate-45 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 bg-blue-500/15 transform rotate-12 animate-bounce delay-300"></div>
        <div className="absolute top-1/3 left-10 w-12 h-12 bg-indigo-600/20 transform -rotate-12 animate-bounce delay-700"></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Header with PICK4U Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl mb-6 shadow-2xl border border-gray-200">
            <div className="relative">
              <div className="text-4xl font-black">
                <span className="text-black">PICK</span>
                <span className="text-blue-600 relative">
                  4U
                  <div className="absolute -top-1 -right-2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-10 border-b-blue-600 transform rotate-90"></div>
                </span>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-black mb-3">
            <span className="text-gray-900">Welcome Back to </span>
            <span className="text-blue-600">PICK4U</span>
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Sign in to your account
          </p>
        </div>

        {/* Main Login Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-2xl">
          <div className="flex items-center justify-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="group">
              <label className="text-gray-700 text-sm font-semibold mb-2 block">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="text-gray-700 text-sm font-semibold mb-2 block">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors duration-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    rememberMe
                      ? "bg-blue-600 border-blue-600"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {rememberMe && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 transform relative overflow-hidden group ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              }`}
            >
              {!isLoading && (
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
              )}
              <div className="relative flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to PICK4U</span>
                    <Navigation className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Success/Error Message */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-2xl border ${
                message.includes("✅") ||
                message.includes("successful") ||
                message.includes("Already logged in")
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center space-x-2">
                {message.includes("✅") ||
                message.includes("successful") ||
                message.includes("Already logged in") ? (
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

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <button
                onClick={handleRegisterClick}
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-300 hover:underline underline-offset-4 decoration-2 decoration-blue-600/50"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>

        {/* Quick Access Info */}
        <div className="mt-8">
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/40">
            <h3 className="text-center text-gray-800 font-semibold mb-4">
              Quick Access by Role
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {["user", "driver", "admin"].map((role) => (
                <div key={role} className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    {getRoleIcon(role)}
                  </div>
                  <p className="text-xs text-gray-600 font-medium capitalize">
                    {role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-xs leading-relaxed max-w-sm mx-auto">
            Secure login protected by PICK4U's advanced security measures
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
