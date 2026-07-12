"use client";

import { useState } from "react";

export default function ReportsPage() {
  const [mostUsed] = useState([
    { name: "Room 22", count: "34 bookings this month" },
    { name: "Van AF-993", count: "21 trips this month" },
    { name: "Projector AF-335", count: "18 uses" },
  ]);

  const [idle] = useState([
    { name: "Camera AF-0101", info: "unused 60+ days" },
    { name: "chair AF-0470", info: "unused 48 days" },
  ]);

  const [dueMaintenance] = useState([
    { name: "Forklift AF-0087", status: "service due in 5 days" },
    { name: "Laptop AF-0020", status: "4 years old - nearing retirement" },
  ]);

  return (
    <div className="space-y-8 font-sans w-full">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Utilization Bar Chart */}
        <div className="bg-white p-6 border-3 border-black rounded shadow-[6px_6px_0_#111110]">
          <div className="pb-4 border-b-2 border-black mb-6">
            <h3 className="font-mono text-base font-black uppercase">Utilization by department</h3>
          </div>
          {/* Mock Bar Chart using CSS */}
          <div className="h-48 flex items-end gap-6 border-b-2 border-black pb-2 px-4 justify-between font-mono text-xs">
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="bg-yellow w-full rounded-t-sm border-2 border-black h-36 shadow-[2px_2px_0_#111110]" />
              <span>Eng</span>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="bg-yellow w-full rounded-t-sm border-2 border-black h-24 shadow-[2px_2px_0_#111110]" />
              <span>HR</span>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="bg-yellow w-full rounded-t-sm border-2 border-black h-40 shadow-[2px_2px_0_#111110]" />
              <span>Sales</span>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="bg-yellow w-full rounded-t-sm border-2 border-black h-16 shadow-[2px_2px_0_#111110]" />
              <span>Ops</span>
            </div>
          </div>
        </div>

        {/* Maintenance Frequency Line Chart */}
        <div className="bg-white p-6 border-3 border-black rounded shadow-[6px_6px_0_#111110]">
          <div className="pb-4 border-b-2 border-black mb-6">
            <h3 className="font-mono text-base font-black uppercase">Maintenance Frequency</h3>
          </div>
          {/* Mock Line Chart using SVG */}
          <div className="h-48 border-b-2 border-black flex items-center justify-center p-2">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="black"
                strokeWidth="3"
                points="0,80 20,40 40,60 60,20 80,45 100,10"
              />
              <circle cx="20" cy="40" r="3" fill="#FFD400" stroke="black" strokeWidth="1.5" />
              <circle cx="40" cy="60" r="3" fill="#FFD400" stroke="black" strokeWidth="1.5" />
              <circle cx="60" cy="20" r="3" fill="#FFD400" stroke="black" strokeWidth="1.5" />
              <circle cx="80" cy="45" r="3" fill="#FFD400" stroke="black" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="flex justify-between font-mono text-[10px] text-gray mt-2 font-bold px-2">
            <span>JAN</span>
            <span>MAR</span>
            <span>MAY</span>
            <span>JUL</span>
          </div>
        </div>
      </div>

      {/* Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Used Assets */}
        <div className="bg-white p-6 border-3 border-black rounded shadow-[4px_4px_0_#111110]">
          <div className="pb-3 border-b border-black mb-4">
            <h4 className="font-mono text-sm font-black uppercase">Most used assets</h4>
          </div>
          <ul className="space-y-3 font-mono text-xs">
            {mostUsed.map((item, i) => (
              <li key={i} className="flex justify-between bg-paper p-2.5 border border-black rounded shadow-[1.5px_1.5px_0_#111110]">
                <span className="font-bold">{item.name}</span>
                <span className="text-gray">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Idle Assets */}
        <div className="bg-white p-6 border-3 border-black rounded shadow-[4px_4px_0_#111110]">
          <div className="pb-3 border-b border-black mb-4">
            <h4 className="font-mono text-sm font-black uppercase">Idle assets</h4>
          </div>
          <ul className="space-y-3 font-mono text-xs">
            {idle.map((item, i) => (
              <li key={i} className="flex justify-between bg-paper p-2.5 border border-black rounded shadow-[1.5px_1.5px_0_#111110]">
                <span className="font-bold">{item.name}</span>
                <span className="text-red-500 font-bold">{item.info}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Due Maintenance and Retirement List */}
      <div className="bg-white p-6 border-3 border-black rounded shadow-[4px_4px_0_#111110] space-y-4">
        <div className="pb-3 border-b border-black">
          <h4 className="font-mono text-sm font-black uppercase">Assets due for maintenance / nearing retirement</h4>
        </div>
        <ul className="space-y-3 font-mono text-xs">
          {dueMaintenance.map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="text-red-500 font-bold">●</span>
              <div>
                <span className="font-bold text-black">{item.name}</span>
                <span className="text-gray mx-2">·</span>
                <span className="text-gray font-bold">{item.status}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Export Action */}
      <div>
        <button className="btn3d bg-black text-white border-3 border-black py-3 px-6 font-mono font-black uppercase shadow-[4px_4px_0_#ffd400] active:shadow-[1px_1px_0_#111110]">
          Export Report
        </button>
      </div>
    </div>
  );
}
