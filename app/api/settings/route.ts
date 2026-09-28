import { NextResponse } from "next/server";
import { getCurrentUserSettings, upsertUserSettings } from "@/lib/dealverify/repository";

export async function GET() {
  try {
    const settings = await getCurrentUserSettings();
    if (!settings) return NextResponse.json({ authenticated: false }, { status: 401 });
    return NextResponse.json({ authenticated: true, settings });
  } catch {
    return NextResponse.json({ error: "Unable to load settings." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const pincode = String(body.pincode ?? "");
    const threshold = Number(body.high_priority_threshold);

    if (!/^\d{6}$/.test(pincode)) {
      return NextResponse.json({ error: "Pincode must contain exactly 6 digits." }, { status: 400 });
    }

    if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1000000) {
      return NextResponse.json({ error: "Priority threshold is invalid." }, { status: 400 });
    }

    const settings = await upsertUserSettings({
      pincode,
      high_priority_threshold: Math.round(threshold)
    });

    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: "Unable to save settings." }, { status: 500 });
  }
}