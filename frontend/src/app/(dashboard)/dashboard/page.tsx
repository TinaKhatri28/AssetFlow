"use client";

import { useState } from "react";

export default function DashboardPage() {
  const [stats] = useState([
    { label: "Total Registered Assets", count: "1,284", icon: "📦" },
    { label: "Currently Allocated", count: "962", icon: "🤝" },
    { label: "Under Maintenance", count: "7", icon: "🔧" },
    { label: "Active Room/Asset Bookings", count: "23", icon: "📅" },
  ]);

  const [activities] = useState([
    { id: "ACT-109", assetCode: "AF-0231", user: "J. Mehta", action: "Allocation Approved", time: "14 mins ago", status: "success" },
    { id: "ACT-108", assetCode: "AF-0087", user: "S. Patel", action: "Flagged for maintenance (Screen Crack)", time: "1 hour ago", status: "warning" },
    { id: "ACT-107", assetCode: "AF-0119", user: "D. Rao", action: "Transfer Approved", time: "3 hours ago", status: "success" },
    { id: "ACT-106", assetCode: "AF-0452", user: "M. Kumar", action: "Returned Asset", time: "5 hours ago", status: "info" },
    { id: "ACT-105", assetCode: "AF-0012", user: "A. Shah", action: "Audit verified", time: "1 day ago", status: "success" },
  ]);

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Banner */}
      <div className="bg-black text-white p-8 border-3 border-black rounded shadow-[6px_6px_0_#ffd400] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-mono text-2xl font-black uppercase tracking-tight">Welcome to the Command Center</h2>
          <p className="text-zinc-300 text-sm mt-2 font-mono">Role: Administrator (Dev Environment)</p>
        </div>
        <div className="bg-yellow text-black text-xs font-bold font-mono px-3 py-1.5 rounded uppercase border-2 border-black">
          Global Seed Active
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 border-3 border-black rounded shadow-[4px_4px_0_#111110] flex items-center justify-between hover:-translate-y-1 transition-transform duration-150">
            <div>
              <span className="text-xs font-bold text-gray uppercase font-mono tracking-wider">{stat.label}</span>
              <h3 className="text-3xl font-black font-mono mt-2">{stat.count}</h3>
            </div>
            <div className="text-3xl p-3 bg-paper border-2 border-black rounded shadow-[2px_2px_0_#111110]">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="bg-white p-6 border-3 border-black rounded shadow-[6px_6px_0_#111110] lg:col-span-2">
          <div className="flex justify-between items-center pb-4 border-b-2 border-black mb-6">
            <h3 className="font-mono text-lg font-black uppercase">Recent Activity Log</h3>
            <span className="text-xs font-mono text-gray font-bold">Updated Live</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-black text-xs font-mono text-gray uppercase">
                  <th className="pb-3">Asset ID</th>
                  <th className="pb-3">User</th>
                  <th className="pb-3">Action</th>
                  <th className="pb-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {activities.map((act) => (
                  <tr key={act.id} className="text-sm font-medium hover:bg-paper/40 transition-colors">
                    <td className="py-3.5">
                      <span className="font-mono text-yellow font-black bg-black px-2 py-1 rounded inline-block text-xs border border-black shadow-[1px_1px_0_#111110]">
                        {act.assetCode}
                      </span>
                    </td>
                    <td className="py-3.5">{act.user}</td>
                    <td className="py-3.5">
                      <span className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${
                          act.status === "success" ? "bg-green-500" :
                          act.status === "warning" ? "bg-amber-500" : "bg-blue-500"
                        }`} />
                        {act.action}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-mono text-gray text-xs">{act.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Operations panel */}
        <div className="bg-white p-6 border-3 border-black rounded shadow-[6px_6px_0_#111110] flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b-2 border-black mb-6">
              <h3 className="font-mono text-lg font-black uppercase">Quick Operations</h3>
            </div>
            <div className="space-y-3">
              {[
                { name: "Register New Asset", icon: "➕" },
                { name: "Initiate Audit Cycle", icon: "🔍" },
                { name: "Create Asset Booking", icon: "📅" },
                { name: "Log Maintenance Case", icon: "🔧" },
                { name: "Generate Audit Report", icon: "📋" },
              ].map((op, i) => (
                <button
                  key={i}
                  className="w-full text-left font-bold text-sm px-4 py-3 bg-paper border-2 border-black rounded shadow-[3px_3px_0_#111110] hover:bg-yellow hover:text-black hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#111110] transition-all flex items-center gap-3"
                >
                  <span>{op.icon}</span>
                  <span>{op.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-200 text-xs text-gray font-mono">
            System status: <span className="text-green-600 font-bold">100% operational</span><br />
            Database version: <span className="font-bold">v1.2.0-mocked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
