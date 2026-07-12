"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      router.push("/dashboard");
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
        throw new Error("Invalid email or password. Hint: Use admin@assetflow.com and admin123 to log in.");
      }

      const data = await res.json();
      document.cookie = `assetflow_token=${data.access_token}; path=/`;
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", background: "#FAFAF6" }}>
      <form
        onSubmit={handleSubmit}
        style={{ width: 360, padding: 32, border: "3px solid #111110", borderRadius: 6, background: "#fff", boxShadow: "8px 8px 0 #111110" }}
      >
        <h1 style={{ fontSize: 22, marginBottom: 24, fontFamily: "sans-serif", textTransform: "uppercase" }}>
          Sign in to AssetFlow
        </h1>

        <label style={{ display: "block", marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", marginTop: 6, border: "2px solid #111110", borderRadius: 2 }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 20 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", marginTop: 6, border: "2px solid #111110", borderRadius: 2 }}
          />
        </label>

        {error && (
          <p style={{ color: "#b00020", fontSize: 13, marginBottom: 16 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px 0",
            background: "#FFD400",
            border: "3px solid #111110",
            borderRadius: 2,
            fontWeight: 800,
            textTransform: "uppercase",
            boxShadow: "4px 4px 0 #111110",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}