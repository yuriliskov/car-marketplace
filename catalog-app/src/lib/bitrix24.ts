const rawWebhook = process.env.BITRIX24_WEBHOOK_URL?.trim() ?? "";

/* Пустая или некорректная переменная = интеграция просто выключена. */
const webhook = /^https?:\/\/\S+\/rest\//.test(rawWebhook)
  ? rawWebhook.replace(/\/?$/, "/")
  : "";

export const bitrixConfigured = Boolean(webhook);

export type BitrixLeadFields = Record<string, unknown>;

type BitrixResponse = {
  result?: number;
  error?: string;
  error_description?: string;
};

/**
 * Создаёт лид в облачном Bitrix24 через входящий вебхук.
 * Токен живёт только в BITRIX24_WEBHOOK_URL на сервере и не уходит в браузер.
 */
export async function createBitrixLead(fields: BitrixLeadFields) {
  if (!webhook) {
    throw new Error("BITRIX24_WEBHOOK_URL не задан");
  }

  const response = await fetch(`${webhook}crm.lead.add.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields,
      params: { REGISTER_SONET_EVENT: "Y" },
    }),
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as BitrixResponse;

  if (!response.ok || data.error || typeof data.result !== "number") {
    throw new Error(
      data.error_description ?? data.error ?? `Bitrix24 ответил ${response.status}`,
    );
  }

  return data.result;
}
