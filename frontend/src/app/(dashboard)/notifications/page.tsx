"use client";

import { useState } from "react";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("All");

  const [notifications] = useState([
    { id: 1, text: "Laptop AF-0094 assigned to Priya Shah", time: "2m ago", type: "all" },
    { id: 2, text: "Maintenance request AF-0935 approved", time: "18m ago", type: "approvals" },
    { id: 3, text: "Booking confirmed: Room 22 | 2:00 to 3:00 PM", time: "1h ago", type: "bookings" },
    { id: 4, text: "Transfer approved: AF-0032 to Facilities dept", time: "3h ago", type: "approvals" },
    { id: 5, text: "Overdue return: AF-0021 was due 3 days ago", time: "1d ago", type: "alerts" },
    { id: 6, text: "audit discrepancy flagged: AF-0088 damaged", time: "2d ago", type: "alerts" },
  ]);

  const tabs = ["All", "Alerts", "Approvals", "Bookings"];

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "All") return true;
    return notif.type === activeTab.toLowerCase();
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Filters bar matching Screen 10 */}
      <div className="flex flex-wrap gap-2 border-b-2 border-black pb-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 border-2 border-black font-mono text-xs font-bold rounded-sm shadow-[2px_2px_0_#111110] active:translate-y-0.5 active:shadow-[1px_1px_0_#111110] transition-all uppercase ${
                isActive ? "bg-black text-white" : "bg-paper hover:bg-yellow text-black"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="bg-white border-3 border-black rounded shadow-[6px_6px_0_#111110] divide-y-2 divide-black">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className="p-5 flex justify-between items-center hover:bg-paper/30 font-mono text-sm"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 rounded-full border border-black ${
                    notif.type === "alerts" ? "bg-red-500 animate-pulse" :
                    notif.type === "approvals" ? "bg-green-500" :
                    notif.type === "bookings" ? "bg-blue-500" : "bg-yellow"
                  }`}
                />
                <span className="font-sans font-semibold text-black">{notif.text}</span>
              </div>
              <span className="text-xs text-gray font-bold whitespace-nowrap ml-4">{notif.time}</span>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray font-mono text-sm">
            No notifications in this category.
          </div>
        )}
      </div>
    </div>
  );
}
