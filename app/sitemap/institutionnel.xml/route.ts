import { NextResponse } from "next/server";

import { institutionnelEntries, serializeUrlset } from "@/lib/sitemap";

export function GET() {
  return new NextResponse(serializeUrlset(institutionnelEntries()), {
    headers: { "Content-Type": "application/xml" },
  });
}
