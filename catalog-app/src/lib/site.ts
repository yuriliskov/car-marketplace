const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const site = {
  name: "CHE168 Group",
  tagline: "Автомобили из Китая",
  url: configuredUrl ?? "http://localhost:3000",
  /* Основной сайт компании на Bitrix24 — шапка ведёт «Главную» туда. */
  mainSite: "https://che168.group/",
  /* Промо-ссылка на этот каталог (стенд / прод), не на Bitrix. */
  mainCatalog: configuredUrl
    ? `${configuredUrl}/`
    : "https://yuriliskov.github.io/car-marketplace/",
  phone: "+7 921 100-40-02",
  phoneHref: "tel:+79211004002",
  telegram: "https://t.me/chepoint",
  max: "https://max.ru/id390519791007_biz",
  email: "che168.group@gmail.com",
  office: "Калининград, Каменная 17",
};

/**
 * Пока сайт живёт на localhost, поисковым роботам он закрыт.
 * NEXT_PUBLIC_NOINDEX=1 закрывает индексацию и на реальном домене —
 * нужно для превью-стендов, которые не должны попадать в поиск.
 */
export const isIndexable =
  Boolean(configuredUrl && !/localhost|127\.0\.0\.1/.test(configuredUrl)) &&
  process.env.NEXT_PUBLIC_NOINDEX !== "1";

export function absoluteUrl(path: string) {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
