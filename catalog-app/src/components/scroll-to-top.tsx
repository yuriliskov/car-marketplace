"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * При переходе между страницами Next.js прокручивает к началу контента, из-за
 * чего шапка остаётся выше экрана. Возвращаем страницу в самый верх, но не
 * мешаем переходам по якорям и кнопке «Назад».
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const restoring = useRef(false);

  useEffect(() => {
    const markRestoring = () => {
      restoring.current = true;
    };

    window.addEventListener("popstate", markRestoring);
    return () => window.removeEventListener("popstate", markRestoring);
  }, []);

  useEffect(() => {
    if (restoring.current) {
      restoring.current = false;
      return;
    }
    if (window.location.hash) return;

    /* instant, иначе глобальный scroll-behavior: smooth прокручивает страницу. */
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
