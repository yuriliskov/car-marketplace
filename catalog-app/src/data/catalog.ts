import { geelyCowboy, type Vehicle } from "./vehicle";

export type CatalogModel = {
  /** Часть URL: /cars/<slug>. Менять нельзя — на него ссылаются роботы. */
  slug: string;
  /** Короткая подпись для промо-строки в шапке. */
  navLabel: string;
  title: string;
  description: string;
  summary: string;
  updated: string;
  vehicle: Vehicle;
};

/**
 * Единый реестр страниц моделей. Добавили модель сюда — она сама появилась
 * в промо-строке шапки, в футере, в каталоге на главной и в sitemap.xml.
 */
/* Цены в текстах берём из данных модели, чтобы описания не устаревали. */
const price = (value: number) => new Intl.NumberFormat("ru-RU").format(value);

export const catalogModels: CatalogModel[] = [
  {
    slug: "geely-cowboy",
    navLabel: "Новый Geely Cowboy 2026",
    title: "Geely Cowboy 2026 из Китая под ключ — цена, фото, 360°",
    description: `Geely Cowboy 2026 1.5TD Guanye под ключ от ${price(geelyCowboy.estimatedPriceRub)} ₽: цены для Москвы, Санкт-Петербурга и Калининграда, фото, панорамы 360°, характеристики и доставка ${geelyCowboy.deliveryDays}.`,
    summary: `Компактный кроссовер с экраном Flyme Auto 14,6″, круговым обзором 540° и ассистентами L2 — под ключ от ${price(geelyCowboy.estimatedPriceRub)} ₽, доставка ${geelyCowboy.deliveryDays}.`,
    updated: "2026-09-21",
    vehicle: geelyCowboy,
  },
];

export function modelPath(slug: string) {
  return `/cars/${slug}`;
}

export function findModel(slug: string) {
  return catalogModels.find((entry) => entry.slug === slug);
}

export function modelHeadline(entry: CatalogModel) {
  return `${entry.vehicle.brand} ${entry.vehicle.model}`;
}
