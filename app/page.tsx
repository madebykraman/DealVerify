"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronRight, CircleHelp, ExternalLink, Flame, Settings, ShieldCheck, SlidersHorizontal, X } from "lucide-react";

type Screen = "splash" | "welcome" | "pincode" | "priority" | "home" | "settings";
type Deal = {
  id: string;
  title: string;
  price: number;
  history: string;
  source: string;
  posted: string;
  productUrl?: string;
  originalPostUrl?: string;
};

const MOCK_DEALS: Deal[] = [
  {
    id: "protinex",
    title: "Protinex Original Nutrition Drink Mix, 400g",
    price: 267,
    history: "Near 30-day low",
    source: "@dealztrendz",
    posted: "8m ago"
  },
  {
    id: "anker",
    title: "Anker Soundcore Select 4 Go Bluetooth Speaker",
    price: 1499,
    history: "Significant drop",
    source: "@Amazingdeals360",
    posted: "21m ago"
  },
  {
    id: "philips",
    title: "Philips LED Bulb 9W, B22 Cool Daylight — Pack of 4",
    price: 299,
    history: "Near 30-day low",
    highPriority: true,
    source: "@DealsZoneIndia",
    posted: "34m ago"
  }
];

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="brand-mark"><Check size={17} strokeWidth={3} /></span>
      <span className="text-[17px] font-semibold tracking-[-0.03em] text-ink">DealVerify</span>
    </div>
  );
}

function Progress({ step, total = 3 }: { step: number; total?: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`h-1 rounded-full transition-all ${i < step ? "w-8 bg-trust" : "w-2 bg-slate-200"}`} />
      ))}
    </div>
  );
}

function Splash() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-white px-5">
      <div className="flex flex-col items-center text-center">
        <span className="brand-mark h-14 w-14 rounded-[17px]"><Check size={28} strokeWidth={3} /></span>
        <div className="mt-5 text-[21px] font-semibold tracking-[-0.04em] text-ink">DealVerify</div>
        <p className="mt-1.5 text-sm text-muted">Only real deals. Verified.</p>
      </div>
    </main>
  );
}

function Welcome({ onNext }: { onNext: () => void }) {
  return (
    <main className="min-h-dvh bg-white px-5 pb-8 pt-6">
      <div className="mx-auto flex min-h-[calc(100dvh-56px)] max-w-md flex-col">
        <Brand />
        <div className="flex flex-1 flex-col justify-center pb-8">
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[24px] bg-mint text-trust ring-1 ring-teal-100">
            <ShieldCheck size={42} strokeWidth={1.8} />
          </div>
          <p className="mb-3 text-sm font-medium text-trust">DEAL VERIFICATION, NOT DEAL NOISE</p>
          <h1 className="max-w-sm text-[38px] font-bold leading-[1.03] tracking-[-0.055em] text-ink">
            Stop clicking dead deals.
          </h1>
          <p className="mt-5 max-w-sm text-[16px] leading-7 text-muted">
            We check live price, availability at your pincode, and recent price history before we ever notify you.
          </p>
        </div>
        <div className="space-y-3">
          <button onClick={onNext} className="button-primary w-full">
            Get Started <ChevronRight size={18} />
          </button>
          <details className="group rounded-2xl border border-border bg-surface px-4 py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-ink">
              How it works <CircleHelp size={17} className="text-muted transition group-open:rotate-180" />
            </summary>
            <p className="pt-3 text-sm leading-6 text-muted">
              A candidate deal must match its claimed price, be in stock and deliverable to your exact pincode, and show meaningful recent price value. If it fails, you never see it.
            </p>
          </details>
        </div>
      </div>
    </main>
  );
}

function Pincode({ value, setValue, onNext, onBack }: { value: string; setValue: (v: string) => void; onNext: () => void; onBack: () => void }) {
  const valid = /^\d{6}$/.test(value);
  return (
    <main className="min-h-dvh bg-white px-5 pb-8 pt-6">
      <div className="mx-auto flex min-h-[calc(100dvh-56px)] max-w-md flex-col">
        <div className="flex items-center justify-between"><Brand /><button onClick={onBack} className="icon-button"><X size={18} /></button></div>
        <div className="mt-8"><Progress step={2} /></div>
        <div className="flex flex-1 flex-col justify-center">
          <p className="mb-3 text-sm font-medium text-trust">AVAILABILITY CHECK</p>
          <h1 className="text-[30px] font-bold leading-tight tracking-[-0.04em] text-ink">Where should we check availability?</h1>
          <p className="mt-4 text-[15px] leading-6 text-muted">We only use this to check if the product can be delivered to you.</p>
          <input
            autoFocus
            inputMode="numeric"
            maxLength={6}
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            aria-label="6-digit pincode"
            className="pincode-input mt-9"
          />
          <p className="mt-3 text-center text-xs text-muted">6-digit Indian pincode</p>
        </div>
        <button disabled={!valid} onClick={onNext} className="button-primary w-full disabled:cursor-not-allowed disabled:opacity-40">
          Continue <ChevronRight size={18} />
        </button>
      </div>
    </main>
  );
}

function Priority({ value, setValue, onNext, onBack }: { value: number; setValue: (v: number) => void; onNext: () => void; onBack: () => void }) {
  return (
    <main className="min-h-dvh bg-white px-5 pb-8 pt-6">
      <div className="mx-auto flex min-h-[calc(100dvh-56px)] max-w-md flex-col">
        <div className="flex items-center justify-between"><Brand /><button onClick={onBack} className="icon-button"><X size={18} /></button></div>
        <div className="mt-8"><Progress step={3} /></div>
        <div className="flex flex-1 flex-col justify-center">
          <p className="mb-3 text-sm font-medium text-trust">YOUR PRIORITY LANE</p>
          <h1 className="text-[30px] font-bold leading-tight tracking-[-0.04em] text-ink">What feels like a high-priority deal to you?</h1>
          <p className="mt-4 text-[15px] leading-6 text-muted">Deals at or below this amount appear first. The default is intentionally focused on everyday wins.</p>
          <div className="mt-10 flex items-center justify-center gap-1 text-ink">
            <span className="text-2xl font-semibold">₹</span>
            <input
              inputMode="numeric"
              value={value}
              onChange={(e) => setValue(Math.max(0, Math.min(10000, Number(e.target.value.replace(/\D/g, "")) || 0)))}
              className="w-36 border-b-2 border-slate-200 bg-transparent text-center text-5xl font-bold tracking-[-0.05em] outline-none focus:border-trust"
            />
          </div>
          <input type="range" min={100} max={2000} step={50} value={value} onChange={(e) => setValue(Number(e.target.value))} className="mt-10 w-full accent-teal-700" />
          <div className="mt-2 flex justify-between text-xs text-muted"><span>₹100</span><span>₹2,000</span></div>
        </div>
        <button onClick={onNext} className="button-primary w-full">Finish Setup <Check size={18} /></button>
      </div>
    </main>
  );
}

function DealCard({ deal, threshold }: { deal: Deal; threshold: number }) {
  const priority = deal.price <= threshold;
  return (
    <article className={`deal-card ${priority ? "deal-card-priority" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <span className="badge-verified"><Check size={12} strokeWidth={3} /> Verified</span>
          {priority && <span className="badge-priority"><Flame size={12} fill="currentColor" /> High Priority</span>}
        </div>
        <span className="text-xs text-slate-400">{deal.posted}</span>
      </div>
      <h2 className="mt-4 line-clamp-2 text-[16px] font-semibold leading-6 text-ink">{deal.title}</h2>
      <div className="mt-4">
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Verified price</span>
        <div className="mt-0.5 text-[30px] font-bold tracking-[-0.045em] text-ink">₹{deal.price.toLocaleString("en-IN")}</div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-[13px] text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-trust" />
        {deal.history}
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-muted">
        <span>{deal.source}</span>
        <div className="flex gap-4">
          {deal.productUrl ? <a href={deal.productUrl} target="_blank" rel="noreferrer" className="font-medium text-trust">View Product <ExternalLink size={13} className="inline" /></a> : <span className="text-slate-300">View Product</span>}
          {deal.originalPostUrl ? <a href={deal.originalPostUrl} target="_blank" rel="noreferrer" className="font-medium text-slate-600">Original Post</a> : <span className="text-slate-300">Original Post</span>}
        </div>
      </div>
    </article>
  );
}

function EmptyState({ pincode }: { pincode: string }) {
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center px-8 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-mint text-trust ring-1 ring-teal-100">
        <ShieldCheck size={32} strokeWidth={1.7} />
      </div>
      <h2 className="text-[21px] font-semibold tracking-[-0.025em] text-ink">No verified deals right now</h2>
      <p className="mt-2 max-w-xs text-sm leading-6 text-muted">
        We’re watching the best accounts. You’ll only hear from us when something real and available appears.
      </p>
      <p className="mt-5 text-xs text-slate-400">Last checked a few minutes ago • {pincode}</p>
    </div>
  );
}

function Home({ pincode, threshold, showMocks, setShowMocks, onSettings, deals, authenticated }: { pincode: string; threshold: number; showMocks: boolean; setShowMocks: (v: boolean) => void; onSettings: () => void; deals: Deal[]; authenticated: boolean }) {
  return (
    <main className="min-h-dvh bg-surface">
      <header className="sticky top-0 z-10 border-b border-border bg-white/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          <div><Brand /><p className="mt-1 pl-7 text-[11px] text-muted">Delivering to {pincode}</p></div>
          <button onClick={onSettings} className="icon-button" aria-label="Settings"><Settings size={19} /></button>
        </div>
      </header>
      <section className="mx-auto max-w-xl px-4 pb-12 pt-5">
        <div className="mb-5 flex items-end justify-between">
          <div><p className="text-xs font-medium uppercase tracking-[0.08em] text-trust">Verified feed</p><h1 className="mt-1 text-[25px] font-bold tracking-[-0.04em] text-ink">Deals worth opening.</h1></div>
          <button onClick={() => setShowMocks(!showMocks)} className="rounded-full border border-border bg-white px-3 py-2 text-xs font-medium text-slate-600">{showMocks ? "Show empty" : "Preview deals"}</button>
        </div>
        {deals.length ? deals.map((deal) => <DealCard key={deal.id} deal={deal} threshold={threshold} />) : <EmptyState pincode={pincode} />}
        {!authenticated && !showMocks && <p className="mx-auto mt-2 max-w-sm text-center text-xs text-slate-400">Sign in to sync verified deals and settings across devices.</p>}
      </section>
    </main>
  );
}

function Settings({ pincode, setPincode, threshold, setThreshold, onBack }: { pincode: string; setPincode: (v: string) => void; threshold: number; setThreshold: (v: number) => void; onBack: () => void }) {
  return (
    <main className="min-h-dvh bg-surface">
      <header className="border-b border-border bg-white px-4 py-3"><div className="mx-auto flex max-w-xl items-center justify-between"><Brand /><button onClick={onBack} className="icon-button"><X size={18} /></button></div></header>
      <section className="mx-auto max-w-xl px-4 pb-12 pt-6">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-trust">Preferences</p>
        <h1 className="mt-1 text-[28px] font-bold tracking-[-0.04em] text-ink">Settings</h1>
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white">
          <label className="block border-b border-border p-4"><span className="text-sm font-semibold text-ink">Pincode</span><span className="mt-1 block text-xs text-muted">Used for live delivery checks.</span><input inputMode="numeric" maxLength={6} value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0,6))} className="mt-3 w-full rounded-xl border border-border px-3 py-3 text-base outline-none focus:border-trust" /></label>
          <label className="block p-4"><span className="text-sm font-semibold text-ink">High-priority threshold</span><span className="mt-1 block text-xs text-muted">Deals at or below this amount float to the top.</span><div className="mt-4 flex items-center gap-3"><span className="text-xl font-semibold">₹</span><input inputMode="numeric" value={threshold} onChange={(e) => setThreshold(Number(e.target.value.replace(/\D/g,"")) || 0)} className="w-full rounded-xl border border-border px-3 py-3 text-base outline-none focus:border-trust" /></div></label>
        </div>
        <div className="mt-5 rounded-2xl border border-border bg-white p-4"><div className="flex gap-3"><SlidersHorizontal size={18} className="mt-0.5 text-trust" /><div><p className="text-sm font-semibold text-ink">How verification works</p><p className="mt-1 text-xs leading-5 text-muted">Price match + pincode availability + recent price value. A failed check is discarded silently.</p></div></div></div>
        <p className="mt-6 text-center text-xs text-slate-400">DealVerify v0.1 • Only real deals. Verified.</p>
      </section>
    </main>
  );
}

export default function Page() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [pincode, setPincode] = useState("");
  const [threshold, setThreshold] = useState(500);
  const [showMocks, setShowMocks] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [authenticated, setAuthenticated] = useState(false);

  const saveLocal = (nextPincode: string, nextThreshold: number) => {
    localStorage.setItem("dealverify.settings", JSON.stringify({ pincode: nextPincode, threshold: nextThreshold }));
  };

  const syncSettings = async (nextPincode: string, nextThreshold: number) => {
    saveLocal(nextPincode, nextThreshold);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode: nextPincode, high_priority_threshold: nextThreshold })
      });
      setAuthenticated(response.ok);
    } catch {
      setAuthenticated(false);
    }
  };

  const loadDeals = async () => {
    if (!pincode) return;
    try {
      const response = await fetch("/api/deals", { cache: "no-store" });
      if (!response.ok) {
        setAuthenticated(response.status !== 401);
        return;
      }
      const data = await response.json();
      setAuthenticated(Boolean(data.authenticated));
      setDeals((data.deals ?? []).map((deal: Record<string, unknown>) => ({
        id: String(deal.id),
        title: String(deal.product_title),
        price: Number(deal.verified_price),
        history: String(deal.history_note),
        source: String(deal.source_handle ?? "DealVerify"),
        posted: String(deal.first_seen_at ?? ""),
        productUrl: typeof deal.product_url === "string" ? deal.product_url : undefined,
        originalPostUrl: typeof deal.x_post_url === "string" ? deal.x_post_url : undefined
      })));
    } catch {
      setDeals([]);
    }
  };

  useEffect(() => {
    const splashTimer = window.setTimeout(() => setScreen((current) => current === "splash" ? "welcome" : current), 1400);
    const saved = localStorage.getItem("dealverify.settings");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPincode(parsed.pincode ?? "");
        setThreshold(parsed.threshold ?? 500);
        setScreen("home");
      } catch {}
    }

    fetch("/api/settings", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return;
        const data = await response.json();
        if (data.settings) {
          setAuthenticated(true);
          setPincode(data.settings.pincode);
          setThreshold(data.settings.high_priority_threshold);
          saveLocal(data.settings.pincode, data.settings.high_priority_threshold);
          setScreen("home");
        }
      })
      .catch(() => {});

    return () => window.clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    if (screen === "home" && pincode && !showMocks) void loadDeals();
  }, [screen, pincode, showMocks]);

  const finish = async () => {
    await syncSettings(pincode, threshold);
    setScreen("home");
  };

  const saveAndHome = async () => {
    await syncSettings(pincode, threshold);
    setScreen("home");
  };

  const displayDeals = showMocks ? MOCK_DEALS : deals;

  if (screen === "splash") return <Splash />;
  if (screen === "welcome") return <Welcome onNext={() => setScreen("pincode")} />;
  if (screen === "pincode") return <Pincode value={pincode} setValue={setPincode} onNext={() => setScreen("priority")} onBack={() => setScreen("welcome")} />;
  if (screen === "priority") return <Priority value={threshold} setValue={setThreshold} onNext={finish} onBack={() => setScreen("pincode")} />;
  if (screen === "settings") return <Settings pincode={pincode} setPincode={setPincode} threshold={threshold} setThreshold={setThreshold} onBack={saveAndHome} />;
  return <Home pincode={pincode} threshold={threshold} showMocks={showMocks} setShowMocks={setShowMocks} onSettings={() => setScreen("settings")} deals={displayDeals} authenticated={authenticated} />;
}