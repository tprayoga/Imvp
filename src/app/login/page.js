"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/ui/FormInput";
import { useAppData } from "@/components/layout/AppProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppData();
  const [email, setEmail] = useState("admin@ibk.local");
  const [password, setPassword] = useState("123456");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email || !password) return;

    login(email);
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-200 to-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">IBK Internal</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Incentive Management Login</h1>
        <p className="mt-1 text-sm text-slate-500">Use any dummy credentials to enter dashboard</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <FormInput
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <FormInput
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
