import { NextResponse } from "next/server";

import { comprendreEntries, serializeUrlset } from "@/lib/sitemap";

export function GET() {
  return new NextResponse(serializeUrlset(comprendreEntries()), {
    headers: { "Content-Type": "application/xml" },
  });
}
