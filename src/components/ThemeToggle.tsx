"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import clsx from "clsx";

const OPTIONS = ["system", "light", "dark"] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-9 w-48 rounded-full" style={{ background: "var(--surface-soft)" }} />;

  return (
    <div
      className="inline-flex rounded-full border p-0.5"
      style={{ borderColor: "var(--line)" }}
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt}
          onClick={() => setTheme(opt)}
          className={clsx("rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors")}
          style={
            theme === opt
              ? { background: "var(--ink)", color: "var(--paper)" }
              : { color: "var(--ink-soft)" }
          }
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
