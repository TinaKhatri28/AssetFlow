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
    { name: "Assets", href: "/assets", icon: "📦" },
    { name: "Allocations", href: "/allocations", icon: "🤝" },
    { name: "Bookings", href: "/bookings", icon: "📅" },
    { name: "Audits", href: "/audits", icon: "🔍" },
    { name: "Maintenance", href: "/maintenance", icon: "🔧" },
    { name: "Transfers", href: "/transfers", icon: "🔄" },
    { name: "Returns", href: "/returns", icon: "📥" },
    { name: "Reports", href: "/reports", icon: "📈" },
    { name: "Settings", href: "/settings", icon: "⚙️" },
  ];

  const handleLogout = () => {
    // Delete cookie and redirect to login
    document.cookie = "assetflow_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-paper text-black font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col justify-between border-r-3 border-black">
        <div>
          {/* Logo Section */}
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <Link href="/" className="font-mono text-xl font-bold flex items-center gap-2">
              AssetFlow <span className="bg-yellow text-black text-xs px-2 py-0.5 rounded font-sans font-bold">AF-SYS</span>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1">
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
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-zinc-800 space-y-2">
          <div className="px-4 py-2 text-xs text-gray bg-zinc-900 rounded font-mono">
            Logged in as: <br />
            <span className="text-white font-bold font-sans text-sm">Admin (Mock)</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-sm font-semibold transition-all duration-150 border-2 border-transparent text-red-400 hover:bg-zinc-900 hover:text-red-300"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b-3 border-black flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold font-mono tracking-tight uppercase">
              {navItems.find((item) => pathname === item.href)?.name || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow"></span>
            </span>
            <span className="text-xs font-mono font-bold px-2 py-1 bg-black text-white rounded">Live Sync Active</span>
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
