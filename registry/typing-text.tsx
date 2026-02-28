import { useEffect, useRef } from "react";

export function TypingText({
  text,
  delay,
  duration,
  className = "",
}: {
  text: string;
  delay: number;
  duration: number;
  className?: string;
}) {
  const chars = text.length;
  const doneAt = delay + duration;
  const outerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const el = outerRef.current;
      if (!el) return;
      el.style.overflowX = "auto";
      // Scroll to the right end so cursor side is visible
      el.scrollLeft = el.scrollWidth;
    }, doneAt);
    return () => clearTimeout(timer);
  }, [doneAt]);

  return (
    <span
      ref={outerRef}
      className={`scrollbar-none flex min-w-0 justify-end overflow-hidden ${className}`}
      style={{
        opacity: 0,
        animation: `fade-in 0ms ${delay}ms forwards`,
      }}
    >
      <span
        className="inline-block whitespace-nowrap border-r-2 border-transparent"
        style={{
          width: 0,
          ["--chars" as string]: `calc(${chars}ch + 2px)`,
          animation: [
            `typing ${duration}ms steps(${chars}, end) ${delay}ms forwards`,
            `blink 600ms step-end ${delay}ms ${Math.ceil(duration / 600) + 2}`,
            `cursor-hide 0ms ${doneAt + 600}ms forwards`,
            `typing-settle 0ms ${doneAt}ms forwards`,
          ].join(", "),
        }}
      >
        {text}
      </span>
    </span>
  );
}
