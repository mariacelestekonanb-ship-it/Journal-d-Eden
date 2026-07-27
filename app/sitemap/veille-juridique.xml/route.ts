import { NextResponse } from "next/server";

import { veilleEntries, serializeUrlset } from "@/lib/sitemap";

export function GET() {
  return new NextResponse(serializeUrlset(veilleEntries()), {
    headers: { "Content-Type": "application/xml" },
  });
}
