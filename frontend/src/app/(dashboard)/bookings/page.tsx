"use client";

import { useState } from "react";

export default function BookingsPage() {
  const [selectedResource, setSelectedResource] = useState("B2");
  const [showModal, setShowModal] = useState(false);

  const timetable = [
    { time: "9:00 AM", status: "booked", team: "Procurement Team", label: "Booked - Procurement Team - 9 to 10" },
    { time: "10:00 AM", status: "conflict", label: "Requested: 9:30 to 10:30 - conflict - slot is unavailable" },
    { time: "11:00 AM", status: "available" },
    { time: "12:00 PM", status: "available" },
    { time: "1:00 PM", status: "available" },
  ];

  return (
    <div className="space-y-6 max-w-4xl font-sans">
      {/* Title block matching Screen 6 */}
      <div className="bg-white p-6 border-3 border-black rounded shadow-[4px_4px_0_#111110] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase font-mono text-gray">Resource:</span>
          <h2 className="font-mono text-xl font-black uppercase mt-1">
            Conference room B2 - Tue, 15 Jul
          </h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn3d bg-yellow text-black border-3 border-black py-3 px-6 font-mono font-black uppercase shadow-[4px_4px_0_#111110]"
        >
          Book a slot
        </button>
      </div>

      {/* Timetable grid */}
      <div className="bg-white border-3 border-black rounded shadow-[6px_6px_0_#111110] overflow-hidden p-6 space-y-4">
        <div className="border-b-2 border-black pb-2 mb-4">
          <h3 className="font-mono text-base font-black uppercase">Schedule</h3>
        </div>

        <div className="relative border-l-2 border-black ml-16 pl-6 space-y-8 py-2">
          {timetable.map((slot, i) => (
            <div key={i} className="relative">
              {/* Hour marker on the left line */}
              <span className="absolute -left-24 top-1 w-16 text-right text-xs font-bold font-mono text-gray">
                {slot.time}
              </span>

              {/* Status block styling */}
              {slot.status === "booked" && (
                <div className="bg-blue-100 text-blue-900 border-2 border-blue-900 p-4 rounded font-mono text-xs font-bold shadow-[2px_2px_0_#1e3a8a]">
                  📘 {slot.label}
                </div>
              )}

              {slot.status === "conflict" && (
                <div className="bg-red-50 text-red-900 border-2 border-dashed border-red-500 p-4 rounded font-mono text-xs font-bold shadow-[2px_2px_0_#991b1b]">
                  ⚠️ {slot.label}
                </div>
              )}

              {slot.status === "available" && (
                <div className="bg-paper text-zinc-600 border border-black border-dashed p-4 rounded font-mono text-xs font-bold hover:bg-yellow/10 cursor-pointer transition-colors">
                  🟢 Available - click to book
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 border-4 border-black rounded shadow-[8px_8px_0_#111110] max-w-md w-full space-y-4">
            <h3 className="font-mono text-lg font-black uppercase border-b-2 border-black pb-2">
              Book Resource Slot
            </h3>
            <p className="text-sm font-mono text-gray">
              Conference room B2 - Tue, 15 Jul
            </p>
            <form onSubmit={(e) => { e.preventDefault(); setShowModal(false); }} className="space-y-4">
              <label className="block space-y-2">
                <span className="text-xs font-bold uppercase font-mono">Time range:</span>
                <input type="text" placeholder="e.g. 11:00 AM - 12:00 PM" required className="w-full px-4 py-2 border-2 border-black rounded font-mono text-sm" />
              </label>
              <label className="block space-y-2">
                <span className="text-xs font-bold uppercase font-mono">Team/Project Name:</span>
                <input type="text" placeholder="e.g. Frontend Sync" required className="w-full px-4 py-2 border-2 border-black rounded font-mono text-sm" />
              </label>
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border-2 border-black rounded font-mono text-xs font-bold bg-paper">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 border-2 border-black rounded font-mono text-xs font-bold bg-yellow text-black shadow-[2px_2px_0_#111110]">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
