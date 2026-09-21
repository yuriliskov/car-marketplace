import Image from "next/image";
import Link from "next/link";
import { HeaderCta } from "@/components/header-cta";
import { catalogModels, modelPath } from "@/data/catalog";
import { site } from "@/lib/site";
import styles from "./site-header.module.css";

const menu = [
  { label: "Главная", href: site.mainSite, external: true },
  { label: "Каталог", href: "/#models" },
  { label: "Заказать расчёт", href: "/#order" },
  { label: "Этапы", href: "/#journey" },
  { label: "Отзывы", href: "/#reviews" },
  { label: "Гарантии", href: "/#guarantees" },
  { label: "ЧаВо", href: "/#faq" },
  { label: "Контакты", href: "/#contacts" },
];

export function SiteHeader() {
  return (
    <header className={styles.wrap}>
      <div className={styles.topBar}>
        <div className={styles.topInner}>
          <a className={styles.topPhone} href={site.phoneHref}>
            <span>Звоните нам</span>
            <strong>{site.phone}</strong>
          </a>
          <a
            className={styles.topLink}
            href={site.telegram}
            target="_blank"
            rel="noreferrer"
          >
            Задавайте вопросы в Telegram
          </a>
          <a
            className={styles.topLink}
            href={site.max}
            target="_blank"
            rel="noreferrer"
          >
            Мы в MAX
          </a>
          <HeaderCta />
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.mainInner}>
          <a className={styles.brand} href={site.mainSite} aria-label={`${site.name} — главная`}>
            <Image
              src="/logo.png"
              alt="Авто из Китая под ключ"
              width={211}
              height={98}
              priority
            />
          </a>
          <nav className={styles.menu} aria-label="Основная навигация">
            {menu.map((item) =>
              item.external ? (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      </div>

      {/* Промо-строка: ссылки на все страницы моделей, видимые роботам. */}
      <div className={styles.promo}>
        <nav className={styles.promoInner} aria-label="Популярные модели">
          <a href={site.mainCatalog}>Автомобили из Китая на заказ</a>
          {catalogModels.map((entry) => (
            <Link key={entry.slug} href={modelPath(entry.slug)}>
              {entry.navLabel}
            </Link>
          ))}
          <Link href="/#calculator">Таможенный калькулятор</Link>
        </nav>
      </div>
    </header>
  );
}
