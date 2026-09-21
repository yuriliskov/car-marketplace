"use client";

/* External source images remain unoptimized in this licensed local prototype. */
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ConsentModalLink } from "@/components/consent-modal";
import { Icon } from "@/components/icon";
import { LocalVrViewer } from "@/components/local-vr-viewer";
import { ReviewCarousel } from "@/components/review-carousel";
import {
  contacts,
  faq,
  guarantees,
  purchaseSteps,
  purchaseVideo,
} from "@/data/company";
import { trackEvent } from "@/lib/track";
import {
  galleryCategories,
  type GalleryImage,
  type UniqueFeature,
  type Vehicle,
} from "@/data/vehicle";
import styles from "./model-landing.module.css";

const money = new Intl.NumberFormat("ru-RU");

function FeatureTile({
  feature,
  index,
}: {
  feature: UniqueFeature;
  index: number;
}) {
  const [flipped, setFlipped] = useState(false);

  const toggle = () => {
    if (window.matchMedia("(hover: hover)").matches) return;
    setFlipped((current) => !current);
  };

  return (
    <article
      className={`${styles.featureCard} ${flipped ? styles.isFlipped : ""}`}
      onClick={toggle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggle();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${feature.title}. Наведите или нажмите, чтобы увидеть фото`}
    >
      <div className={styles.featureInner}>
        <div className={`${styles.featureFace} ${styles.featureFront}`}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <h3>{feature.title}</h3>
          <p>{feature.text}</p>
          <div className={styles.featureHint}>Наведите, чтобы увидеть фото</div>
        </div>
        <div
          className={`${styles.featureFace} ${styles.featureBack} ${
            feature.imageFit === "contain" ? styles.featureBackContain : ""
          }`}
        >
          <img src={feature.image} alt={feature.imageAlt} />
          <div className={styles.featureCaption}>{feature.title}</div>
        </div>
      </div>
    </article>
  );
}

/** Одна и та же форма заявки: внутри секции расчёта и во всплывающем окне. */
function LeadForm({
  id,
  className,
  submitted,
  sending,
  error,
  onSubmit,
  withHeading = true,
}: {
  id: string;
  className: string;
  submitted: boolean;
  sending: boolean;
  error: string | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  /** В окне заголовок не нужен: он уже есть в шапке окна. */
  withHeading?: boolean;
}) {
  return (
    <form className={className} id={id} onSubmit={onSubmit}>
      {submitted ? (
        <div className={styles.success}>
          <span>
            <Icon name="check" size={28} />
          </span>
          <div>
            <strong>Заявка отправлена</strong>
            <p>
              Менеджер свяжется с вами в течение часа в рабочее время и подтвердит
              цену под ключ и сроки по конкретному автомобилю.
            </p>
          </div>
        </div>
      ) : (
        <>
          {withHeading && (
            <div>
              <small>Бесплатно, без обязательств</small>
              <strong>Получить точный расчёт под ключ</strong>
            </div>
          )}
          <input name="name" placeholder="Ваше имя" autoComplete="name" required />
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            placeholder="Телефон +7 ___ ___-__-__"
            autoComplete="tel"
            required
          />
          <input name="messenger" placeholder="Telegram или WhatsApp (необязательно)" />
          <div className={styles.consent}>
            <input type="checkbox" name="consent" id={`${id}-consent`} required />
            <span>
              <label htmlFor={`${id}-consent`}>
                Согласен на обработку персональных данных
              </label>{" "}
              — <ConsentModalLink />
            </span>
          </div>
          {error && <p className={styles.formError}>{error}</p>}
          <button type="submit" disabled={sending}>
            {sending ? "Отправляем…" : "Отправить заявку"}
            <Icon name="arrow" />
          </button>
        </>
      )}
    </form>
  );
}

export function ModelLanding({
  vehicle,
  lead,
}: {
  vehicle: Vehicle;
  lead: string;
}) {
  const [galleryFilter, setGalleryFilter] = useState("Все");
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  const [panoramaMode, setPanoramaMode] = useState<"exterior" | "interior">(
    "exterior",
  );
  const [city, setCity] = useState<string>(vehicle.cityPrices[0].city);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processVideoOpen, setProcessVideoOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!leadModalOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLeadModalOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [leadModalOpen]);

  const calculation = useMemo(() => {
    const total =
      vehicle.cityPrices.find((entry) => entry.city === city)?.priceRub ??
      vehicle.estimatedPriceRub;
    /* Доставка до города считается надбавкой к базовой цене. */
    const car = 1_315_000;
    const logistics = 245_000 + (total - vehicle.estimatedPriceRub);
    return {
      car,
      logistics,
      customs: total - car - logistics,
      total,
    };
  }, [city, vehicle]);

  /* Клик по городу: подставляем его во все расчёты и открываем форму в окне. */
  function requestCity(nextCity: string) {
    setCity(nextCity);
    setSubmitted(false);
    setError(null);
    setLeadModalOpen(true);
    trackEvent("price_city_click", { city: nextCity, model: vehicle.model });
  }

  const visibleImages =
    galleryFilter === "Все"
      ? vehicle.gallery
      : vehicle.gallery.filter((image) => image.category === galleryFilter);

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams(window.location.search);
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        phone: form.get("phone"),
        messenger: form.get("messenger"),
        consent: form.get("consent") === "on",
        pageUrl: window.location.href,
        referrer: document.referrer,
        utm: Object.fromEntries(
          ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
            .map((key) => [key, params.get(key) ?? ""])
            .filter(([, value]) => value),
        ),
        city,
        model: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
        trim: vehicle.trim,
        estimate: calculation.total,
      }),
    });
    setSending(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Не удалось отправить заявку. Попробуйте позвонить нам.");
      return;
    }

    setSubmitted(true);
    trackEvent("lead_submitted", { city, model: vehicle.model });
  }

  return (
    <div className={styles.site}>
      <div className={styles.modelNav}>
        <div>
          <strong>
            {vehicle.brand} {vehicle.model}
          </strong>
          <nav aria-label="Навигация по модели">
            <a href="#overview">Обзор</a>
            <a href="#gallery">Фото и 360°</a>
            <a href="#specs">Характеристики</a>
            <a href="#calculator">Стоимость</a>
          </nav>
          <a href="#calculator">Получить расчёт</a>
        </div>
      </div>

      <main>
        <section className={styles.hero} id="overview">
          <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
            <Link href="/">Главная</Link> <span>/</span>{" "}
            <Link href="/#models">Каталог</Link> <span>/</span> {vehicle.brand}{" "}
            <span>/</span> {vehicle.model}
          </nav>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <div className={styles.kicker}>
                <span>{vehicle.status}</span>
                <span>{vehicle.year}</span>
              </div>
              <h1>
                {vehicle.brand} <em>{vehicle.model}</em>{" "}
                <span>
                  {vehicle.year} из Китая под ключ — цена, характеристики и
                  доставка
                </span>
              </h1>
              <p className={styles.trim}>{vehicle.trim}</p>
              <p className={styles.lead}>{lead}</p>
              <div className={styles.heroActions}>
                <a className={styles.primaryButton} href="#calculator">
                  Рассчитать под ключ <Icon name="arrow" />
                </a>
                <a className={styles.textButton} href="#gallery">
                  Смотреть фото
                </a>
              </div>
            </div>
            <div className={styles.heroVisual}>
              {/* Licensed source media is intentionally referenced during the local prototype. */}
              <img src={vehicle.gallery[0].src} alt={vehicle.gallery[0].alt} />
              <div className={styles.imageLabel}>
                <span>01</span>
                <div />
                <span>{String(vehicle.gallery.length).padStart(2, "0")}</span>
              </div>
            </div>
            <aside className={styles.priceCard}>
              <span>Ориентир под ключ с ЭПТС</span>
              <div className={styles.priceRule} />
              <ul className={styles.priceCities}>
                {vehicle.cityPrices.map((entry) => (
                  <li key={entry.city}>
                    <button
                      type="button"
                      onClick={() => requestCity(entry.city)}
                      aria-label={`Отправить заявку: ${entry.city}, ${money.format(entry.priceRub)} ₽ под ключ`}
                    >
                      <span>{entry.city}</span>
                      <strong>{money.format(entry.priceRub)} ₽</strong>
                      <em className={styles.cityHint}>
                        Отправить заявку <Icon name="arrow" size={12} />
                      </em>
                    </button>
                  </li>
                ))}
              </ul>
              <dl>
                <div>
                  <dt>Цена в Китае</dt>
                  <dd>от {money.format(vehicle.sourcePriceCny)} ¥</dd>
                </div>
                <div>
                  <dt>Срок доставки</dt>
                  <dd>{vehicle.deliveryDays}</dd>
                </div>
              </dl>
            </aside>
          </div>
          <div className={styles.highlights}>
            {vehicle.highlights.map((item, index) => (
              <div key={item.label}>
                <span>0{index + 1}</span>
                <small>{item.label}</small>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section} id="gallery">
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>Исследуйте автомобиль</span>
              <h2>Фото и панорамы 360°</h2>
            </div>
            <p>
              Экстерьер, салон, сиденья и детали — по разделам, плюс круговые
              панорамы снаружи и внутри. Рассмотрите машину так, будто стоите рядом
              с ней.
            </p>
          </div>
          <div className={styles.galleryTabs} role="tablist" aria-label="Категории фото">
            {galleryCategories.map((category) => (
              <button
                key={category}
                className={galleryFilter === category ? styles.activeTab : ""}
                onClick={() => {
                  setGalleryFilter(category);
                  trackEvent("gallery_filter", { category });
                }}
                role="tab"
                aria-selected={galleryFilter === category}
              >
                {category}
              </button>
            ))}
          </div>
          {visibleImages.length ? (
            <div className={styles.galleryGrid}>
              {visibleImages.map((image, index) => (
                <button
                  className={index === 0 ? styles.galleryFeatured : ""}
                  key={image.src}
                  onClick={() => {
                    setActiveImage(image);
                    trackEvent("gallery_open", { category: image.category });
                  }}
                >
                  <img src={image.src} alt={image.alt} loading="lazy" />
                  <span>
                    <Icon name="camera" /> {image.category}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.emptyGallery}>
              Материалы раздела «{galleryFilter}» будут добавлены после следующего
              импорта.
            </div>
          )}
          <div className={styles.panoramaGrid}>
            <button
              className={panoramaMode === "exterior" ? styles.activePanorama : ""}
              onClick={() => {
                setPanoramaMode("exterior");
                trackEvent("panorama_open", { type: "exterior" });
              }}
            >
              <span className={styles.panoramaIcon}>
                <Icon name="cube" size={30} />
              </span>
              <span>
                <small>VR 360°</small>
                <strong>Экстерьер</strong>
              </span>
              <Icon name="arrow" />
            </button>
            <button
              className={panoramaMode === "interior" ? styles.activePanorama : ""}
              onClick={() => {
                setPanoramaMode("interior");
                trackEvent("panorama_open", { type: "interior" });
              }}
            >
              <span className={styles.panoramaIcon}>
                <Icon name="cube" size={30} />
              </span>
              <span>
                <small>VR 360°</small>
                <strong>Интерьер</strong>
              </span>
              <Icon name="arrow" />
            </button>
          </div>
          <div className={styles.vrViewer}>
            <LocalVrViewer mode={panoramaMode} />
          </div>
        </section>

        <section className={`${styles.section} ${styles.featureSection}`}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>Особенности Guanye</span>
              <h2>Чем интересна эта версия</h2>
            </div>
            <p>
              Оснащение именно этой комплектации — то, что будет в машине, которую
              мы привезём. Каждый пункт сверен с данными завода.
            </p>
          </div>
          <div className={styles.featureGrid}>
            {vehicle.uniqueFeatures.map((feature, index) => (
              <FeatureTile
                key={feature.title}
                feature={feature}
                index={index}
              />
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.specSection}`} id="specs">
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>Комплектация</span>
              <h2>Характеристики комплектации</h2>
            </div>
            <p>
              Все параметры на русском и в привычных единицах: габариты, двигатель,
              расход и оснащение — сравнивайте без переводчика.
            </p>
          </div>
          <div className={styles.specGrid}>
            {vehicle.specifications.map((group, groupIndex) => (
              <details key={group.title} open={groupIndex === 0}>
                <summary>
                  <span>0{groupIndex + 1}</span>
                  {group.title}
                  <b>+</b>
                </summary>
                <dl>
                  {group.items.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            ))}
          </div>
          <p className={styles.sourceNote}>
            Проверено по источникам:{" "}
            {vehicle.researchSources.map((source, index) => (
              <span key={source.url}>
                {index > 0 && " · "}
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.name}
                </a>
              </span>
            ))}
            . Autohome series {vehicle.sourceIds.seriesId}, spec{" "}
            {vehicle.sourceIds.specId}.
          </p>
        </section>

        <section className={styles.process} id="journey">
          <div className={styles.processIntro}>
            <h2>Как проходит покупка и доставка «под ключ»</h2>
            <button
              type="button"
              className={styles.processVideoBtn}
              onClick={() => {
                setProcessVideoOpen(true);
                trackEvent("process_video_open");
              }}
            >
              <Icon name="play" size={14} /> Смотреть видео
            </button>
            <p>
              Показываем каждый этап с отчётами и фото: вы знаете, где ваш
              автомобиль и за что уже заплачены деньги — от подбора в Китае до
              выдачи в вашем городе.
            </p>
          </div>
          <ol className={styles.processList}>
            {purchaseSteps.map((step, index) => (
              <li key={step.title}>
                <span className={styles.processTime}>{step.duration}</span>
                <span className={styles.processIndex}>{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  {step.lead && <p>{step.lead}</p>}
                  {step.bullets && (
                    <ul>
                      {step.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.reviews} id="reviews">
          <div className={styles.reviewHeading}>
            <span className={styles.eyebrow}>Отзывы клиентов</span>
            <h2>Видео-отзывы клиентов</h2>
            <p>
              Клиенты рассказывают сами: какую машину привезли, в какую сумму вышло
              под ключ и сколько ждали доставку.
            </p>
          </div>
          <ReviewCarousel />
          <a className={styles.reviewCta} href="#calculator">
            Хочу так же — посчитать под ключ <Icon name="arrow" />
          </a>
        </section>

        <section className={styles.guarantees} id="guarantees">
          <div className={styles.guaranteeHeading}>
            <span className={styles.eyebrow}>Как мы работаем</span>
            <h2>Гарантии · договор · оплата по этапам</h2>
          </div>
          <div className={styles.guaranteeGrid}>
            {guarantees.map((item) => (
              <article key={item.title}>
                <span className={styles.guaranteeIcon}>
                  <Icon name={item.icon} size={26} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.faqSection}`} id="faq">
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>ЧаВо</span>
              <h2>Часто задаваемые вопросы</h2>
            </div>
            <p>
              Сроки, оплата, документы и проверка автомобиля — собрали ответы на
              вопросы, которые чаще всего задают перед заказом.
            </p>
          </div>
          <div className={styles.faqList}>
            {faq.map((item, index) => (
              <details
                key={item.question}
                open={index === 0}
                onToggle={(event) => {
                  if (event.currentTarget.open) {
                    trackEvent("faq_open", { question: item.question });
                  }
                }}
              >
                <summary>
                  <span className={styles.faqCheck}>
                    <Icon name="check" size={15} />
                  </span>
                  {item.question}
                  <b>+</b>
                </summary>
                <div className={styles.faqAnswer}>
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

        <section className={styles.calculator} id="calculator">
          <div className={styles.calculatorIntro}>
            <span className={styles.eyebrow}>Прозрачная смета</span>
            <h2>Рассчитайте стоимость под ключ</h2>
            <p>
              Выберите город выдачи. Финальную сумму менеджер подтвердит после
              проверки конкретного автомобиля.
            </p>
            <div className={styles.trustLine}>
              <Icon name="shield" />
              <span>Оплата по этапам · договор · отчёты</span>
            </div>
          </div>
          <div className={styles.calculatorPanel}>
            <div className={styles.fields}>
              <label>
                Город выдачи
                <select value={city} onChange={(event) => setCity(event.target.value)}>
                  {vehicle.cityPrices.map((entry) => (
                    <option key={entry.city} value={entry.city}>
                      {entry.city} — {money.format(entry.priceRub)} ₽
                    </option>
                  ))}
                </select>
              </label>
              <div className={styles.fixedField}>
                <span>Способ доставки</span>
                <strong>Автовоз</strong>
                <small>Наземный маршрут</small>
              </div>
            </div>
            <dl className={styles.breakdown}>
              <div>
                <dt>Автомобиль в Китае</dt>
                <dd>{money.format(calculation.car)} ₽</dd>
              </div>
              <div>
                <dt>Логистика и страхование</dt>
                <dd>{money.format(calculation.logistics)} ₽</dd>
              </div>
              <div>
                <dt>Таможня, оформление, услуги</dt>
                <dd>{money.format(calculation.customs)} ₽</dd>
              </div>
            </dl>
            <div className={styles.total}>
              <span>Ориентировочно под ключ</span>
              <strong>{money.format(calculation.total)} ₽</strong>
            </div>
          </div>
          <LeadForm
            id="lead"
            className={styles.leadForm}
            submitted={submitted}
            sending={sending}
            error={error}
            onSubmit={submitLead}
          />
        </section>

        <section className={`${styles.section} ${styles.contactSection}`} id="contacts">
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>Контакты</span>
              <h2>С нами можно связаться</h2>
            </div>
            <p>
              Назовём цену под ключ для вашего города, срок доставки и порядок
              оплаты. Консультация бесплатная, отвечаем в течение часа в рабочее
              время.
            </p>
          </div>
          <div className={styles.contactGrid}>
            {contacts.map((contact) => {
              const body = (
                <>
                  <span className={styles.contactIcon}>
                    <Icon name={contact.icon} size={contact.icon === "phone" ? 20 : 24} />
                  </span>
                  <small>{contact.label}</small>
                  <strong>{contact.value}</strong>
                  <em>{contact.hint}</em>
                </>
              );

              return contact.href ? (
                <a
                  key={contact.label}
                  href={contact.href}
                  target={contact.href.startsWith("http") ? "_blank" : undefined}
                  rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
                  onClick={() => trackEvent("contact_click", { channel: contact.label })}
                >
                  {body}
                </a>
              ) : (
                <div key={contact.label}>{body}</div>
              );
            })}
          </div>
        </section>
      </main>

      <a className={styles.mobileCta} href="#calculator">
        Рассчитать под ключ <Icon name="arrow" />
      </a>

      {/* Окно заявки: цена и город в нём всегда равны выбранным в расчёте. */}
      {leadModalOpen &&
        mounted &&
        createPortal(
          <div
            className={styles.leadModal}
            role="dialog"
            aria-modal="true"
            aria-label="Отправить заявку"
            onClick={() => setLeadModalOpen(false)}
          >
            <div
              className={styles.leadModalPanel}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className={styles.leadModalClose}
                type="button"
                onClick={() => setLeadModalOpen(false)}
                aria-label="Закрыть"
              >
                ×
              </button>
              <div className={styles.leadModalHead}>
                <small>Заявка на расчёт</small>
                <h3>
                  {vehicle.brand} {vehicle.model} {vehicle.year}
                </h3>
                <p>{vehicle.trim}</p>
              </div>
              <div className={styles.leadModalPrice}>
                <label>
                  Город выдачи
                  <select
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                  >
                    {vehicle.cityPrices.map((entry) => (
                      <option key={entry.city} value={entry.city}>
                        {entry.city}
                      </option>
                    ))}
                  </select>
                </label>
                <div>
                  <small>Под ключ с ЭПТС</small>
                  <strong>{money.format(calculation.total)} ₽</strong>
                </div>
              </div>
              <LeadForm
                id="lead-modal"
                className={`${styles.leadForm} ${styles.leadFormModal}`}
                submitted={submitted}
                sending={sending}
                error={error}
                onSubmit={submitLead}
                withHeading={false}
              />
            </div>
          </div>,
          document.body,
        )}

      {processVideoOpen && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Как проходит покупка и доставка под ключ"
          onClick={() => setProcessVideoOpen(false)}
        >
          <button onClick={() => setProcessVideoOpen(false)} aria-label="Закрыть">
            ×
          </button>
          <div className={styles.processPlayer} onClick={(event) => event.stopPropagation()}>
            <iframe
              src={`${purchaseVideo.embed}&autoplay=1`}
              title="Как проходит покупка и доставка под ключ"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
