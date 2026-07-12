"use client";

import { useState, useEffect } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/categories/")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <h2 className="font-display-archivo text-3xl font-black uppercase tracking-tight">
          Asset <span className="bg-[#ffd400] px-2 py-0.5 border-2 border-black">Categories</span>
        </h2>
        <button className="btn3d bg-yellow text-black border-3 border-black py-2 px-6 font-mono font-black uppercase shadow-[4px_4px_0_#111110]">
          + Add Category
        </button>
      </div>

      <div className="bg-white border-3 border-black rounded shadow-[6px_6px_0_#111110] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black text-white text-xs font-mono uppercase border-b-3 border-black">
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Description</th>
              <th className="p-4">Warranty (Months)</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <tr key={cat.id} className="text-sm font-semibold hover:bg-paper/30">
                  <td className="p-4 font-mono text-xs">{cat.id}</td>
                  <td className="p-4">{cat.name}</td>
                  <td className="p-4 text-xs font-mono text-gray">{cat.description || "—"}</td>
                  <td className="p-4">
                    <span className="inline-block px-2.5 py-0.5 border-2 border-black rounded-sm text-xs font-bold uppercase font-mono bg-blue-200">
                      {cat.warranty_months}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray font-mono text-sm">
                  Loading categories...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
