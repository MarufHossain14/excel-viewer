"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function useVirtualList(itemCount: number, itemHeight: number, overscan = 5) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setViewportHeight(entry.contentRect.height));
    observer.observe(element);
    setViewportHeight(element.clientHeight);
    return () => observer.disconnect();
  }, []);

  const range = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visible = Math.ceil(viewportHeight / itemHeight) + overscan * 2;
    return { start, end: Math.min(itemCount, start + visible) };
  }, [itemCount, itemHeight, overscan, scrollTop, viewportHeight]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const element = containerRef.current;
      if (!element || index < 0) return;
      const itemTop = index * itemHeight;
      const itemBottom = itemTop + itemHeight;
      if (itemTop < element.scrollTop) element.scrollTo({ top: itemTop });
      else if (itemBottom > element.scrollTop + element.clientHeight) {
        element.scrollTo({ top: itemBottom - element.clientHeight });
      }
    },
    [itemHeight],
  );

  return {
    containerRef,
    range,
    totalHeight: itemCount * itemHeight,
    onScroll: (event: React.UIEvent<HTMLDivElement>) => setScrollTop(event.currentTarget.scrollTop),
    scrollToIndex,
  };
}
