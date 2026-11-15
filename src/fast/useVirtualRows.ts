import { useCallback, useLayoutEffect, useRef, useState } from "react";

interface Options {
  count: number;
  rowHeight: number;
  overscan?: number;
}

/**
 * Minimal fixed-height windowing. Dependency-free on purpose: the point of this
 * repo is to show the technique, not to wire in a library. Only the rows in (and
 * near) the viewport are rendered; a spacer preserves the real scroll height.
 */
export function useVirtualRows({ count, rowHeight, overscan = 8 }: Options) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState({ start: 0, end: 0 });

  const recompute = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const start = Math.max(0, Math.floor(el.scrollTop / rowHeight) - overscan);
    const visible = Math.ceil(el.clientHeight / rowHeight) + overscan * 2;
    setRange({ start, end: Math.min(count, start + visible) });
  }, [count, rowHeight, overscan]);

  useLayoutEffect(() => {
    recompute();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", recompute, { passive: true });
    window.addEventListener("resize", recompute);
    return () => {
      el.removeEventListener("scroll", recompute);
      window.removeEventListener("resize", recompute);
    };
  }, [recompute]);

  return {
    scrollRef,
    range,
    topSpacer: range.start * rowHeight,
    bottomSpacer: Math.max(0, (count - range.end) * rowHeight),
  };
}
