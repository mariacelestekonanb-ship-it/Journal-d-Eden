import { NextResponse } from "next/server";

import { ressourcesEntries, serializeUrlset } from "@/lib/sitemap";

export function GET() {
  return new NextResponse(serializeUrlset(ressourcesEntries()), {
    headers: { "Content-Type": "application/xml" },
  });
}
