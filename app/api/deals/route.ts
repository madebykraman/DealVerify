import { NextResponse } from "next/server";
import { getVerifiedDeals } from "@/lib/dealverify/repository";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pincode = url.searchParams.get("pincode") ?? "";

    if (!/^\d{6}$/.test(pincode)) {
      return NextResponse.json({ error: "Valid pincode required." }, { status: 400 });
    }

    const deals = await getVerifiedDeals(pincode);
    return NextResponse.json({ deals });
  } catch {
    return NextResponse.json({ error: "Unable to load verified deals." }, { status: 500 });
  }
}