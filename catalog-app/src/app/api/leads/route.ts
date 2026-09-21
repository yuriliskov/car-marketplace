import { NextResponse } from "next/server";
import { bitrixConfigured, createBitrixLead } from "@/lib/bitrix24";
import { appendLocalRecord } from "@/lib/local-store";

type LeadPayload = {
  name?: unknown;
  phone?: unknown;
  messenger?: unknown;
  city?: unknown;
  brand?: unknown;
  model?: unknown;
  trim?: unknown;
  budget?: unknown;
  contactMethod?: unknown;
  source?: unknown;
  estimate?: unknown;
  consent?: unknown;
  pageUrl?: unknown;
  referrer?: unknown;
  utm?: unknown;
};

const utmKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

/** Приводим телефон к формату +7XXXXXXXXXX, чтобы работал поиск дублей в CRM. */
function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && /^[78]/.test(digits)) return `+7${digits.slice(1)}`;
  if (digits.length === 10) return `+7${digits}`;
  if (digits.length >= 11 && digits.length <= 15) return `+${digits}`;
  return null;
}

function readUtm(value: unknown) {
  const source = typeof value === "object" && value ? (value as Record<string, unknown>) : {};
  const result: Record<string, string> = {};
  for (const key of utmKeys) {
    const text = cleanText(source[key], 200);
    if (text) result[key] = text;
  }
  return result;
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as LeadPayload;

  const name = cleanText(payload.name, 80);
  const phone = normalizePhone(cleanText(payload.phone, 40));
  const messenger = cleanText(payload.messenger, 120);
  const city = cleanText(payload.city, 80);
  const brand = cleanText(payload.brand, 80);
  const model = cleanText(payload.model, 120);
  const trim = cleanText(payload.trim, 120);
  const budget = cleanText(payload.budget, 40);
  const contactMethod = cleanText(payload.contactMethod, 60);
  const source = cleanText(payload.source, 120);
  const pageUrl = cleanText(payload.pageUrl, 500);
  const referrer = cleanText(payload.referrer, 500);
  const utm = readUtm(payload.utm);
  const estimate =
    typeof payload.estimate === "number" && Number.isFinite(payload.estimate)
      ? payload.estimate
      : null;
  /* Бюджет приходит текстом («до 3 000 000»), в сделку пишем только число. */
  const budgetAmount = Number(budget.replace(/\D/g, "")) || null;
  const opportunity = estimate ?? budgetAmount;
  const car = [brand, model].filter(Boolean).join(" ");

  /* Имя есть только в форме на странице модели, поэтому проверяем его условно. */
  if (name && name.length < 2) {
    return NextResponse.json({ error: "Укажите имя." }, { status: 400 });
  }
  if (!phone) {
    return NextResponse.json(
      { error: "Проверьте номер телефона." },
      { status: 400 },
    );
  }
  if (payload.consent !== true) {
    return NextResponse.json(
      { error: "Нужно согласие на обработку персональных данных." },
      { status: 400 },
    );
  }

  const comments = [
    brand && `Марка: ${brand}`,
    model && `Модель: ${model}`,
    trim && `Комплектация: ${trim}`,
    budget && `Бюджет: ${budget} ₽`,
    city && `Город доставки: ${city}`,
    estimate && `Ориентир под ключ: ${estimate.toLocaleString("ru-RU")} ₽`,
    contactMethod && `Удобный способ связи: ${contactMethod}`,
    messenger && `Мессенджер: ${messenger}`,
    source && `Форма: ${source}`,
    pageUrl && `Страница: ${pageUrl}`,
    referrer && `Источник перехода: ${referrer}`,
  ]
    .filter(Boolean)
    .join("\n");

  let crmLeadId: number | null = null;
  let crmError: string | null = null;

  if (bitrixConfigured) {
    try {
      crmLeadId = await createBitrixLead({
        TITLE: `Заявка из каталога: ${car || "автомобиль из Китая"}${city ? ` — ${city}` : ""}`,
        ...(name ? { NAME: name } : {}),
        PHONE: [{ VALUE: phone, VALUE_TYPE: "MOBILE" }],
        COMMENTS: comments,
        SOURCE_ID: process.env.BITRIX24_SOURCE_ID?.trim() || "WEB",
        SOURCE_DESCRIPTION: source || pageUrl || "Каталог моделей",
        CURRENCY_ID: "RUB",
        ...(opportunity ? { OPPORTUNITY: opportunity } : {}),
        ...(process.env.BITRIX24_ASSIGNED_BY_ID
          ? { ASSIGNED_BY_ID: Number(process.env.BITRIX24_ASSIGNED_BY_ID) }
          : {}),
        ...(utm.utm_source ? { UTM_SOURCE: utm.utm_source } : {}),
        ...(utm.utm_medium ? { UTM_MEDIUM: utm.utm_medium } : {}),
        ...(utm.utm_campaign ? { UTM_CAMPAIGN: utm.utm_campaign } : {}),
        ...(utm.utm_content ? { UTM_CONTENT: utm.utm_content } : {}),
        ...(utm.utm_term ? { UTM_TERM: utm.utm_term } : {}),
      });
    } catch (error) {
      crmError = error instanceof Error ? error.message : "Неизвестная ошибка";
      console.error("Bitrix24 crm.lead.add:", crmError);
    }
  }

  /* Локальная копия остаётся всегда: если CRM недоступна, заявка не теряется. */
  const id = await appendLocalRecord("leads", {
    name,
    phone,
    messenger,
    city,
    brand,
    model,
    trim,
    budget,
    contactMethod,
    source,
    estimate,
    consent: true,
    pageUrl,
    referrer,
    utm,
    crmLeadId,
    crmError,
    crmConfigured: bitrixConfigured,
  });

  return NextResponse.json(
    {
      ok: true,
      id,
      crm: crmLeadId ? "created" : bitrixConfigured ? "deferred" : "disabled",
    },
    { status: 201 },
  );
}
