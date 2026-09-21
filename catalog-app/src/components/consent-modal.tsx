"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { consent } from "@/data/consent";
import styles from "./consent-modal.module.css";

export function ConsentText() {
  return (
    <>
      {consent.intro.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {consent.sections.map((section) => (
        <div key={section.text}>
          <p>{section.text}</p>
          {section.bullets && (
            <ul>
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </>
  );
}

export function ConsentModalLink() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button className={styles.trigger} type="button" onClick={() => setOpen(true)}>
        прочитать текст согласия
      </button>

      {/* Портал в body: стили формы не влияют на окно, оверлей всегда сверху. */}
      {open &&
        mounted &&
        createPortal(
          <div
            className={styles.overlay}
            role="dialog"
            aria-modal="true"
            aria-label={consent.title}
            onClick={() => setOpen(false)}
          >
            <div className={styles.panel} onClick={(event) => event.stopPropagation()}>
              <div className={styles.head}>
                <h2>{consent.title}</h2>
                <button
                  className={styles.close}
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Закрыть"
                >
                  ×
                </button>
              </div>
              <div className={styles.body}>
                <ConsentText />
              </div>
              <div className={styles.foot}>
                <Link href="/privacy" target="_blank">
                  Открыть отдельной страницей
                </Link>
                <button
                  className={styles.accept}
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Понятно
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
