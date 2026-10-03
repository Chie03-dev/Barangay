"use client";

import { useEffect, useState } from "react";

/**
 * Wraps a data source in a loading state so pages can render skeletons.
 *
 * Currently every page uses static mock data, so this fakes network latency
 * to make the loading UI real and testable. When a genuine API is wired up,
 * replace the body of `loader` with a fetch call and delete the artificial
 * delay - the `isLoading` contract stays the same.
 */
export function useAsyncData<T>(
  loader: () => T | Promise<T>,
  options?: { delay?: number; deps?: unknown[] },
) {
  const delay = options?.delay ?? 700;
  const deps = options?.deps ?? EMPTY_DEPS;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    const timer = setTimeout(() => {
      Promise.resolve(loader()).then((result) => {
        if (cancelled) return;
        setData(result);
        setIsLoading(false);
      });
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, ...deps]);

  return { data, isLoading };
}

/** Stable empty array so the dependency list is constant across renders. */
const EMPTY_DEPS: unknown[] = [];