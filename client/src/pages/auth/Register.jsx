// import React, { useState } from "react";
// import {
//   User,
//   Mail,
//   Lock,
//   Phone,
//   Truck,
//   Shield,
//   UserCircle,
// } from "lucide-react";

// const Register = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//     role: "user",
//   });
//   const [message, setMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     // Simulate API call
//     setTimeout(() => {
//       setMessage("OTP sent! Verify to complete registration.");
//       setIsLoading(false);
//       // In real app: navigate("/auth/verify-otp");
//     }, 2000);
//   };

//   const handleLoginClick = () => {
//     // In real app: navigate("/auth/login");
//     console.log("Navigate to login");
//   };

//   const getRoleIcon = (role) => {
//     switch (role) {
//       case "user":
//         return <UserCircle className="w-5 h-5" />;
//       case "driver":
//         return <Truck className="w-5 h-5" />;
//       case "admin":
//         return <Shield className="w-5 h-5" />;
//       default:
//         return <UserCircle className="w-5 h-5" />;
//     }
//   };

//   const getRoleColor = (role) => {
//     switch (role) {
//       case "user":
//         return "from-blue-500 to-purple-600";
//       case "driver":
//         return "from-green-500 to-teal-600";
//       case "admin":
//         return "from-red-500 to-pink-600";
//       default:
//         return "from-blue-500 to-purple-600";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
//       {/* Background decoration */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
//       </div>

//       <div className="relative w-full max-w-md">
//         {/* Logo/Brand Section */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl mb-4 border border-white/20">
//             <Truck className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold text-white mb-2">DeliverEase</h1>
//           <p className="text-white/80">Join our delivery network today</p>
//         </div>

//         {/* Main Form Card */}
//         <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
//           <h2 className="text-2xl font-bold text-white mb-6 text-center">
//             Create Account
//           </h2>

//           <div className="space-y-6">
//             {/* Name Input */}
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <User className="h-5 w-5 text-white/60" />
//               </div>
//               <input
//                 name="name"
//                 type="text"
//                 placeholder="Full Name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
//               />
//             </div>

//             {/* Email Input */}
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <Mail className="h-5 w-5 text-white/60" />
//               </div>
//               <input
//                 name="email"
//                 type="email"
//                 placeholder="Email Address"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
//               />
//             </div>

//             {/* Password Input */}
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <Lock className="h-5 w-5 text-white/60" />
//               </div>
//               <input
//                 name="password"
//                 type="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
//               />
//             </div>

//             {/* Phone Input */}
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <Phone className="h-5 w-5 text-white/60" />
//               </div>
//               <input
//                 name="phone"
//                 type="tel"
//                 placeholder="Phone Number"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 required
//                 className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
//               />
//             </div>

//             {/* Role Selection */}
//             <div className="space-y-3">
//               <label className="text-white/80 text-sm font-medium">
//                 Choose Your Role
//               </label>
//               <div className="grid grid-cols-3 gap-3">
//                 {["user", "driver", "admin"].map((role) => (
//                   <label key={role} className="relative cursor-pointer">
//                     <input
//                       type="radio"
//                       name="role"
//                       value={role}
//                       checked={formData.role === role}
//                       onChange={handleChange}
//                       className="sr-only"
//                     />
//                     <div
//                       className={`
//                         flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300
//                         ${
//                           formData.role === role
//                             ? `bg-gradient-to-r ${getRoleColor(
//                                 role
//                               )} border-white/40 shadow-lg scale-105`
//                             : "bg-white/10 border-white/20 hover:border-white/40"
//                         }
//                       `}
//                     >
//                       {getRoleIcon(role)}
//                       <span className="text-white text-sm font-medium mt-2 capitalize">
//                         {role}
//                       </span>
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div
//               onClick={handleSubmit}
//               className={`
//                 w-full py-4 rounded-2xl font-semibold text-white transition-all duration-300 transform cursor-pointer text-center
//                 ${
//                   isLoading
//                     ? "bg-white/20 cursor-not-allowed"
//                     : `bg-gradient-to-r ${getRoleColor(
//                         formData.role
//                       )} hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`
//                 }
//               `}
//             >
//               {isLoading ? (
//                 <div className="flex items-center justify-center space-x-2">
//                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                   <span>Creating Account...</span>
//                 </div>
//               ) : (
//                 "Create Account"
//               )}
//             </div>
//           </div>

//           {/* Message Display */}
//           {message && (
//             <div className="mt-6 p-4 bg-green-500/20 border border-green-400/30 rounded-2xl backdrop-blur-sm">
//               <p className="text-green-200 text-center text-sm">{message}</p>
//             </div>
//           )}

//           {/* Login Link */}
//           <div className="mt-8 text-center">
//             <p className="text-white/80 text-sm">
//               Already have an account?{" "}
//               <button
//                 onClick={handleLoginClick}
//                 className="text-purple-300 hover:text-white font-medium transition-colors duration-300 hover:underline"
//               >
//                 Sign In
//               </button>
//             </p>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-8">
//           <p className="text-white/60 text-xs">
//             By creating an account, you agree to our Terms of Service and
//             Privacy Policy
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;
import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Phone,
  Truck,
  Shield,
  UserCircle,
  CheckCircle,
  Navigation,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { registerUser } from "../../api/authApi"; // Adjust path as needed

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRole, setExpandedRole] = useState(null);

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
    setExpandedRole(null);
  };

  const getRoleDetails = (role) => {
    switch (role) {
      case "customer":
        return {
          title: "Customer",
          subtitle: "Book rides & deliveries",
          features: [
            "Book instant rides",
            "Schedule deliveries",
            "Track in real-time",
            "Multiple payment options",
          ],
          color: "blue",
        };
      case "driver":
        return {
          title: "Driver Partner",
          subtitle: "Drive & earn with PICK4U",
          features: [
            "Flexible working hours",
            "Competitive earnings",
            "Weekly payouts",
            "24/7 support",
          ],
          color: "green",
        };
      case "admin":
        return {
          title: "Administrator",
          subtitle: "Manage platform operations",
          features: [
            "Manage users & drivers",
            "Analytics dashboard",
            "System controls",
            "Revenue management",
          ],
          color: "red",
        };
      default:
        return {
          title: "Customer",
          subtitle: "Book rides & deliveries",
          features: [
            "Book instant rides",
            "Schedule deliveries",
            "Track in real-time",
            "Multiple payment options",
          ],
          color: "blue",
        };
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone
    ) {
      setMessage("❌ Please fill all required fields");
      setIsLoading(false);
      return;
    }

    try {
      // Actual API call using axios
      const response = await registerUser(formData);

      if (response.data.success) {
        setMessage("✅ Account created successfully! Welcome to PICK4U.");

        // Reset form after successful registration
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          role: "customer",
        });

        // Optional: Redirect to OTP verification or login page
        console.log("Registration response:", response.data);
      } else {
        setMessage(`❌ ${response.data.message || "Registration failed"}`);
      }
    } catch (error) {
      console.error("Registration error:", error);

      // Better error handling
      if (error.response) {
        // Server responded with error status
        setMessage(
          `❌ ${error.response.data.message || "Registration failed"}`
        );
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

  const handleLoginClick = () => {
    console.log("Navigate to login");
    // Add your navigation logic here
    // Example: navigate('/login');
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "user":
        return <UserCircle className="w-6 h-6" />;
      case "driver":
        return <Truck className="w-6 h-6" />;
      case "admin":
        return <Shield className="w-6 h-6" />;
      default:
        return <UserCircle className="w-6 h-6" />;
    }
  };

  const getRoleGradient = (role) => {
    switch (role) {
      case "user":
        return "from-blue-600 via-blue-700 to-blue-800";
      case "driver":
        return "from-green-600 via-emerald-700 to-teal-800";
      case "admin":
        return "from-red-600 via-red-700 to-red-800";
      default:
        return "from-blue-600 via-blue-700 to-blue-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-600/15 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-600/10 rounded-full filter blur-3xl"></div>

        {/* Geometric Pattern */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-blue-600/20 transform rotate-45"></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 bg-blue-500/15 transform rotate-12"></div>
        <div className="absolute top-1/3 left-10 w-12 h-12 bg-indigo-600/20 transform -rotate-12"></div>
      </div>

      <div className="relative w-full max-w-lg z-10">
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
            <span className="text-gray-900">PICK</span>
            <span className="text-blue-600">4U</span>
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Join our transportation network
          </p>
          <div className="flex items-center justify-center mt-4 space-x-3">
            <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
            <div className="w-4 h-1 bg-blue-400 rounded-full"></div>
            <div className="w-2 h-1 bg-blue-300 rounded-full"></div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-2xl">
          <div className="flex items-center justify-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Create Your Account
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                />
              </div>
            </div>

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
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                />
              </div>
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
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-all duration-300 hover:border-gray-300"
                />
              </div>
            </div>

            {/* Role Selection Main Accordion */}
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <div
                  onClick={() => setExpandedRole(expandedRole ? null : "roles")}
                  className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all duration-300"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mr-3">
                      <UserCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        Choose Your Role
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formData.role === "user"
                          ? "Customer Selected"
                          : formData.role === "driver"
                          ? "Driver Selected"
                          : "Admin Selected"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle
                      className={`w-5 h-5 ${
                        formData.role === "user"
                          ? "text-blue-600"
                          : formData.role === "driver"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    />
                    {expandedRole ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                <div
                  className={`transition-all duration-300 ease-in-out ${
                    expandedRole
                      ? "max-h-screen opacity-100"
                      : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  <div className="p-4 bg-white border-t border-gray-100">
                    <div className="space-y-3">
                      {["customer", "driver", "admin"].map((role) => {
                        const roleDetails = getRoleDetails(role);
                        const isSelected = formData.role === role;

                        return (
                          <div
                            key={role}
                            onClick={() => handleRoleSelect(role)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                              isSelected
                                ? `${
                                    role === "user"
                                      ? "bg-blue-50 border-blue-600 ring-2 ring-blue-600/20"
                                      : role === "driver"
                                      ? "bg-green-50 border-green-600 ring-2 ring-green-600/20"
                                      : "bg-red-50 border-red-600 ring-2 ring-red-600/20"
                                  } shadow-lg`
                                : "bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                            }`}
                          >
                            <div className="flex items-center">
                              <div className="flex-shrink-0 mr-4">
                                <div
                                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                    isSelected
                                      ? `${
                                          role === "user"
                                            ? "bg-blue-600 text-white"
                                            : role === "driver"
                                            ? "bg-green-600 text-white"
                                            : "bg-red-600 text-white"
                                        }`
                                      : "bg-gray-200 text-gray-600"
                                  }`}
                                >
                                  {getRoleIcon(role)}
                                </div>
                              </div>
                              <div className="flex-1">
                                <h4
                                  className={`font-bold text-lg mb-1 ${
                                    isSelected
                                      ? `${
                                          role === "user"
                                            ? "text-blue-900"
                                            : role === "driver"
                                            ? "text-green-900"
                                            : "text-red-900"
                                        }`
                                      : "text-gray-900"
                                  }`}
                                >
                                  {roleDetails.title}
                                </h4>
                                <p
                                  className={`text-sm mb-2 ${
                                    isSelected
                                      ? `${
                                          role === "user"
                                            ? "text-blue-600"
                                            : role === "driver"
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }`
                                      : "text-gray-600"
                                  }`}
                                >
                                  {roleDetails.subtitle}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {roleDetails.features
                                    .slice(0, 2)
                                    .map((feature, index) => (
                                      <span
                                        key={index}
                                        className={`text-xs px-2 py-1 rounded-full ${
                                          isSelected
                                            ? `${
                                                role === "user"
                                                  ? "bg-blue-100 text-blue-700"
                                                  : role === "driver"
                                                  ? "bg-green-100 text-green-700"
                                                  : "bg-red-100 text-red-700"
                                              }`
                                            : "bg-gray-100 text-gray-600"
                                        }`}
                                      >
                                        {feature}
                                      </span>
                                    ))}
                                </div>
                              </div>
                              {isSelected && (
                                <CheckCircle
                                  className={`w-6 h-6 ml-2 ${
                                    role === "user"
                                      ? "text-blue-600"
                                      : role === "driver"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 transform relative overflow-hidden group ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : `bg-gradient-to-r ${getRoleGradient(
                      formData.role
                    )} hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] shadow-lg`
              }`}
            >
              {!isLoading && (
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
              )}
              <div className="relative flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating Your Account...</span>
                  </>
                ) : (
                  <>
                    <span>Join PICK4U</span>
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
                message.includes("✅") || message.includes("successfully")
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center space-x-2">
                {message.includes("✅") || message.includes("successfully") ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <div className="w-5 h-5 border-2 border-red-600 rounded-full flex items-center justify-center">
                    <div className="w-1 h-3 bg-red-600 rounded-full"></div>
                  </div>
                )}
                <p className="text-sm font-medium">
                  {message.replace("✅", "").replace("❌", "")}
                </p>
              </div>
            </div>
          )}

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <button
                onClick={handleLoginClick}
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-300 hover:underline underline-offset-4 decoration-2 decoration-blue-600/50"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-xs leading-relaxed max-w-sm mx-auto">
            By creating an account, you agree to PICK4U's{" "}
            <span className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors duration-300 font-medium">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors duration-300 font-medium">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
