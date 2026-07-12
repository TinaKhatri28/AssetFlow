"use client";

import { useState } from "react";

export default function MaintenancePage() {
  const [columns, setColumns] = useState([
    {
      title: "Pending",
      cards: [{ id: "AF-0062", title: "Projector bulb replacement", desc: "Bulb failed on floor 2" }],
      color: "border-red-400 bg-red-50",
    },
    {
      title: "Approved",
      cards: [{ id: "AF-0021", title: "AC unit compressor repair", desc: "Server room AC leaking" }],
      color: "border-amber-400 bg-amber-50",
    },
    {
      title: "Technician assigned",
      cards: [{ id: "AF-0078", title: "Forklift hydraulic seal", desc: "Assigned to Tech J. Smith" }],
      color: "border-blue-400 bg-blue-50",
    },
    {
      title: "In progress",
      cards: [{ id: "AF-0452", title: "Printer roller jam", desc: "Parts ordered from supplier" }],
      color: "border-indigo-400 bg-indigo-50",
    },
    {
      title: "Resolved",
      cards: [{ id: "AF-9892", title: "Office chair leg weld", desc: "Completed, returned to desk" }],
      color: "border-green-400 bg-green-50",
    },
  ]);

  const moveCard = (cardId: string, direction: "left" | "right") => {
    let cardToMove: any = null;
    let fromColIndex = -1;

    columns.forEach((col, colIndex) => {
      const cardIndex = col.cards.findIndex((c) => c.id === cardId);
      if (cardIndex !== -1) {
        cardToMove = col.cards[cardIndex];
        fromColIndex = colIndex;
      }
    });

    if (!cardToMove) return;

    const toColIndex = direction === "left" ? fromColIndex - 1 : fromColIndex + 1;
    if (toColIndex < 0 || toColIndex >= columns.length) return;

    const newColumns = [...columns];
    // Remove from source
    newColumns[fromColIndex].cards = newColumns[fromColIndex].cards.filter((c) => c.id !== cardId);
    // Add to target
    newColumns[toColIndex].cards.push(cardToMove);

    setColumns(newColumns);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {columns.map((col, colIndex) => (
          <div key={col.title} className="bg-white border-3 border-black rounded shadow-[4px_4px_0_#111110] flex flex-col min-h-[400px]">
            {/* Column Header */}
            <div className="bg-black text-white p-3 font-mono text-xs font-bold uppercase tracking-wider text-center border-b-2 border-black">
              {col.title}
            </div>

            {/* Column Body / Cards List */}
            <div className="p-3 flex-1 space-y-3 bg-paper/20">
              {col.cards.map((card) => (
                <div
                  key={card.id}
                  className={`p-4 border-2 border-black rounded shadow-[2px_2px_0_#111110] flex flex-col justify-between space-y-3 ${col.color}`}
                >
                  <div>
                    <span className="font-mono text-[10px] font-black bg-black text-yellow px-1.5 py-0.5 rounded border border-black inline-block shadow-[1px_1px_0_#111110] mb-2">
                      {card.id}
                    </span>
                    <h4 className="text-sm font-bold text-black leading-snug">{card.title}</h4>
                    <p className="text-[11px] text-gray mt-1 leading-normal font-medium">{card.desc}</p>
                  </div>

                  {/* Actions to move */}
                  <div className="flex justify-between items-center pt-2 border-t border-black/10">
                    <button
                      disabled={colIndex === 0}
                      onClick={() => moveCard(card.id, "left")}
                      className={`text-xs font-bold font-mono px-2 py-0.5 border border-black bg-white rounded shadow-[1px_1px_0_#111110] ${
                        colIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-yellow"
                      }`}
                    >
                      ◀
                    </button>
                    <button
                      disabled={colIndex === columns.length - 1}
                      onClick={() => moveCard(card.id, "right")}
                      className={`text-xs font-bold font-mono px-2 py-0.5 border border-black bg-white rounded shadow-[1px_1px_0_#111110] ${
                        colIndex === columns.length - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-yellow"
                      }`}
                    >
                      ▶
                    </button>
                  </div>
                </div>
              ))}
              {col.cards.length === 0 && (
                <div className="text-center py-12 text-xs text-gray font-mono italic">
                  Empty column
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer explanation matching Screen 7 */}
      <div className="bg-white p-4 border-3 border-black rounded shadow-[3px_3px_0_#111110] text-xs font-mono text-gray">
        💡 Approving a card moves the asset to under-maintenance, resolving returns it to available.
      </div>
    </div>
  );
}
