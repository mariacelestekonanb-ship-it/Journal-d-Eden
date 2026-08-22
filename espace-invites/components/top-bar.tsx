import Link from "next/link";
import { Monogram } from "./monogram";

export function TopBar() {
  return (
    <div className="flex items-center justify-between border-b border-ink/[0.07] px-5 py-4.5">
      <Link
        href="/"
        className="flex items-center gap-2.5 text-ink no-underline"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5" />
          <path d="M11 6l-6 6 6 6" />
        </svg>
        <span className="text-[10px] font-semibold tracking-[0.12em] text-ink-faint uppercase">
          Espace invités
        </span>
      </Link>
      <Monogram className="h-[30px] w-[30px]" />
    </div>
  );
}
