"use client";

import { useState } from "react";

export default function AuditsPage() {
  const [items, setItems] = useState([
    { asset: "AF-003 Dell laptop", location: "Desk #12", status: "Verified" },
    { asset: "AF-4921 Office chair", location: "Desk #14", status: "Missing" },
    { asset: "AF-9332 Monitor", location: "Desk #18", status: "Damaged" },
  ]);

  const updateStatus = (index: number, newStatus: string) => {
    const newItems = [...items];
    newItems[index].status = newStatus;
    setItems(newItems);
  };

  const discrepanciesCount = items.filter((item) => item.status === "Missing" || item.status === "Damaged").length;

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Audit Banner */}
      <div className="bg-black text-white p-6 border-3 border-black rounded shadow-[4px_4px_0_#111110]">
        <h2 className="font-mono text-base font-black uppercase text-yellow">
          Q3 audit: engineering dept - 1-15 jul
        </h2>
        <p className="text-xs text-gray mt-2 font-mono">
          Auditors: A. Rao, S. Iqbal
        </p>
      </div>

      {/* Audit Checklist Table */}
      <div className="bg-white border-3 border-black rounded shadow-[6px_6px_0_#111110] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black text-white text-xs font-mono uppercase border-b-3 border-black">
              <th className="p-4">Asset</th>
              <th className="p-4">Expected Location</th>
              <th className="p-4 text-right">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {items.map((item, i) => (
              <tr key={i} className="text-sm font-semibold hover:bg-paper/30">
                <td className="p-4 font-mono text-xs">{item.asset}</td>
                <td className="p-4 text-gray text-xs font-mono">{item.location}</td>
                <td className="p-4 text-right">
                  <div className="inline-flex gap-2">
                    {["Verified", "Missing", "Damaged"].map((status) => {
                      const isSelected = item.status === status;
                      return (
                        <button
                          key={status}
                          onClick={() => updateStatus(i, status)}
                          className={`px-3 py-1 border-2 border-black rounded-sm text-xs font-bold font-mono transition-all ${
                            isSelected
                              ? status === "Verified" ? "bg-green-300 text-black shadow-[1px_1px_0_#111110]" :
                                status === "Missing" ? "bg-red-300 text-black shadow-[1px_1px_0_#111110]" :
                                "bg-amber-300 text-black shadow-[1px_1px_0_#111110]"
                              : "bg-paper text-zinc-500 hover:bg-yellow hover:text-black"
                          }`}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Discrepancies Info Banner */}
      {discrepanciesCount > 0 && (
        <div className="bg-[#FF6B6B] p-4 border-3 border-black rounded font-bold font-mono text-sm shadow-[4px_4px_0_#111110]">
          ⚠️ {discrepanciesCount} assets flagged - discrepancy report generated automatically
        </div>
      )}

      {/* Action button */}
      <div>
        <button className="btn3d bg-black text-white border-3 border-black py-3 px-6 font-mono font-black uppercase shadow-[4px_4px_0_#ffd400] active:shadow-[1px_1px_0_#111110]">
          Close Audit Cycle
        </button>
      </div>
    </div>
  );
}
