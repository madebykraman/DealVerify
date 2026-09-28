"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Check, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    });

    if (authError) setError(authError.message);
    else setSent(true);
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-surface px-5">
      <section className="w-full max-w-sm rounded-3xl border border-border bg-white p-6 shadow-card">
        <span className="brand-mark"><Check size={17} strokeWidth={3} /></span>
        <h1 className="mt-5 text-2xl font-bold tracking-[-0.04em] text-ink">Sign in to DealVerify</h1>
        <p className="mt-2 text-sm leading-6 text-muted">Use a magic link so your pincode and preferences stay attached to your account.</p>
        {sent ? (
          <div className="mt-6 rounded-2xl bg-mint p-4 text-sm leading-6 text-teal-900"><Mail size={17} className="mb-2" /> Check your email for the sign-in link.</div>
        ) : (
          <>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="mt-6 w-full rounded-xl border border-border px-3 py-3 outline-none focus:border-trust" />
            {error && <p className="mt-2 text-xs text-danger">{error}</p>}
            <button onClick={submit} disabled={!email.includes("@")} className="button-primary mt-4 w-full disabled:opacity-40">Send magic link</button>
          </>
        )}
      </section>
    </main>
  );
}