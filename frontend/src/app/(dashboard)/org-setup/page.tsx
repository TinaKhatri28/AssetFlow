"use client";

import { useState } from "react";

export default function OrgSetupPage() {
  const [activeTab, setActiveTab] = useState("Departments");
  
  const [departments] = useState([
    { name: "Engineering", head: "aditi rao", parent: "---", status: "Active" },
    { name: "Facilities", head: "rohan mehta", parent: "---", status: "Active" },
    { name: "Field ops (east)", head: "sana iqbal", parent: "Field Ops", status: "Inactive" },
  ]);

  return (
    <div className="space-y-6 font-sans">
      {/* Tabs list matching Screen 3 */}
      <div className="flex border-b-3 border-black pb-0.5 gap-2">
        {["Departments", "Categories", "Employees", "+ Add"].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => tab !== "+ Add" && setActiveTab(tab)}
              className={`px-4 py-2 border-t-3 border-x-3 border-black font-mono font-bold uppercase transition-all text-sm rounded-t-sm ${
                isActive
                  ? "bg-black text-white translate-y-[3px]"
                  : "bg-paper text-black hover:bg-yellow hover:text-black"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {activeTab === "Departments" && (
        <div className="bg-white border-3 border-black rounded shadow-[6px_6px_0_#111110] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white text-xs font-mono uppercase border-b-3 border-black">
                <th className="p-4">Department</th>
                <th className="p-4">Head</th>
                <th className="p-4">Parent Dept</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black">
              {departments.map((dept, i) => (
                <tr key={i} className="text-sm font-semibold hover:bg-paper/30 font-mono">
                  <td className="p-4 font-sans font-bold">{dept.name}</td>
                  <td className="p-4">{dept.head}</td>
                  <td className="p-4">{dept.parent}</td>
                  <td className="p-4 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 border-2 border-black rounded-sm text-xs font-bold ${
                        dept.status === "Active" ? "bg-green-300" : "bg-red-300"
                      }`}
                    >
                      {dept.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab !== "Departments" && (
        <div className="bg-white p-8 border-3 border-black rounded shadow-[6px_6px_0_#111110] font-mono text-sm text-center">
          Mock {activeTab} section loaded. (Click "Departments" to view department table).
        </div>
      )}

      <p className="text-xs text-gray font-mono italic">
        Editing a department here also drives the picklists in Screens 4 &amp; 5
      </p>
    </div>
  );
}
