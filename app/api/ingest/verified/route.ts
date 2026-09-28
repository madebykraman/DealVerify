import { NextResponse } from "next/server";
import { persistVerifiedCandidate, type TrustedDealCandidate } from "@/lib/dealverify/ingestion";

function isAuthorized(request: Request) {
  const expected = process.env.DEALVERIFY_INGESTION_SECRET;
  const supplied = request.headers.get("x-dealverify-secret");
  return Boolean(expected && supplied && supplied === expected);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json() as TrustedDealCandidate;

    if (
      typeof body.productTitle !== "string" ||
      typeof body.productUrl !== "string" ||
      typeof body.pincode !== "string" ||
      typeof body.claimedPrice !== "number" ||
      typeof body.livePrice !== "number" ||
      typeof body.inStock !== "boolean" ||
      typeof body.deliverable !== "boolean"
    ) {
      return NextResponse.json({ error: "Invalid ingestion candidate." }, { status: 400 });
    }

    const result = await persistVerifiedCandidate(body);
    return NextResponse.json(result, { status: result.stored ? 200 : 202 });
  } catch {
    return NextResponse.json({ error: "Unable to process ingestion candidate." }, { status: 500 });
  }
}
