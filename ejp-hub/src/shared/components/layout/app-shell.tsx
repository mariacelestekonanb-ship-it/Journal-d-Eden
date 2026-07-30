"use client";

import { HandHeart } from "lucide-react";
import * as React from "react";

import { ServiceWorkerRegistration } from "@/features/notifications";
import { APP_NAME } from "@/shared/constants/app";
import type { CurrentProfile } from "@/shared/lib/auth/get-current-profile";
import { Sheet, SheetContent, SheetTitle } from "@/shared/ui/sheet";

import { Header } from "./header";
import { Sidebar } from "./sidebar";

function Brand() {
  return (
    <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <HandHeart className="size-4" />
      </div>
      <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">{APP_NAME}</span>
    </div>
  );
}

export function AppShell({ profile, children }: { profile: CurrentProfile; children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  return (
    <div className="flex min-h-svh bg-background">
      <ServiceWorkerRegistration />
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <Brand />
        <div className="flex flex-1 flex-col py-4">
          <Sidebar role={profile.role} />
        </div>
      </aside>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-64 bg-sidebar p-0">
          <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
          <Brand />
          <div className="flex flex-1 flex-col py-4">
            <Sidebar role={profile.role} onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header profile={profile} onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-6xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
