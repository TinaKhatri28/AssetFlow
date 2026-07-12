"use client";

import { useState, useEffect } from "react";

export default function ReportsPage() {
  const [deptUtil, setDeptUtil] = useState<{ department: string; count: number }[]>([]);
  const [maintFreq, setMaintFreq] = useState<{ month: string; count: number }[]>([]);
  const [mostUsed, setMostUsed] = useState<{ name: string; count: string }[]>([]);
  const [idle, setIdle] = useState<{ name: string; info: string }[]>([]);
  const [dueMaintenance, setDueMaintenance] = useState<{ name: string; status: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:8000/api/v1/reports/utilization-by-dept").then(res => res.json()),
      fetch("http://127.0.0.1:8000/api/v1/reports/maintenance-frequency").then(res => res.json()),
      fetch("http://127.0.0.1:8000/api/v1/reports/most-used").then(res => res.json()),
      fetch("http://127.0.0.1:8000/api/v1/reports/idle").then(res => res.json()),
      fetch("http://127.0.0.1:8000/api/v1/reports/due-maintenance").then(res => res.json()),
    ]).then(([util, freq, used, idleAssets, due]) => {
      setDeptUtil(util || []);
      setMaintFreq(freq || []);
      setMostUsed(used || []);
      setIdle(idleAssets || []);
      setDueMaintenance(due || []);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to load reports", err);
      setLoading(false);
    });
  }, []);

  // Calculate max values for chart scaling
  const maxDeptCount = Math.max(...deptUtil.map(d => d.count), 1);
  const maxMaintCount = Math.max(...maintFreq.map(m => m.count), 1);

  // Generate SVG points for the line chart (100x100 canvas)
  // X axis: distribute evenly
  // Y axis: invert and scale to maxMaintCount (0 = 90, max = 10)
  const linePoints = maintFreq.map((m, idx) => {
    const x = maintFreq.length > 1 ? (idx / (maintFreq.length - 1)) * 100 : 50;
    const y = 90 - ((m.count / maxMaintCount) * 80); // scale between 90 and 10
    return { x, y };
  });
  const polylinePoints = linePoints.map(p => `${p.x},${p.y}`).join(" ");

  if (loading) {
    return <div className="p-8 font-mono font-bold animate-pulse">LOADING LIVE DATA...</div>;
  }

  return (
    <div className="space-y-8 font-sans w-full">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Utilization Bar Chart */}
        <div className="bg-white p-6 border-3 border-black rounded shadow-[6px_6px_0_#111110]">
          <div className="pb-4 border-b-2 border-black mb-6">
            <h3 className="font-mono text-base font-black uppercase">Utilization by department</h3>
          </div>
          <div className="h-48 flex items-end gap-6 border-b-2 border-black pb-2 px-4 justify-between font-mono text-xs">
            {deptUtil.length > 0 ? deptUtil.map((dept, i) => {
              // Scale height relative to max, max height is 160px (40 units approx)
              const heightPct = (dept.count / maxDeptCount) * 100;
              return (
                <div key={i} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                  <span className="font-bold text-[10px]">{dept.count}</span>
                  <div 
                    className="bg-yellow w-full rounded-t-sm border-2 border-black shadow-[2px_2px_0_#111110]" 
                    style={{ height: `${Math.max(heightPct, 5)}%` }} 
                  />
                  <span className="truncate w-full text-center" title={dept.department}>{dept.department}</span>
                </div>
              );
            }) : <div className="w-full text-center text-gray-400 pb-10">No allocation data</div>}
          </div>
        </div>

        {/* Maintenance Frequency Line Chart */}
        <div className="bg-white p-6 border-3 border-black rounded shadow-[6px_6px_0_#111110]">
          <div className="pb-4 border-b-2 border-black mb-6">
            <h3 className="font-mono text-base font-black uppercase">Maintenance Frequency</h3>
          </div>
          <div className="h-48 border-b-2 border-black flex items-center justify-center p-2 relative">
            {maintFreq.length > 0 ? (
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="black"
                  strokeWidth="3"
                  points={polylinePoints}
                />
                {linePoints.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="3" fill="#FFD400" stroke="black" strokeWidth="1.5" />
                ))}
              </svg>
            ) : <div className="text-gray-400">No maintenance data</div>}
          </div>
          <div className="flex justify-between font-mono text-[10px] text-gray mt-2 font-bold px-2">
            {maintFreq.map((m, i) => (
              <span key={i}>{m.month}</span>
            ))}
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
            {mostUsed.length > 0 ? mostUsed.map((item, i) => (
              <li key={i} className="flex justify-between bg-paper p-2.5 border border-black rounded shadow-[1.5px_1.5px_0_#111110]">
                <span className="font-bold">{item.name}</span>
                <span className="text-gray">{item.count}</span>
              </li>
            )) : <li className="text-gray-400 italic p-2">No usage data found</li>}
          </ul>
        </div>

        {/* Idle Assets */}
        <div className="bg-white p-6 border-3 border-black rounded shadow-[4px_4px_0_#111110]">
          <div className="pb-3 border-b border-black mb-4">
            <h4 className="font-mono text-sm font-black uppercase">Idle assets</h4>
          </div>
          <ul className="space-y-3 font-mono text-xs">
            {idle.length > 0 ? idle.map((item, i) => (
              <li key={i} className="flex justify-between bg-paper p-2.5 border border-black rounded shadow-[1.5px_1.5px_0_#111110]">
                <span className="font-bold">{item.name}</span>
                <span className="text-red-500 font-bold">{item.info}</span>
              </li>
            )) : <li className="text-gray-400 italic p-2">No idle assets found</li>}
          </ul>
        </div>
      </div>

      {/* Due Maintenance and Retirement List */}
      <div className="bg-white p-6 border-3 border-black rounded shadow-[4px_4px_0_#111110] space-y-4">
        <div className="pb-3 border-b border-black">
          <h4 className="font-mono text-sm font-black uppercase">Assets due for maintenance / nearing retirement</h4>
        </div>
        <ul className="space-y-3 font-mono text-xs">
          {dueMaintenance.length > 0 ? dueMaintenance.map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="text-red-500 font-bold">●</span>
              <div>
                <span className="font-bold text-black">{item.name}</span>
                <span className="text-gray mx-2">·</span>
                <span className="text-gray font-bold">{item.status}</span>
              </div>
            </li>
          )) : <li className="text-gray-400 italic">All assets are in perfect condition!</li>}
        </ul>
      </div>

      {/* Export Action */}
      <div>
        <button 
          className="btn3d bg-black text-white border-3 border-black py-3 px-6 font-mono font-black uppercase shadow-[4px_4px_0_#ffd400] active:shadow-[1px_1px_0_#111110]"
          onClick={() => alert("Report downloaded successfully!")}
        >
          Export Report
        </button>
      </div>
    </div>
  );
}
