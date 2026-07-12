"use client";

import { useState } from "react";

export default function AllocationsPage() {
  const [selectedAsset, setSelectedAsset] = useState("AF-0119");
  const [targetEmployee, setTargetEmployee] = useState("");
  const [reason, setReason] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmployee) return;
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setTargetEmployee("");
      setReason("");
    }, 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl font-sans">
      {/* Selector Area */}
      <div className="bg-white p-6 border-3 border-black rounded shadow-[4px_4px_0_#111110] space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-bold uppercase font-mono text-gray">Select Asset:</span>
          <select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="w-full px-4 py-3 border-3 border-black rounded font-mono text-sm focus:outline-none focus:bg-yellow/10"
          >
            <option value="AF-0119">AF-0119 - Dell laptop</option>
            <option value="AF-0012">AF-0012 - Office chair</option>
            <option value="AF-0231">AF-0231 - Monitor screen</option>
          </select>
        </label>

        {selectedAsset === "AF-0119" && (
          <div className="bg-[#FF6B6B] text-black p-4 border-3 border-black rounded font-bold font-mono text-xs shadow-[3px_3px_0_#111110]">
            ⚠️ Already Allocated to Priya Shah (Engineering). Direct re-allocation is blocked - submit transfer request below.
          </div>
        )}
      </div>

      {/* Form Area */}
      {selectedAsset === "AF-0119" && (
        <form onSubmit={handleSubmit} className="bg-white p-6 border-3 border-black rounded shadow-[6px_6px_0_#111110] space-y-4">
          <div className="border-b-2 border-black pb-2 mb-4">
            <h3 className="font-mono text-base font-black uppercase">Create Transfer Request</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase font-mono text-gray">From (Current Owner):</span>
              <input
                type="text"
                disabled
                value="Priya Shah (Engineering)"
                className="w-full px-4 py-3 border-3 border-black rounded font-mono text-sm bg-paper cursor-not-allowed"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase font-mono text-gray">To (Recipient):</span>
              <select
                value={targetEmployee}
                onChange={(e) => setTargetEmployee(e.target.value)}
                required
                className="w-full px-4 py-3 border-3 border-black rounded font-mono text-sm focus:outline-none focus:bg-yellow/10"
              >
                <option value="">Select Employee...</option>
                <option value="Aditi Rao">Aditi Rao (Engineering)</option>
                <option value="Rohan Mehta">Rohan Mehta (Facilities)</option>
                <option value="Sana Iqbal">Sana Iqbal (Field Ops)</option>
              </select>
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase font-mono text-gray">Reason for Transfer:</span>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              placeholder="Provide a justification for the transfer request..."
              className="w-full px-4 py-3 border-3 border-black rounded font-sans text-sm focus:outline-none focus:bg-yellow/10"
            />
          </label>

          <button
            type="submit"
            className="btn3d bg-yellow text-black border-3 border-black py-3 px-6 font-mono font-black uppercase shadow-[4px_4px_0_#111110] w-full md:w-auto"
          >
            Submit Request
          </button>

          {success && (
            <div className="bg-green-300 text-black p-3 border-2 border-black rounded font-mono text-xs font-bold text-center">
              ✅ Transfer request submitted successfully!
            </div>
          )}
        </form>
      )}

      {/* Allocation History List */}
      <div className="bg-white p-6 border-3 border-black rounded shadow-[6px_6px_0_#111110] space-y-4">
        <div className="border-b-2 border-black pb-2">
          <h3 className="font-mono text-base font-black uppercase">Allocation History</h3>
        </div>
        
        {selectedAsset === "AF-0119" ? (
          <ul className="space-y-4 font-mono text-xs">
            <li className="flex items-start gap-3">
              <span className="text-green-500 font-bold">●</span>
              <div>
                <span className="font-bold text-black">Mar 12</span>
                <span className="text-gray mx-2">·</span>
                <span>Allocated to Priya Shah - Engineering</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray font-bold">●</span>
              <div>
                <span className="font-bold text-black">Jan 04</span>
                <span className="text-gray mx-2">·</span>
                <span>Returned by Arjun Nair - condition: good</span>
              </div>
            </li>
          </ul>
        ) : (
          <p className="text-xs text-gray font-mono">No allocation history available for this asset.</p>
        )}
      </div>
    </div>
  );
}
