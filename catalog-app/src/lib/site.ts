const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const site = {
  name: "CHE168 Group",
  tagline: "Автомобили из Китая",
  url: configuredUrl ?? "http://localhost:3000",
  /* Основной сайт компании на Bitrix24 — шапка ведёт «Главную» туда. */
  mainSite: "https://che168.group/",
  mainCatalog: "https://che168.group/avto-iz-kitaya/",
  phone: "+7 921 100-40-02",
  phoneHref: "tel:+79211004002",
  telegram: "https://t.me/chepoint",
  max: "https://max.ru/id390519791007_biz",
  email: "che168.group@gmail.com",
  office: "Калининград, Каменная 17",
};

/* Пока сайт живёт на localhost, поисковым роботам он закрыт. */
export const isIndexable = Boolean(
  configuredUrl && !/localhost|127\.0\.0\.1/.test(configuredUrl),
);

export function absoluteUrl(path: string) {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
