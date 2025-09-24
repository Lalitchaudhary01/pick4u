import React, { useState } from "react";
import {
  Truck,
  MapPin,
  Clock,
  Shield,
  Star,
  ArrowRight,
  Package,
  Navigation,
  CheckCircle,
  Zap,
  CreditCard,
  Users,
  Phone,
  Mail,
  Play,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function Home() {
  const [activeFeature, setActiveFeature] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const features = [
    {
      id: "instant",
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Delivery",
      desc: "Get deliveries in under 60 minutes in your city",
      details: [
        "Same-hour delivery",
        "Priority handling",
        "Express routing",
        "Real-time updates",
      ],
      color: "blue",
    },
    {
      id: "tracking",
      icon: <MapPin className="w-8 h-8" />,
      title: "Live Tracking",
      desc: "Track your driver live on the map with GPS precision",
      details: [
        "Real-time GPS tracking",
        "Driver details",
        "ETA updates",
        "Route optimization",
      ],
      color: "green",
    },
    {
      id: "payments",
      icon: <CreditCard className="w-8 h-8" />,
      title: "Secure Payments",
      desc: "Multiple payment options & cash on delivery available",
      details: [
        "Digital wallets",
        "Credit/Debit cards",
        "Cash on delivery",
        "Secure transactions",
      ],
      color: "purple",
    },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Business Owner",
      rating: 5,
      text: "PICK4U has revolutionized my business deliveries. Fast, reliable, and professional service every time!",
    },
    {
      name: "Priya Sharma",
      role: "Regular Customer",
      rating: 5,
      text: "The live tracking feature is amazing. I always know exactly where my package is. Highly recommended!",
    },
    {
      name: "Amit Singh",
      role: "Driver Partner",
      rating: 5,
      text: "Great platform to earn extra income. Flexible hours and good support from the PICK4U team.",
    },
  ];

  const stats = [
    {
      number: "10K+",
      label: "Happy Customers",
      icon: <Users className="w-6 h-6" />,
    },
    {
      number: "5K+",
      label: "Deliveries Done",
      icon: <Package className="w-6 h-6" />,
    },
    {
      number: "500+",
      label: "Driver Partners",
      icon: <Truck className="w-6 h-6" />,
    },
    {
      number: "30min",
      label: "Avg Delivery Time",
      icon: <Clock className="w-6 h-6" />,
    },
  ];

  const handleBookDelivery = () => {
    console.log("Navigate to book delivery");
  };

  const handleSeePricing = () => {
    console.log("Navigate to pricing");
  };

  const handleJoinDriver = () => {
    console.log("Navigate to driver registration");
  };

  const handleWatchDemo = () => {
    console.log("Play demo video");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      {/* <nav className="relative z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="text-3xl font-black">
                <span className="text-black">PICK</span>
                <span className="text-blue-600 relative">
                  4U
                  <div className="absolute -top-1 -right-2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-b-8 border-b-blue-600 transform rotate-90"></div>
                </span>
              </div>
            </div>
            <div className="hidden md:flex space-x-6">
              <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Services
              </button>
              <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Pricing
              </button>
              <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                About
              </button>
              <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Contact
              </button>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Sign In
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-medium">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav> */}

      {/* Hero Section */}
      <header className="relative py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-600/15 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-600/10 rounded-full filter blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <Truck className="w-4 h-4 mr-2" />
              India's Fastest Growing Delivery Platform
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="text-gray-900">Fast. Reliable.</span>
            <br />
            <span className="text-blue-600">Local Deliveries.</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Book same-hour, same-day or standard deliveries with real-time
            tracking, trusted drivers, and unbeatable service across India.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button
              onClick={handleBookDelivery}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Package className="w-5 h-5" />
              <span>Book Delivery Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleWatchDemo}
              className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-2xl font-bold hover:border-blue-600 hover:text-blue-600 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/40 hover:bg-white/80 transition-all duration-300"
              >
                <div className="text-blue-600 mb-2 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-black text-gray-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Why Choose <span className="text-blue-600">PICK4U</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of delivery services with our cutting-edge
              technology and dedicated support.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                isActive={activeFeature === feature.id}
                onToggle={() =>
                  setActiveFeature(
                    activeFeature === feature.id ? null : feature.id
                  )
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              What Our <span className="text-blue-600">Community</span> Says
            </h2>
            <p className="text-xl text-gray-600">
              Real feedback from real customers and partners
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                {Array.from(
                  { length: testimonials[activeTestimonial].rating },
                  (_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6 text-yellow-400 fill-current"
                    />
                  )
                )}
              </div>
              <blockquote className="text-xl text-gray-700 italic mb-6">
                "{testimonials[activeTestimonial].text}"
              </blockquote>
              <div className="font-bold text-gray-900">
                {testimonials[activeTestimonial].name}
              </div>
              <div className="text-sm text-gray-600">
                {testimonials[activeTestimonial].role}
              </div>
            </div>

            <div className="flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers or become a driver partner and
            start earning today.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleBookDelivery}
              className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Package className="w-5 h-5" />
              <span>Book Your First Delivery</span>
            </button>
            <button
              onClick={handleJoinDriver}
              className="px-8 py-4 bg-blue-800 text-white rounded-2xl font-bold hover:bg-blue-900 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Truck className="w-5 h-5" />
              <span>Become a Driver Partner</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-3xl font-black mb-4">
                <span className="text-white">PICK</span>
                <span className="text-blue-400 relative">
                  4U
                  <div className="absolute -top-1 -right-2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-b-8 border-b-blue-400 transform rotate-90"></div>
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                India's most trusted delivery platform connecting customers with
                reliable drivers.
              </p>
              <div className="flex space-x-4">
                <Phone className="w-5 h-5 text-blue-400" />
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <div className="space-y-2 text-gray-400">
                <div>Same Hour Delivery</div>
                <div>Same Day Delivery</div>
                <div>Standard Delivery</div>
                <div>Bulk Orders</div>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <div className="space-y-2 text-gray-400">
                <div>About Us</div>
                <div>Careers</div>
                <div>Press</div>
                <div>Contact</div>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <div className="space-y-2 text-gray-400">
                <div>Help Center</div>
                <div>Safety</div>
                <div>Terms of Service</div>
                <div>Privacy Policy</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 PICK4U. All rights reserved. Made in India with ❤️
            </p>
          </div>
        </div>
      </footer> */}
    </div>
  );
}

function FeatureCard({ feature, isActive, onToggle }) {
  const getColorClasses = (color) => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: "text-blue-600",
          title: "text-blue-900",
          button: "bg-blue-600 hover:bg-blue-700",
        };
      case "green":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          icon: "text-green-600",
          title: "text-green-900",
          button: "bg-green-600 hover:bg-green-700",
        };
      case "purple":
        return {
          bg: "bg-purple-50",
          border: "border-purple-200",
          icon: "text-purple-600",
          title: "text-purple-900",
          button: "bg-purple-600 hover:bg-purple-700",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          icon: "text-gray-600",
          title: "text-gray-900",
          button: "bg-gray-600 hover:bg-gray-700",
        };
    }
  };

  const colors = getColorClasses(feature.color);

  return (
    <div
      className={`bg-white rounded-3xl p-8 border-2 hover:shadow-2xl transition-all duration-300 ${
        isActive ? colors.border + " ring-4 ring-opacity-20" : "border-gray-200"
      }`}
    >
      <div
        className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mb-6`}
      >
        <div className={colors.icon}>{feature.icon}</div>
      </div>

      <h3 className={`text-2xl font-bold mb-3 ${colors.title}`}>
        {feature.title}
      </h3>
      <p className="text-gray-600 mb-6">{feature.desc}</p>

      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="font-medium text-gray-700">Learn More</span>
        {isActive ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isActive ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="space-y-3">
          {feature.details.map((detail, index) => (
            <div key={index} className="flex items-center space-x-3">
              <CheckCircle className={`w-4 h-4 ${colors.icon}`} />
              <span className="text-sm text-gray-600">{detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
