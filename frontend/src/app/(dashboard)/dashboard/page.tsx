"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Status = "Allocated" | "Available" | "Maintenance" | "Overdue";

const STATUS_COLORS: Record<Status, { bg: string; text: string; dot: string }> = {
  Allocated: { bg: "bg-[#FFF2B8]", text: "text-[#7A5C00]", dot: "bg-[#C99A00]" },
  Available: { bg: "bg-[#E1F3E8]", text: "text-[#1E6B41]", dot: "bg-[#22c55e]" },
  Overdue: { bg: "bg-[#FFE1DC]", text: "text-[#9C3323]", dot: "bg-[#ef4444]" },
  Maintenance: { bg: "bg-[#EAEAEA]", text: "text-[#555555]", dot: "bg-[#999999]" },
};

interface Stat {
  label: string;
  count: string;
  highlight?: boolean;
}

interface Activity {
  id: number;
  title: string;
  detail: string;
  time: string;
}

interface Asset {
  tag: string;
  name: string;
  status: Status;
  holder: string;
  location: string;
}

const STATS: Stat[] = [
  { label: "Available", count: "-" },
  { label: "Allocated", count: "-", highlight: true },
  { label: "Under Maint.", count: "-" },
  { label: "Active Bookings", count: "-" },
  { label: "Pending Transfers", count: "-" },
  { label: "Overdue Returns", count: "-" },
];

const ACTIVITIES: Activity[] = [];

const ASSETS: Asset[] = [];

export default function AssetFlowDashboard() {
  const [stats, setStats] = useState<Stat[]>(STATS);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [assets, setAssets] = useState<Asset[]>(ASSETS);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:8000/api/v1/dashboard/stats").then(r => r.json()),
      fetch("http://127.0.0.1:8000/api/v1/assets/").then(r => r.json()),
      fetch("http://127.0.0.1:8000/api/v1/activity_logs/").then(r => r.json())
    ]).then(([statsData, assetsData, activitiesData]) => {
      // 1. Stats
      if (statsData) {
        setStats([
          { label: "Available", count: String(statsData.total_assets - statsData.allocated_assets) },
          { label: "Allocated", count: String(statsData.allocated_assets), highlight: true },
          { label: "Under Maint.", count: String(statsData.maintenance_assets || 0) },
          { label: "Active Bookings", count: String(statsData.active_bookings || 0) },
          { label: "Pending Transfers", count: String(statsData.pending_transfers || 0) },
          { label: "Overdue Returns", count: String(statsData.upcoming_returns || 0) },
        ]);
      }
      
      // 2. Assets
      if (assetsData && Array.isArray(assetsData)) {
        const mappedAssets = assetsData.map((a: any) => {
          let mappedStatus = "Available";
          if (a.status === "ALLOCATED") mappedStatus = "Allocated";
          if (a.status === "UNDER_MAINTENANCE") mappedStatus = "Maintenance";
          return {
            tag: a.asset_tag,
            name: a.name,
            status: mappedStatus as Status,
            holder: "-",
            location: a.location || "Unassigned"
          };
        });
        setAssets(mappedAssets);
      }

      // 3. Activities
      if (activitiesData && Array.isArray(activitiesData)) {
        const mappedActivities = activitiesData.map((act: any) => ({
          id: act.id,
          title: act.action,
          detail: act.details || "",
          time: new Date(act.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        }));
        setActivities(mappedActivities);
      }
      
      setLoading(false);
    }).catch(err => {
      console.error("Failed to fetch dashboard data", err);
      setLoading(false);
    });
  }, []);


  const filteredAssets = assets.filter((asset) =>
    asset.tag.toLowerCase().includes(search.toLowerCase()) ||
    asset.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <span className="h-8 w-8 rounded-full bg-[#ffd400] animate-ping" />
        <span className="font-mono-jb font-bold uppercase tracking-widest text-[#726f66]">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page head info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#111110] text-[#ffd400] text-xs font-bold font-mono-jb px-3 py-1.5 rounded mb-3 tracking-wide">
            <span className="h-2 w-2 rounded-full bg-[#ffd400] animate-pulse" />
            LIVE · 14 ASSETS UPDATED IN THE LAST HOUR
          </div>
          <h2 className="font-display-archivo text-3xl font-black uppercase tracking-tight">
            Today&rsquo;s <span className="bg-[#ffd400] px-2 py-0.5 border-2 border-black">Overview</span>
          </h2>
          <p className="font-serif-playfair text-lg text-zinc-700 mt-1">
            Everything, exactly where it should be.
          </p>
        </div>
        <div className="text-right text-xs font-mono-jb text-[#726f66]">
          SUNDAY, JUL 12 2026
          <br />
          LAST SYNC: 2 MIN AGO
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`neo-card p-5 flex flex-col justify-between h-32 hover:-translate-y-1 transition-transform ${
              stat.highlight ? "bg-[#ffd400]" : "bg-white"
            }`}
          >
            <span
              className={`text-[10px] font-bold uppercase font-mono-jb tracking-wider ${
                stat.highlight ? "text-black" : "text-[#726f66]"
              }`}
            >
              {stat.label}
            </span>
            <h3 className="text-4xl font-display-archivo font-black leading-none mt-2">
              {stat.count}
            </h3>
          </div>
        ))}
      </div>

      {/* Warning banner */}
      <div className="bg-[#ff6b57] p-4 border-3 border-[#111110] rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[5px_5px_0_#111110]">
        <div className="flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <span className="font-mono-jb font-extrabold text-sm uppercase text-[#111110]">
            {stats[5]?.count || "0"} assets overdue for return — flagged for follow-up
          </span>
        </div>
        <Link href="/allocations" className="px-4 py-2 bg-[#111110] text-white border-2 border-[#111110] rounded font-mono-jb font-bold text-xs uppercase shadow-[2px_2px_0_#ffffff] hover:bg-yellow hover:text-black hover:shadow-[2px_2px_0_#111110] transition-all">
          Review →
        </Link>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-4">
        <Link href="/assets?register=true" className="neo-btn bg-[#ffd400] text-black font-mono-jb font-extrabold text-xs uppercase py-3 px-6 shadow-[4px_4px_0_#111110] inline-block text-center">
          + Register Asset
        </Link>
        <Link href="/bookings" className="neo-btn bg-white text-black font-mono-jb font-extrabold text-xs uppercase py-3 px-6 shadow-[4px_4px_0_#111110] inline-block text-center">
          Book Resource
        </Link>
        <Link href="/allocations" className="neo-btn bg-white text-black font-mono-jb font-extrabold text-xs uppercase py-3 px-6 shadow-[4px_4px_0_#111110] inline-block text-center">
          Raise Request
        </Link>
        <Link href="/audits" className="neo-btn bg-[#111110] text-[#ffd400] font-mono-jb font-extrabold text-xs uppercase py-3 px-6 shadow-[4px_4px_0_#ffd400] inline-block text-center">
          Run Audit
        </Link>
      </div>

      {/* Two columns: activity + asset tag */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Recent activity */}
        <div className="lg:col-span-3 neo-card overflow-hidden">
          <div className="p-4 border-b-3 border-black bg-white flex justify-between items-center">
            <span className="font-mono-jb font-extrabold text-sm uppercase">Recent Activity</span>
            <span className="font-mono-jb text-xs text-[#726f66]">Last 24h</span>
          </div>
          <div className="divide-y border-black bg-white">
            {activities.map((act) => (
              <div key={act.id} className="p-4 flex items-start justify-between gap-4 font-mono-jb text-sm hover:bg-[#fff7db] transition-colors">
                <div className="flex gap-2">
                  <span className="text-[#ffd400] font-extrabold select-none">▶</span>
                  <div>
                    <span className="font-bold">{act.title}</span>
                    <span className="text-zinc-600 font-medium"> — {act.detail}</span>
                  </div>
                </div>
                <span className="text-xs text-[#726f66] font-bold whitespace-nowrap">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Asset tag detail card */}
        <div className="lg:col-span-2 relative group">
          <div className="absolute inset-y-0 right-0 left-0 translate-x-2 translate-y-2 bg-[#ffd400] border-3 border-black rounded-lg -z-10 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform" />
          <div className="bg-[#111110] border-3 border-black rounded-lg p-6 text-white space-y-4 shadow-[4px_4px_0_#ffd400] relative overflow-hidden">
            {/* Tag notch overlay */}
            <div className="absolute -top-3 left-6 h-6 w-6 rounded-full bg-[#f7f5ee] border-3 border-black" />
            <div className="flex justify-between items-center text-[10px] font-mono-jb text-zinc-500 font-bold tracking-wider pt-2">
              <span>ASSET TAG</span>
              <span>DEPT: IT</span>
            </div>
            <div className="font-mono-jb text-3xl font-black text-[#ffd400]">
              AF-0231
            </div>
            <div className="inline-flex items-center gap-1.5 bg-[#ffd400] text-black text-[10px] font-mono-jb font-extrabold py-1 px-2.5 rounded">
              <span className="h-1.5 w-1.5 rounded-full bg-black" />
              ALLOCATED
            </div>
            <div className="font-mono-jb text-xs space-y-2 text-zinc-300 leading-relaxed pt-2">
              <div>
                Holder: <span className="text-white font-bold">J. Mehta</span>
              </div>
              <div>
                Location: <span className="text-white font-bold">4th Floor — Bay 3</span>
              </div>
              <div>
                Warranty: <span className="text-white font-bold">Until Mar 2027</span>
              </div>
              <div>
                Last audit: <span className="text-white font-bold">Verified, 3 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Table */}
      <div className="neo-card overflow-hidden">
        <div className="p-4 border-b-3 border-black bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="font-mono-jb font-extrabold text-sm uppercase">All Assets</span>
          <input
            type="text"
            placeholder="Search AF-####..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border-2 border-[#111110] rounded font-mono-jb text-xs focus:outline-none focus:bg-[#ffd400]/10 max-w-xs"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-white">
            <thead>
              <tr className="border-b-2 border-black font-mono-jb text-[10px] uppercase font-bold text-[#726f66] bg-zinc-50">
                <th className="p-4">Tag</th>
                <th className="p-4">Asset</th>
                <th className="p-4">Status</th>
                <th className="p-4">Holder</th>
                <th className="p-4">Location</th>
              </tr>
            </thead>
            <tbody className="font-mono-jb text-xs divide-y divide-[#e7e4da]">
              {filteredAssets.map((asset) => {
                const colors = STATUS_COLORS[asset.status];
                return (
                  <tr key={asset.tag} className="hover:bg-[#fff7db] transition-colors">
                    <td className="p-4 font-bold">{asset.tag}</td>
                    <td className="p-4 font-semibold">{asset.name}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 border-2 border-[#111110] rounded text-[10px] font-bold ${colors.bg} ${colors.text}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                        {asset.status}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-600 font-medium">{asset.holder}</td>
                    <td className="p-4 text-zinc-600 font-medium">{asset.location}</td>
                  </tr>
                );
              })}
              {filteredAssets.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#726f66] italic">
                    No assets matched your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}