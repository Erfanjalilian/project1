"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/auth/FormInput";
import { Button } from "@/components/ui/Button";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function AuthForm() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const router = useRouter();

  // form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!username || !password) return setError("Please fill all fields.");
    setLoading(true);
    await sleep(600);
    const users = JSON.parse(localStorage.getItem("mock_users") || "{}");
    if (users[username]) {
      setError("Username already exists.");
      setLoading(false);
      return;
    }
    users[username] = password;
    localStorage.setItem("mock_users", JSON.stringify(users));
    localStorage.setItem("user", JSON.stringify({ username }));
    setLoading(false);
    router.push("/account");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!username || !password) return setError("Please fill all fields.");
    setLoading(true);
    await sleep(500);
    const users = JSON.parse(localStorage.getItem("mock_users") || "{}");
    if (users[username] && users[username] === password) {
      localStorage.setItem("user", JSON.stringify({ username }));
      setLoading(false);
      router.push("/account");
      return;
    }
    setError("Invalid username or password.");
    setLoading(false);
  }

  return (
    <div className="w-full">
      <div className="flex w-full items-center gap-4">
        <button
          className={`rounded-full px-4 py-2 transition-all duration-250 ${tab === "login" ? "bg-obsidian text-ivory glow-champagne" : "bg-transparent text-obsidian/80 border border-obsidian/8"}`}
          onClick={() => setTab("login")}
        >
          Login
        </button>
        <button
          className={`rounded-full px-4 py-2 transition-all duration-250 ${tab === "signup" ? "bg-obsidian text-ivory glow-champagne" : "bg-transparent text-obsidian/80 border border-obsidian/8"}`}
          onClick={() => setTab("signup")}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={tab === "login" ? handleLogin : handleRegister} className="mt-4 grid w-full gap-4">
        <FormInput id="username" label="Username" value={username} onChange={setUsername} placeholder="Choose a username" autoComplete="username" />
        <FormInput id="password" label="Password" type="password" value={password} onChange={setPassword} placeholder="Enter password" autoComplete="current-password" />

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="mt-2 flex w-full items-center justify-between gap-4">
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "Please wait..." : tab === "login" ? "Sign In" : "Create Account"}
          </Button>

          <Button variant="ghost" href="/" className="w-full">
            Back
          </Button>
        </div>
      </form>
    </div>
  );
}
