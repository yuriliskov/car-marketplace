import type { Metadata } from "next";
import Link from "next/link";
import { CustomsCalculator } from "@/components/customs-calculator";
import { Icon } from "@/components/icon";
import { RequestForm } from "@/components/request-form";
import { ReviewCarousel } from "@/components/review-carousel";
import { catalogModels, modelPath } from "@/data/catalog";
import {
  contacts,
  customsCalculator,
  faq,
  guarantees,
  purchaseSteps,
} from "@/data/company";
import { absoluteUrl, site } from "@/lib/site";
import styles from "./page.module.css";

const money = new Intl.NumberFormat("ru-RU");

const homeTitle = "Автомобили из Китая под ключ — каталог моделей с ценами";
const homeDescription =
  "Каталог автомобилей из Китая под ключ: цены с доставкой в Москву, Санкт-Петербург и Калининград, фото и панорамы 360°, характеристики на русском. Подбор, видеоинспекция, таможня и ЭПТС.";
/* Картинка для соцсетей: фото первой модели каталога. */
const homePreview = catalogModels[0]?.vehicle.gallery[0];

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  keywords: [
    "авто из Китая",
    "автомобили из Китая под ключ",
    "купить машину из Китая",
    "авто из Китая с доставкой",
    "доставка авто из Китая в Москву",
    "авто из Китая в Санкт-Петербург",
    "авто из Китая в Калининград",
    "растаможка авто из Китая",
  ],
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: absoluteUrl("/"),
    siteName: site.name,
    locale: "ru_RU",
    type: "website",
    images: homePreview
      ? [{ url: homePreview.src, alt: homePreview.alt }]
      : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
    images: homePreview ? [homePreview.src] : undefined,
  },
};

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: site.name,
        url: site.url,
        telephone: site.phone,
        email: site.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Калининград",
          streetAddress: "Каменная 17",
          addressCountry: "RU",
        },
        sameAs: [site.telegram, site.max],
      },
      {
        "@type": "ItemList",
        name: "Каталог автомобилей из Китая",
        itemListElement: catalogModels.map((entry, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${entry.vehicle.brand} ${entry.vehicle.model} ${entry.vehicle.year}`,
          url: absoluteUrl(modelPath(entry.slug)),
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: [item.lead, ...(item.body ?? []), ...(item.bullets ?? []), item.note]
              .filter(Boolean)
              .join(" "),
          },
        })),
      },
    ],
  };

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Китай · Корея · Европа</span>
          <h1>Автомобили из Китая под ключ — с видеоинспекцией и прозрачной сметой</h1>
          <p>
            Подберём и проверим автомобиль в Китае, привезём с доставкой в Москву,
            Санкт-Петербург или Калининград и оформим СБКТС и ЭПТС. Цену под ключ
            вы знаете до оплаты и платите по этапам.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryButton} href="#models">
              Смотреть модели
            </Link>
            <Link className={styles.secondaryButton} href="#order">
              Заказать расчёт
            </Link>
            <a className={styles.secondaryButton} href={site.phoneHref}>
              {site.phone}
            </a>
          </div>
        </div>
        <ul className={styles.heroFacts}>
          <li>
            <strong>3 недели</strong>
            <span>средний срок до Москвы и СПб</span>
          </li>
          <li>
            <strong>50+</strong>
            <span>площадок и дилеров в Китае проверяем под ваш запрос</span>
          </li>
          <li>
            <strong>Фото и видео</strong>
            <span>инспекция до оплаты автомобиля</span>
          </li>
          <li>
            <strong>СБКТС и ЭПТС</strong>
            <span>оформляем сами, машину сразу можно ставить на учёт в ГИБДД</span>
          </li>
        </ul>
      </section>

      <section className={styles.models} id="models">
        <div className={styles.sectionHeading}>
          <h2>Автомобили из Китая под заказ — цены под ключ 2026</h2>
          <p>
            Честные фото, панорамы 360° и характеристики на русском, а цена — сразу
            под ключ с доставкой в ваш город. Выбирайте модель и получите точный
            расчёт: ответим в течение часа в рабочее время.
          </p>
        </div>
        <div className={styles.modelGrid}>
          {catalogModels.map((entry) => (
            <article key={entry.slug} className={styles.modelCard}>
              <Link href={modelPath(entry.slug)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={entry.vehicle.gallery[0].src}
                  alt={`${entry.vehicle.brand} ${entry.vehicle.model} ${entry.vehicle.year}`}
                  loading="lazy"
                />
                <div className={styles.modelBody}>
                  <span className={styles.modelStatus}>{entry.vehicle.status}</span>
                  <h3>
                    {entry.vehicle.brand} {entry.vehicle.model} {entry.vehicle.year}
                  </h3>
                  <p className={styles.modelTrim}>{entry.vehicle.trim}</p>
                  <p className={styles.modelSummary}>{entry.summary}</p>
                  <dl className={styles.modelSpecs}>
                    <div>
                      <dt>Под ключ</dt>
                      <dd>{money.format(entry.vehicle.estimatedPriceRub)} ₽</dd>
                    </div>
                    <div>
                      <dt>Мощность</dt>
                      <dd>{entry.vehicle.powerHp} л.с.</dd>
                    </div>
                    <div>
                      <dt>Доставка</dt>
                      <dd>{entry.vehicle.deliveryDays}</dd>
                    </div>
                  </dl>
                  <span className={styles.modelLink}>
                    Цена под ключ и комплектация →
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.order} id="order">
        <div className={styles.orderCopy}>
          <span className={styles.eyebrow}>Заказать расчёт</span>
          <h2>Не нашли нужную модель?</h2>
          <p>
            Привезём любой автомобиль из Китая, Кореи или Европы — не только те,
            что есть в каталоге. Укажите марку и бюджет: подберём варианты, проверим
            их на месте и пришлём смету под ключ. Ответим в течение часа в рабочее
            время.
          </p>
          <ul className={styles.orderFacts}>
            <li>
              <Icon name="route" />
              <span>Подбор из 50+ площадок и дилеров</span>
            </li>
            <li>
              <Icon name="camera" />
              <span>Фото- и видеоинспекция до оплаты</span>
            </li>
            <li>
              <Icon name="shield" />
              <span>Договор и оплата по этапам</span>
            </li>
          </ul>
        </div>
        <RequestForm />
      </section>

      <section className={styles.block} id="calculator">
        <div className={styles.sectionHeading}>
          <h2>{customsCalculator.title}</h2>
          <p>{customsCalculator.lead}</p>
        </div>
        <div className={styles.calcWrap}>
          <CustomsCalculator />
        </div>
        <div className={styles.cards}>
          {customsCalculator.blocks.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <div className={styles.ctaStrip}>
          <div>
            <h3>{customsCalculator.cta.title}</h3>
            <p>{customsCalculator.cta.text}</p>
          </div>
          <Link className={styles.primaryButton} href="#order">
            Запросить расчёт под ключ
          </Link>
        </div>
      </section>

      <section className={styles.block} id="journey">
        <div className={styles.sectionHeading}>
          <h2>Как проходит покупка и доставка «под ключ»</h2>
          <p>
            Показываем каждый этап с отчётами и фото: вы знаете, где ваш автомобиль
            и за что уже заплачены деньги — от подбора в Китае до выдачи в вашем
            городе.
          </p>
        </div>
        <ol className={styles.steps}>
          {purchaseSteps.map((step, index) => (
            <li key={step.title}>
              <span className={styles.stepIndex}>{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <span className={styles.stepTime}>{step.duration}</span>
                {step.lead && <p>{step.lead}</p>}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.block} id="reviews">
        <div className={styles.sectionHeading}>
          <h2>Видео-отзывы клиентов</h2>
          <p>
            Клиенты рассказывают сами: какую машину привезли, в какую сумму вышло
            под ключ и сколько ждали доставку.
          </p>
        </div>
        <ReviewCarousel />
      </section>

      <section className={styles.block} id="guarantees">
        <div className={styles.sectionHeading}>
          <h2>Гарантии · договор · оплата по этапам</h2>
        </div>
        <div className={styles.cards}>
          {guarantees.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <div className={styles.ctaStrip}>
          <div>
            <h3>Готовы обсудить ваш автомобиль?</h3>
            <p>
              Пришлём смету под ключ: стоимость авто в Китае, логистику, таможню,
              оформление СБКТС и ЭПТС. Договор и оплата по этапам — как в каталоге,
              так и для модели, которой у нас пока нет на сайте.
            </p>
          </div>
          <Link className={styles.primaryButton} href="#order">
            Заказать расчёт
          </Link>
        </div>
      </section>

      <section className={styles.block} id="faq">
        <div className={styles.sectionHeading}>
          <h2>Часто задаваемые вопросы</h2>
        </div>
        <div className={styles.faqList}>
          {faq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <div>
                <strong>{item.lead}</strong>
                {item.body?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {item.bullets && (
                  <ul>
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
                {item.note && <p className={styles.faqNote}>{item.note}</p>}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.block} id="contacts">
        <div className={styles.sectionHeading}>
          <h2>С нами можно связаться</h2>
          <p>
            Назовём цену под ключ для вашего города, срок доставки и порядок оплаты.
            Консультация бесплатная, отвечаем в течение часа в рабочее время.
          </p>
        </div>
        <div className={styles.contacts}>
          {contacts.map((contact) => {
            const body = (
              <>
                <span className={styles.contactIcon}>
                  <Icon name={contact.icon} size={contact.icon === "phone" ? 20 : 24} />
                </span>
                <small>{contact.label}</small>
                <strong>{contact.value}</strong>
                <span className={styles.contactHint}>{contact.hint}</span>
              </>
            );

            return contact.href ? (
              <a
                key={contact.label}
                href={contact.href}
                target={contact.href.startsWith("http") ? "_blank" : undefined}
                rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
              >
                {body}
              </a>
            ) : (
              <div key={contact.label}>{body}</div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
