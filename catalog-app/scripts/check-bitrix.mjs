/* Диагностика интеграции: печатает только домен, коды ошибок и наши собственные лиды. */
const raw = (process.env.BITRIX24_WEBHOOK_URL ?? "").trim().replace(/^['"]|['"]$/g, "");

if (!raw) {
  console.log("BITRIX24_WEBHOOK_URL пуст");
  process.exit(0);
}

const base = raw.replace(/\/?$/, "/");
const parsed = new URL(base);
const segments = parsed.pathname.split("/").filter(Boolean);

console.log("домен:", parsed.host, "| user id:", segments[1], "| длина токена:", segments[2]?.length ?? 0);

async function call(method, params) {
  const response = await fetch(`${base}${method}.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params ?? {}),
    signal: AbortSignal.timeout(15_000),
  });
  const data = await response.json().catch(() => ({}));
  if (data.error) throw new Error(`${data.error}: ${data.error_description ?? ""}`);
  return data.result;
}

try {
  await call("profile");
  console.log("доступ: OK");

  /* Берём только лиды, созданные этой интеграцией. */
  const leads = await call("crm.lead.list", {
    filter: { "%TITLE": "Заявка из каталога" },
    select: ["ID", "TITLE", "NAME", "SOURCE_ID", "ASSIGNED_BY_ID", "OPPORTUNITY", "DATE_CREATE"],
    order: { ID: "DESC" },
    start: 0,
  });

  console.log("лидов из каталога:", leads.length);
  for (const lead of leads.slice(0, 3)) {
    console.log(
      `#${lead.ID} | ${lead.TITLE} | источник=${lead.SOURCE_ID} | ответственный=${lead.ASSIGNED_BY_ID} | сумма=${lead.OPPORTUNITY} | ${lead.DATE_CREATE}`,
    );
  }
} catch (error) {
  console.log("ошибка:", error.message);
}
