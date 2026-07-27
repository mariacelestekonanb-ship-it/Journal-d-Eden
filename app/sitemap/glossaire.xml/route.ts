import { NextResponse } from "next/server";

import { glossaireEntries, serializeUrlset } from "@/lib/sitemap";

export function GET() {
  return new NextResponse(serializeUrlset(glossaireEntries()), {
    headers: { "Content-Type": "application/xml" },
  });
}
