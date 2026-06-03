"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { apiLoadingStart, apiLoadingStop } from "@/lib/loadingBus";

const MIN_NAV_LOADER_MS = 350;

export default function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastRouteRef = useRef({ pathname: null, search: null });

  useEffect(() => {
    const search = searchParams?.toString() ?? "";
    const lastRoute = lastRouteRef.current;
    const isFirstRun = lastRoute.pathname === null && lastRoute.search === null;
    const hasChanged =
      lastRoute.pathname !== pathname || lastRoute.search !== search;

    lastRouteRef.current = { pathname, search };

    if (isFirstRun || !hasChanged) return;

    apiLoadingStart();
    const startTime = Date.now();
    const stopTimer = setTimeout(apiLoadingStop, MIN_NAV_LOADER_MS);

    return () => {
      clearTimeout(stopTimer);
      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_NAV_LOADER_MS) {
        setTimeout(apiLoadingStop, MIN_NAV_LOADER_MS - elapsed);
      } else {
        apiLoadingStop();
      }
    };
  }, [pathname, searchParams]);

  return null;
}
