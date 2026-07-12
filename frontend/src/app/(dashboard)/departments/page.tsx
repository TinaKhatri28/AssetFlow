"use client";

import { useState, useEffect } from "react";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/departments/")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setDepartments(data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <h2 className="font-display-archivo text-3xl font-black uppercase tracking-tight">
          Organization <span className="bg-[#ffd400] px-2 py-0.5 border-2 border-black">Departments</span>
        </h2>
        <button className="btn3d bg-yellow text-black border-3 border-black py-2 px-6 font-mono font-black uppercase shadow-[4px_4px_0_#111110]">
          + Add Department
        </button>
      </div>

      <div className="bg-white border-3 border-black rounded shadow-[6px_6px_0_#111110] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black text-white text-xs font-mono uppercase border-b-3 border-black">
              <th className="p-4">ID</th>
              <th className="p-4">Department Name</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {departments.length > 0 ? (
              departments.map((dept) => (
                <tr key={dept.id} className="text-sm font-semibold hover:bg-paper/30">
                  <td className="p-4 font-mono text-xs">{dept.id}</td>
                  <td className="p-4">{dept.name}</td>
                  <td className="p-4">
                    <span className="inline-block px-2.5 py-0.5 border-2 border-black rounded-sm text-xs font-bold uppercase font-mono bg-green-300">
                      {dept.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray font-mono text-sm">
                  Loading departments...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
