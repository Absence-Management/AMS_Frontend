"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { apiLoadingStart, apiLoadingStop } from "@/lib/loadingBus";

const MIN_NAV_LOADER_MS = 350;

export default function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

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
