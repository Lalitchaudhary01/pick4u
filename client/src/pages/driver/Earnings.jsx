import React, { useEffect, useState } from "react";
import { getEarnings } from "../../api";

export default function Earnings() {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dummy earnings data
  const dummyEarnings = {
    total: 45680,
    today: 1250,
    thisWeek: 8950,
    thisMonth: 32450,
    lastMonth: 28900,
    completedToday: 8,
    completedWeek: 42,
    completedMonth: 178,
    avgPerDelivery: 257,
    dailyBreakdown: [
      { date: "Mon", amount: 1200, deliveries: 6 },
      { date: "Tue", amount: 1450, deliveries: 7 },
      { date: "Wed", amount: 980, deliveries: 5 },
      { date: "Thu", amount: 1650, deliveries: 8 },
      { date: "Fri", amount: 1820, deliveries: 9 },
      { date: "Sat", amount: 1600, deliveries: 7 },
      { date: "Today", amount: 1250, deliveries: 8 },
    ],
    recentPayouts: [
      { date: "2024-10-01", amount: 28900, status: "completed" },
      { date: "2024-09-01", amount: 31200, status: "completed" },
      { date: "2024-08-01", amount: 27650, status: "completed" },
    ],
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const res = await getEarnings();
      setEarnings(res.data);
    } catch (err) {
      console.log("Using dummy data:", err);
      setEarnings(dummyEarnings);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="w-12 h-12 animate-spin mx-auto mb-4 text-[#0500FF]"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <p className="text-gray-500 font-medium">Loading earnings...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Earnings",
      value: `₹${earnings?.total?.toLocaleString() || 0}`,
      icon: "💰",
      color: "bg-[#0500FF]",
      textColor: "text-[#0500FF]",
      change: "+12%",
    },
    {
      label: "This Month",
      value: `₹${earnings?.thisMonth?.toLocaleString() || 0}`,
      icon: "📅",
      color: "bg-[#0D3483]",
      textColor: "text-[#0D3483]",
      change: "+8%",
    },
    {
      label: "This Week",
      value: `₹${earnings?.thisWeek?.toLocaleString() || 0}`,
      icon: "📊",
      color: "bg-[#FFD426]",
      textColor: "text-[#FFD426]",
      change: "+15%",
    },
    {
      label: "Today",
      value: `₹${earnings?.today?.toLocaleString() || 0}`,
      icon: "💵",
      color: "bg-[#16C9FF]",
      textColor: "text-[#16C9FF]",
      change: `${earnings?.completedToday || 0} orders`,
    },
  ];

  return (
    <div
      className="min-h-screen bg-gray-50 p-6"
      style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#000000] to-[#0500FF] rounded-2xl p-8 mb-6 text-white shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">💰 My Earnings</h1>
              <p className="text-gray-200">
                Track your income and performance metrics
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-sm text-gray-300">Avg per Delivery</p>
              <p className="text-3xl font-bold">
                ₹{earnings?.avgPerDelivery || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`text-4xl p-3 rounded-lg ${stat.color} bg-opacity-10`}
                >
                  {stat.icon}
                </div>
                <span className="text-sm font-semibold text-green-600">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">
                {stat.label}
              </h3>
              <p className={`text-3xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Breakdown */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Weekly Breakdown
            </h2>
            <div className="space-y-3">
              {earnings?.dailyBreakdown?.map((day, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-20 text-sm font-semibold text-gray-600">
                    {day.date}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#0500FF] to-[#16C9FF] h-full rounded-full transition-all"
                          style={{ width: `${(day.amount / 2000) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-[#0500FF] w-20 text-right">
                        ₹{day.amount}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {day.deliveries} deliveries
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Performance Summary
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Deliveries</p>
                  <p className="text-2xl font-bold text-[#0500FF]">
                    {earnings?.completedMonth || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">This month</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Success Rate</p>
                  <p className="text-2xl font-bold text-[#0D3483]">98.5%</p>
                  <p className="text-xs text-gray-500 mt-1">
                    On-time deliveries
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-[#0500FF] to-[#16C9FF] rounded-xl p-6 text-white shadow-md">
              <h3 className="text-lg font-bold mb-4">This Week</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm opacity-90 mb-1">Earnings</p>
                  <p className="text-3xl font-bold">
                    ₹{earnings?.thisWeek?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="flex justify-between pt-4 border-t border-white border-opacity-20">
                  <div>
                    <p className="text-xs opacity-90">Deliveries</p>
                    <p className="text-xl font-bold">
                      {earnings?.completedWeek || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs opacity-90">Avg/Day</p>
                    <p className="text-xl font-bold">
                      ₹{Math.round((earnings?.thisWeek || 0) / 7)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Payouts */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Recent Payouts
              </h3>
              <div className="space-y-3">
                {earnings?.recentPayouts?.map((payout, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {new Date(payout.date).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-gray-500">Monthly payout</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#0D3483]">
                        ₹{payout.amount.toLocaleString()}
                      </p>
                      <span className="text-xs text-green-600 font-semibold">
                        ✓ Paid
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Withdraw CTA */}
            <div className="bg-gradient-to-br from-[#FFD426] to-[#FF6B35] rounded-xl p-6 text-white shadow-md">
              <h3 className="text-lg font-bold mb-2">💳 Withdraw Earnings</h3>
              <p className="text-sm mb-4 opacity-90">
                Transfer your earnings to your bank account
              </p>
              <button className="w-full bg-white text-[#FF6B35] font-semibold px-4 py-3 rounded-lg hover:bg-gray-100 transition-all">
                Withdraw Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
