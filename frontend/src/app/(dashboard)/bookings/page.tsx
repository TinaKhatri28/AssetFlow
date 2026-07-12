"use client";

import { useState } from "react";

interface Slot {
  time: string;
  status: "booked" | "conflict" | "available";
  team?: string;
  label?: string;
}

export default function BookingsPage() {
  const [showModal, setShowModal] = useState(false);
  const [timeRange, setTimeRange] = useState("");
  const [teamName, setTeamName] = useState("");

  const [slots, setSlots] = useState<Slot[]>([
    { time: "9:00 AM", status: "booked", team: "Procurement Team", label: "Booked - Procurement Team - 9:00 AM to 10:00 AM" },
    { time: "10:00 AM", status: "conflict", label: "Requested: 9:30 AM to 10:30 AM - conflict - slot is unavailable" },
    { time: "11:00 AM", status: "available" },
    { time: "12:00 PM", status: "available" },
    { time: "1:00 PM", status: "available" },
  ]);

  const handleOpenBookModal = (prefillTime?: string) => {
    setTimeRange(prefillTime ? `${prefillTime} - ${getNextHour(prefillTime)}` : "");
    setTeamName("");
    setShowModal(true);
  };

  const getNextHour = (timeStr: string) => {
    if (timeStr === "11:00 AM") return "12:00 PM";
    if (timeStr === "12:00 PM") return "1:00 PM";
    if (timeStr === "1:00 PM") return "2:00 PM";
    return "Hour";
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeRange.trim() || !teamName.trim()) return;

    // Check if the user is booking a slot that matches one of the hours
    const matchHour = timeRange.split("-")[0].trim(); // e.g. "11:00 AM"
    
    setSlots((prevSlots) => {
      let updated = false;
      const nextSlots = prevSlots.map((slot) => {
        if (slot.time.toLowerCase() === matchHour.toLowerCase() && slot.status === "available") {
          updated = true;
          return {
            ...slot,
            status: "booked" as const,
            team: teamName,
            label: `Booked - ${teamName} - ${timeRange}`,
          };
        }
        return slot;
      });

      if (updated) {
        return nextSlots;
      }

      // If it doesn't match an exact slot, append it as a new booked slot
      return [
        ...prevSlots,
        {
          time: matchHour || "Booked Slot",
          status: "booked" as const,
          team: teamName,
          label: `Booked - ${teamName} - ${timeRange}`,
        },
      ];
    });

    setShowModal(false);
    setTimeRange("");
    setTeamName("");
  };

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Title block matching Screen 6 */}
      <div className="bg-white p-6 border-3 border-black rounded shadow-[4px_4px_0_#111110] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase font-mono text-gray">Resource:</span>
          <h2 className="font-mono text-xl font-black uppercase mt-1">
            Conference room B2 - Tue, 15 Jul
          </h2>
        </div>
        <button
          onClick={() => handleOpenBookModal()}
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
          {slots.map((slot, i) => (
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
                <div 
                  onClick={() => handleOpenBookModal(slot.time)}
                  className="bg-paper text-zinc-600 border border-black border-dashed p-4 rounded font-mono text-xs font-bold hover:bg-yellow/10 cursor-pointer transition-colors"
                >
                  🟢 Available - click to book
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white p-6 border-4 border-black rounded shadow-[8px_8px_0_#111110] max-w-md w-full space-y-4">
            <h3 className="font-mono text-lg font-black uppercase border-b-2 border-black pb-2">
              Book Resource Slot
            </h3>
            <p className="text-sm font-mono text-gray">
              Conference room B2 - Tue, 15 Jul
            </p>
            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <label className="block space-y-2">
                <span className="text-xs font-bold uppercase font-mono">Time range:</span>
                <input 
                  type="text" 
                  placeholder="e.g. 11:00 AM - 12:00 PM" 
                  required 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-black rounded font-mono text-sm" 
                />
              </label>
              <label className="block space-y-2">
                <span className="text-xs font-bold uppercase font-mono">Team/Project Name:</span>
                <input 
                  type="text" 
                  placeholder="e.g. Frontend Sync" 
                  required 
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-black rounded font-mono text-sm" 
                />
              </label>
              <div className="flex gap-2 justify-end pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-4 py-2 border-2 border-black rounded font-mono text-xs font-bold bg-paper"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 border-2 border-black rounded font-mono text-xs font-bold bg-[#ffd400] text-black shadow-[2px_2px_0_#111110] active:translate-y-0.5 active:shadow-[1px_1px_0_#111110] transition-all"
                >
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
