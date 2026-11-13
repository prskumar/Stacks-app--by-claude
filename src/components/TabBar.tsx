"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const TABS = [
  { href: "/queue", label: "Queue", icon: "▣" },
  { href: "/library", label: "Library", icon: "☰" },
  { href: "/follow-ups", label: "Follow-ups", icon: "★" },
  { href: "/notes", label: "Notes", icon: "✎" },
  { href: "/you", label: "You", icon: "●" },
] as const;

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t bg-surface"
      style={{ borderColor: "var(--line)" }}
    >
      {TABS.map((tab) => {
        const active = pathname?.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={clsx(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-xs transition-colors",
              active ? "text-accent" : "text-ink-faint"
            )}
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
