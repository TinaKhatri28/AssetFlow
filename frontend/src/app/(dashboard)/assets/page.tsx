"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface Asset {
  tag: string;
  name: string;
  category: string;
  status: string;
  location: string;
}

function AssetsPageContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  
  const [showModal, setShowModal] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Electronics");
  const [newStatus, setNewStatus] = useState("Available");
  const [newLocation, setNewLocation] = useState("");

  const [assets, setAssets] = useState<Asset[]>([
    { tag: "AF-0012", name: "Dell laptop", category: "Electronics", status: "Allocated", location: "Employee desk" },
    { tag: "AF-0062", name: "Projector", category: "Audio Visual", status: "Maintenance", location: "HQ Floor 2" },
    { tag: "AF-0231", name: "Office chair", category: "Furniture", status: "Available", location: "Warehouse" },
  ]);

  useEffect(() => {
    if (searchParams.get("register") === "true") {
      setShowModal(true);
    }
  }, [searchParams]);

  const categories = ["All", "Electronics", "Audio Visual", "Furniture"];
  const statuses = ["All", "Available", "Allocated", "Maintenance"];

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.tag.toLowerCase().includes(search.toLowerCase()) || 
                          asset.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || asset.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || asset.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleRegisterAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim() || !newName.trim()) return;

    setAssets((prev) => [
      ...prev,
      {
        tag: newTag.trim().toUpperCase(),
        name: newName.trim(),
        category: newCategory,
        status: newStatus,
        location: newLocation.trim() || "Warehouse",
      },
    ]);

    // Reset Form
    setShowModal(false);
    setNewTag("");
    setNewName("");
    setNewCategory("Electronics");
    setNewStatus("Available");
    setNewLocation("");
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex-1 max-w-lg relative">
          <input
            type="text"
            placeholder="Search by Tag, serial, or QR code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border-3 border-black rounded shadow-[3px_3px_0_#111110] font-mono text-sm focus:outline-none focus:bg-yellow/10"
          />
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn3d bg-yellow text-black border-3 border-black py-3 px-6 font-mono font-black uppercase shadow-[4px_4px_0_#111110]"
        >
          + Register Asset
        </button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 border-3 border-black rounded shadow-[3px_3px_0_#111110]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase font-mono text-gray">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 border-2 border-black rounded-sm text-xs font-bold uppercase font-mono ${
                selectedCategory === cat ? "bg-black text-white" : "bg-paper hover:bg-yellow text-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="h-6 w-[2px] bg-black hidden lg:block" />

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase font-mono text-gray">Status:</span>
          {statuses.map((stat) => (
            <button
              key={stat}
              onClick={() => setSelectedStatus(stat)}
              className={`px-3 py-1 border-2 border-black rounded-sm text-xs font-bold uppercase font-mono ${
                selectedStatus === stat ? "bg-black text-white" : "bg-paper hover:bg-yellow text-black"
              }`}
            >
              {stat}
            </button>
          ))}
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white border-3 border-black rounded shadow-[6px_6px_0_#111110] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black text-white text-xs font-mono uppercase border-b-3 border-black">
              <th className="p-4">Tag</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => (
                <tr key={asset.tag} className="text-sm font-semibold hover:bg-paper/30">
                  <td className="p-4">
                    <span className="font-mono text-yellow font-black bg-black px-2 py-1 rounded border border-black shadow-[1px_1px_0_#111110] text-xs">
                      {asset.tag}
                    </span>
                  </td>
                  <td className="p-4">{asset.name}</td>
                  <td className="p-4 font-mono text-xs">{asset.category}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 border-2 border-black rounded-sm text-xs font-bold uppercase font-mono ${
                        asset.status === "Available" ? "bg-green-300" :
                        asset.status === "Allocated" ? "bg-blue-300" : "bg-amber-300"
                      }`}
                    >
                      {asset.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray text-xs font-mono">{asset.location}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray font-mono text-sm">
                  No assets found matching the search and filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Register Asset Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 border-4 border-black rounded shadow-[8px_8px_0_#111110] max-w-md w-full space-y-4">
            <h3 className="font-mono text-lg font-black uppercase border-b-2 border-black pb-2">
              Register New Asset
            </h3>
            <form onSubmit={handleRegisterAsset} className="space-y-4">
              <label className="block space-y-1">
                <span className="text-xs font-bold uppercase font-mono">Asset Tag:</span>
                <input 
                  type="text" 
                  placeholder="e.g. AF-0099" 
                  required 
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-black rounded font-mono text-sm" 
                />
              </label>

              <label className="block space-y-1">
                <span className="text-xs font-bold uppercase font-mono">Asset Name:</span>
                <input 
                  type="text" 
                  placeholder="e.g. Dell Monitor 24\" 
                  required 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-black rounded font-mono text-sm" 
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block space-y-1">
                  <span className="text-xs font-bold uppercase font-mono">Category:</span>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-black rounded font-mono text-sm bg-white"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Audio Visual">Audio Visual</option>
                    <option value="Furniture">Furniture</option>
                  </select>
                </label>

                <label className="block space-y-1">
                  <span className="text-xs font-bold uppercase font-mono">Status:</span>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-black rounded font-mono text-sm bg-white"
                  >
                    <option value="Available">Available</option>
                    <option value="Allocated">Allocated</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </label>
              </div>

              <label className="block space-y-1">
                <span className="text-xs font-bold uppercase font-mono">Location:</span>
                <input 
                  type="text" 
                  placeholder="e.g. Warehouse Floor 1" 
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
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
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AssetsPage() {
  return (
    <Suspense fallback={<div className="font-mono text-sm p-4">Loading Assets Directory...</div>}>
      <AssetsPageContent />
    </Suspense>
  );
}
