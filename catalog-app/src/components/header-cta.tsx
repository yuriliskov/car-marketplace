"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./site-header.module.css";

/* На странице модели ведём в её собственную форму, иначе — в форму на главной. */
export function HeaderCta() {
  const pathname = usePathname();

  if (pathname.startsWith("/cars/")) {
    return (
      <a className={styles.topCta} href="#lead">
        Посчитать цену
      </a>
    );
  }

  return (
    <Link className={styles.topCta} href="/#order">
      Посчитать цену
    </Link>
  );
}
