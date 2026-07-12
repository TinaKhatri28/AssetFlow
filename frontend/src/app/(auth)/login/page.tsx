"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Check for mock admin credentials first
    if (email === "admin@assetflow.com" && password === "admin123") {
      document.cookie = "assetflow_token=mock_admin_token; path=/";
      window.location.href = "/dashboard";
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();
      document.cookie = `assetflow_token=${data.access_token}; path=/`;
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid-bg flex min-h-screen items-center justify-center p-4 font-sans">
      <form
        onSubmit={handleSubmit}
        className="neo-card w-full max-w-[400px] p-8 bg-white space-y-5"
      >
        {/* Logo and Title */}
        <div className="text-center">
          <div className="h-16 w-16 bg-[#111110] text-[#ffd400] rounded-full border-3 border-black flex items-center justify-center font-display-archivo text-xl font-black mx-auto mb-4 shadow-[2px_2px_0_#111110]">
            AF
          </div>
          <h1 className="font-mono-jb text-lg font-black uppercase tracking-tight text-black">
            AssetFlow &ndash; login
          </h1>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <label className="block space-y-1">
            <span className="text-xs font-bold font-mono-jb uppercase text-gray">Email</span>
            <input
              type="email"
              required
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border-2 border-black rounded-sm font-mono-jb text-xs outline-none focus:bg-[#ffd400]/10"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-xs font-bold font-mono-jb uppercase text-gray">Password</span>
            <input
              type="password"
              required
              placeholder="**********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 border-2 border-black rounded-sm font-mono-jb text-xs outline-none focus:bg-[#ffd400]/10"
            />
            <Link
              href="/forgot-password"
              className="block text-right font-mono-jb text-[10px] text-zinc-500 font-extrabold uppercase hover:underline pt-1"
            >
              Forgot password?
            </Link>
          </label>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-100 text-red-700 border-2 border-red-400 p-3 rounded-sm font-mono-jb text-xs font-bold">
            ⚠️ {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="neo-btn w-full bg-[#ffd400] text-black py-3 font-mono-jb font-black uppercase text-xs shadow-[3px_3px_0_#111110] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Login"}
        </button>

        <hr className="border-t-2 border-black/10 my-4" />

        {/* Signup redirection note */}
        <div className="bg-paper border-2 border-black/10 p-3.5 rounded-sm space-y-2">
          <p className="text-[11px] font-mono-jb text-zinc-600 leading-relaxed font-bold">
            New here? Sign up creates an employee account, admin roles assigned later.
          </p>
          <Link
            href="/signup"
            className="neo-btn w-full bg-white text-black py-2.5 font-mono-jb font-bold uppercase text-[10px] shadow-[2px_2px_0_#111110] inline-block text-center"
          >
            Create Account
          </Link>
        </div>
      </form>
    </div>
  );
}