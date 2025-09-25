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
import { loginUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // check already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      setMessage(`✅ Already logged in as ${role}. Redirecting...`);
      setTimeout(() => {
        handleRoleRedirect(role);
      }, 1200);
    }
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (!formData.email || !formData.password) {
      setMessage("❌ Please fill all required fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginUser(formData);

      if (response.data.success) {
        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role || "customer");
        localStorage.setItem("user", JSON.stringify(user));

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("savedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("savedEmail");
        }

        setMessage("✅ Login successful! Redirecting...");

        setTimeout(() => {
          handleRoleRedirect(user.role);
        }, 1200);
      } else {
        setMessage(`❌ ${response.data.message || "Login failed"}`);
      }
    } catch (error) {
      if (error.response) {
        setMessage(`❌ ${error.response.data.message || "Login failed"}`);
      } else if (error.request) {
        setMessage("❌ Network error. Please check your connection.");
      } else {
        setMessage("❌ Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleRedirect = (role) => {
    switch (role) {
      case "customer":
        navigate("/");
        break;
      case "driver":
        navigate("/driver/dashboard");
        break;
      case "admin":
        navigate("/admin/dashboard");
        break;
      default:
        navigate("/");
    }
  };

  const handleRegisterClick = () => navigate("/register");
  const handleForgotPassword = () => navigate("/forgot-password");

  const getRoleIcon = (role) => {
    switch (role) {
      case "customer":
        return <UserCircle className="w-5 h-5" />;
      case "driver":
        return <Truck className="w-5 h-5" />;
      case "admin":
        return <Shield className="w-5 h-5" />;
      default:
        return <UserCircle className="w-5 h-5" />;
    }
  };

  useEffect(() => {
    if (localStorage.getItem("rememberMe") === "true") {
      const savedEmail = localStorage.getItem("savedEmail");
      if (savedEmail) {
        setFormData((prev) => ({ ...prev, email: savedEmail }));
        setRememberMe(true);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="relative w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-blue-600">PICK4U</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="text-sm font-semibold">Email</label>
              <input
                name="email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-xl mt-1"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-xl mt-1"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-sm">Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-800"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {message && (
            <div
              className={`mt-6 p-3 rounded-xl ${
                message.includes("✅")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p>
              Don't have an account?{" "}
              <button
                onClick={handleRegisterClick}
                className="text-blue-600 font-semibold"
              >
                Create Account
              </button>
            </p>
          </div>

          {/* Quick Access Info */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            {["customer", "driver", "admin"].map((role) => (
              <div key={role}>
                <div className="w-12 h-12 mx-auto bg-blue-100 rounded-xl flex items-center justify-center mb-2">
                  {getRoleIcon(role)}
                </div>
                <p className="text-xs font-medium capitalize">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
