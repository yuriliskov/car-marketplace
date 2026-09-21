"use client";

import { FormEvent, useState } from "react";
import { ConsentModalLink } from "@/components/consent-modal";
import { Icon } from "@/components/icon";
import { carBrands, contactMethods } from "@/data/request-form";
import { trackEvent } from "@/lib/track";
import styles from "./request-form.module.css";

const utmKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

export function RequestForm() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams(window.location.search);

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand: form.get("brand"),
        model: form.get("model"),
        budget: form.get("budget"),
        city: form.get("city"),
        phone: form.get("phone"),
        contactMethod: form.get("contactMethod"),
        consent: form.get("consent") === "on",
        source: "Заказать расчёт (главная)",
        pageUrl: window.location.href,
        referrer: document.referrer,
        utm: Object.fromEntries(
          utmKeys
            .map((key) => [key, params.get(key) ?? ""])
            .filter(([, value]) => value),
        ),
      }),
    });

    setSending(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Не удалось отправить заявку. Попробуйте позвонить нам.");
      return;
    }

    setSubmitted(true);
    trackEvent("request_form_submitted", { brand: form.get("brand") });
  }

  if (submitted) {
    return (
      <div className={styles.success}>
        <span>
          <Icon name="check" size={30} />
        </span>
        <div>
          <strong>Заявка отправлена</strong>
          <p>
            Менеджер подберёт варианты по вашему бюджету и пришлёт расчёт под ключ
            удобным вам способом — в течение часа в рабочее время.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.grid}>
        <label>
          <span>Марка автомобиля</span>
          <select name="brand" defaultValue="" required>
            <option value="" disabled>
              Выберите марку
            </option>
            {carBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Модель автомобиля</span>
          <input name="model" placeholder="Например, Monjaro" />
        </label>
        <label>
          <span>Бюджет, РУБ</span>
          <input name="budget" inputMode="numeric" placeholder="До 3 000 000" />
        </label>
        <label>
          <span>Город доставки</span>
          <input name="city" placeholder="Москва" />
        </label>
        <label>
          <span>
            Телефон <b aria-hidden="true">*</b>
          </span>
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 ___ ___-__-__"
            required
          />
        </label>
        <label>
          <span>Удобный способ связи</span>
          <select name="contactMethod" defaultValue={contactMethods[0]}>
            {contactMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.consent}>
        <input type="checkbox" name="consent" id="request-consent" required />
        <span>
          <label htmlFor="request-consent">
            Нажимая «Получить расчёт», я даю согласие на обработку персональных
            данных в соответствии с Федеральным законом № 152-ФЗ от 27.07.2006
          </label>{" "}
          — <ConsentModalLink />
        </span>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" disabled={sending}>
        {sending ? "Отправляем…" : "Получить расчёт"}
        <Icon name="arrow" />
      </button>
    </form>
  );
}
