"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg(error.message);
    else window.location.href = "/";
  }

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMsg(error.message);
    else {
      setMsg("Account created. Signing you in...");
      await signIn();
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f3ee] flex items-center justify-center p-6">
      <div className="bg-white rounded-[20px] p-8 w-full max-w-sm shadow-lg">
        <h1 className="text-2xl font-black mb-6">Sign in</h1>
        <input
          className="w-full border rounded-lg p-3 mb-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded-lg p-3 mb-4"
          placeholder="Password (min 6 characters)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={signIn} className="w-full bg-black text-white rounded-full py-3 font-bold mb-2">
          Sign in
        </button>
        <button onClick={signUp} className="w-full border border-black rounded-full py-3 font-bold">
          Create account
        </button>
        {msg && <p className="text-sm text-red-600 mt-4">{msg}</p>}
      </div>
    </div>
  );
}
