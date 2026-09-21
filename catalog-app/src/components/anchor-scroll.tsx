"use client";

import { useEffect } from "react";

/**
 * Клик по ссылке-якорю на текущей странице всегда возвращает к нужной секции,
 * даже если такой хеш уже стоит в адресе (браузер в этом случае ничего не делает).
 */
export function AnchorScroll() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor || anchor.target) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname !== window.location.pathname || !url.hash) return;

      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;

      /* Перехватываем до next/link, иначе роутер просто проглотит такой клик. */
      event.preventDefault();
      event.stopPropagation();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", url.hash);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
