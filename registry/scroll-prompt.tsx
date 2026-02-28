"use client";

import { useEffect, useState } from "react";

export function ScrollPrompt({
  targetId,
  label,
}: {
  targetId: string;
  label: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  if (!visible) return null;

  return (
    <a
      href={`#${targetId}`}
      className="group flex flex-col items-center gap-1 py-2 text-zinc-400 transition hover:text-zinc-200"
    >
      <span className="text-xs font-medium">{label}</span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-bounce"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </a>
  );
}
