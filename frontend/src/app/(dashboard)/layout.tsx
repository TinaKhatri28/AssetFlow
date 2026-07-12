"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Organization setup", href: "/org-setup", icon: "🏢" },
    { name: "Assets", href: "/assets", icon: "📦" },
    { name: "Allocation & Transfer", href: "/allocations", icon: "🤝" },
    { name: "Resource Booking", href: "/bookings", icon: "📅" },
    { name: "Maintenance", href: "/maintenance", icon: "🔧" },
    { name: "Audit", href: "/audits", icon: "🔍" },
    { name: "Reports", href: "/reports", icon: "📈" },
    { name: "Notifications", href: "/notifications", icon: "🔔" },
  ];

  const handleLogout = () => {
    // Delete cookie and redirect to login
    document.cookie = "assetflow_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-paper text-black font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col border-r-4 border-black">
        {/* Logo Section */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <Link href="/" className="font-mono text-xl font-bold flex items-center gap-2">
            AssetFlow <span className="bg-yellow text-black text-xs px-2 py-0.5 rounded font-sans font-bold">AF-SYS</span>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm font-semibold transition-all duration-150 border-2 ${
                  isActive
                    ? "bg-yellow text-black border-black shadow-[3px_3px_0_#111110]"
                    : "border-transparent hover:bg-zinc-900 hover:text-yellow"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b-4 border-black flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold font-mono tracking-tight uppercase">
              {navItems.find((item) => pathname === item.href)?.name || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Live Indicator */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow"></span>
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">Live Sync</span>
            </div>

            <div className="h-6 w-[2px] bg-black/10" />

            {/* Admin Profile & Logout */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[9px] font-mono-jb text-zinc-400 font-bold uppercase leading-none">Logged In As:</div>
                <div className="text-xs font-bold leading-tight">Admin (Mock)</div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-3 py-1.5 bg-[#ff6b57] text-black border-2 border-black rounded-sm shadow-[2px_2px_0_#000000] hover:bg-[#ff8573] active:translate-y-0.5 active:shadow-[1px_1px_0_#000000] transition-all font-mono-jb font-bold uppercase text-[10px] tracking-wide"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
