import { HandHeart } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-muted/30 px-4 py-12">
      <div className="flex items-center gap-2 text-foreground">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <HandHeart className="size-5" />
        </div>
        <span className="text-lg font-semibold tracking-tight">EJP Hub</span>
      </div>
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-sm">{children}</div>
    </div>
  );
}
