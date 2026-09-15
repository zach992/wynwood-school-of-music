import { NextRequest, NextResponse } from "next/server";
import { syncOfflineConversions } from "@/lib/google-offline-conversions";

export const runtime = "nodejs";
export const maxDuration = 60;

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret && request.headers.get("authorization") === `Bearer ${secret}`);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const validateOnly = request.nextUrl.searchParams.get("validateOnly") === "true";
    // Validation-only requests still transmit hashed customer identifiers to
    // Google. Keep *all* real-data access behind the compliance gate.
    if (process.env.GOOGLE_OFFLINE_CONVERSIONS_ENABLED !== "true") {
      return NextResponse.json({
        ok: true,
        disabled: true,
        message: "Google Ads offline conversion data sharing is disabled",
      });
    }
    // This second switch allows a real-data validation pass after compliance
    // approval without making the scheduled cron live at the same time.
    if (!validateOnly && process.env.GOOGLE_OFFLINE_CONVERSIONS_LIVE_ENABLED !== "true") {
      return NextResponse.json({
        ok: true,
        disabled: true,
        message: "Live Google Ads offline conversion ingestion is disabled",
      });
    }
    const summary = await syncOfflineConversions({ validateOnly });
    return NextResponse.json({ ok: summary.failed === 0, validateOnly, ...summary });
  } catch (error) {
    console.error("Offline conversion sync failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown sync error" },
      { status: 500 }
    );
  }
}
