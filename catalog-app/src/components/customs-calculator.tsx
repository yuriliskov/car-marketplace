"use client";

import Script from "next/script";
import { useCallback, useRef } from "react";
import { customsCalculator } from "@/data/company";

declare global {
  interface Window {
    CalcusWidget?: {
      show: (type: string, options: { token: string }) => void;
    };
  }
}

export function CustomsCalculator() {
  const rendered = useRef(false);

  /* Виджет сам ищет #calcus-container, поэтому вызываем show один раз после загрузки. */
  const render = useCallback(() => {
    if (rendered.current || !window.CalcusWidget) return;
    rendered.current = true;
    window.CalcusWidget.show("Customs", { token: customsCalculator.token });
  }, []);

  return (
    <>
      <div id="calcus-container" />
      <Script
        src="https://calcus.ru/dist/widget.js"
        strategy="afterInteractive"
        onReady={render}
      />
    </>
  );
}
