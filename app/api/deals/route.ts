import { NextResponse } from "next/server";
import { getCurrentUserSettings, getVerifiedDeals } from "@/lib/dealverify/repository";

export async function GET() {
  try {
    const settings = await getCurrentUserSettings();

    if (!settings) {
      return NextResponse.json({ authenticated: false, deals: [] }, { status: 401 });
    }

    const deals = await getVerifiedDeals(settings.pincode);
    return NextResponse.json({ authenticated: true, deals });
  } catch {
    return NextResponse.json({ error: "Unable to load verified deals." }, { status: 500 });
  }
}
