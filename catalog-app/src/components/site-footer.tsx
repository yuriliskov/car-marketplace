import Image from "next/image";
import Link from "next/link";
import { catalogModels, modelPath } from "@/data/catalog";
import { publicPath } from "@/lib/paths";
import { site } from "@/lib/site";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.wrap}>
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <a className={styles.brand} href={site.mainSite} aria-label={`${site.name} — главная`}>
            <Image
              src={publicPath("/logo.png")}
              alt="Авто из Китая под ключ"
              width={211}
              height={98}
            />
          </a>
          <p>
            Подбор, проверка, доставка и растаможка автомобилей из Китая под ключ.
            Оплата по этапам, отчёты на каждом шаге.
          </p>
        </div>

        <nav className={styles.col} aria-label="Модели">
          <h2>Модели</h2>
          {catalogModels.map((entry) => (
            <Link key={entry.slug} href={modelPath(entry.slug)}>
              {entry.vehicle.brand} {entry.vehicle.model} {entry.vehicle.year}
            </Link>
          ))}
        </nav>

        <nav className={styles.col} aria-label="Разделы">
          <h2>Разделы</h2>
          <Link href="/#models">Каталог моделей</Link>
          <Link href="/#journey">Этапы покупки</Link>
          <Link href="/#guarantees">Гарантии</Link>
          <Link href="/#faq">Частые вопросы</Link>
          <Link href="/privacy">Обработка персональных данных</Link>
        </nav>

        <div className={styles.col}>
          <h2>Контакты</h2>
          <a href={site.phoneHref}>{site.phone}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={site.telegram} target="_blank" rel="noreferrer">
            Telegram
          </a>
          <a href={site.max} target="_blank" rel="noreferrer">
            Мы в MAX
          </a>
          <span>{site.office}</span>
        </div>
      </div>
      <div className={styles.legal}>
        <span>© {new Date().getFullYear()} CHE168 Group</span>
        <span>Информация на сайте не является публичной офертой.</span>
      </div>
    </footer>
  );
}
