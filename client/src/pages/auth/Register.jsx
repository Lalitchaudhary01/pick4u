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
} from "lucide-react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      ); // Update port if different
      setMessage(response.data.message);
      // Optional: redirect to login after success
      // navigate("/auth/login");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Something went wrong. Try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    console.log("Navigate to login");
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

  const getRoleColor = (role) => {
    switch (role) {
      case "user":
        return "from-blue-500 to-purple-600";
      case "driver":
        return "from-green-500 to-teal-600";
      case "admin":
        return "from-red-500 to-pink-600";
      default:
        return "from-blue-500 to-purple-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl mb-4 border border-white/20">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">DeliverEase</h1>
          <p className="text-white/80">Join our delivery network today</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Create Account
          </h2>
          <div className="space-y-6">
            {/* Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-white/60" />
              </div>
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-white/60" />
              </div>
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-white/60" />
              </div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-white/60" />
              </div>
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            {/* Role */}
            <div className="space-y-3">
              <label className="text-white/80 text-sm font-medium">
                Choose Your Role
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["user", "driver", "admin"].map((role) => (
                  <label key={role} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={formData.role === role}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div
                      className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                        formData.role === role
                          ? `bg-gradient-to-r ${getRoleColor(
                              role
                            )} border-white/40 shadow-lg scale-105`
                          : "bg-white/10 border-white/20 hover:border-white/40"
                      }`}
                    >
                      {getRoleIcon(role)}
                      <span className="text-white text-sm font-medium mt-2 capitalize">
                        {role}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div
              onClick={handleSubmit}
              className={`w-full py-4 rounded-2xl font-semibold text-white transition-all duration-300 transform cursor-pointer text-center ${
                isLoading
                  ? "bg-white/20 cursor-not-allowed"
                  : `bg-gradient-to-r ${getRoleColor(
                      formData.role
                    )} hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className="mt-6 p-4 bg-green-500/20 border border-green-400/30 rounded-2xl backdrop-blur-sm">
              <p className="text-green-200 text-center text-sm">{message}</p>
            </div>
          )}

          {/* Login */}
          <div className="mt-8 text-center">
            <p className="text-white/80 text-sm">
              Already have an account?{" "}
              <button
                onClick={handleLoginClick}
                className="text-purple-300 hover:text-white font-medium transition-colors duration-300 hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-white/60 text-xs">
            By creating an account, you agree to our Terms of Service and
            Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
