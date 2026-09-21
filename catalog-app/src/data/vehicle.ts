export type GalleryCategory = "Все" | "Экстерьер" | "Интерьер" | "Сиденья" | "Детали";

export type GalleryImage = {
  src: string;
  alt: string;
  category: Exclude<GalleryCategory, "Все">;
  sourceUrl: string;
};

export type UniqueFeature = {
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  imageFit?: "cover" | "contain";
};

export const geelyCowboy = {
  brand: "Geely",
  model: "Cowboy",
  localName: "吉利牛仔",
  trim: "2026 1.5TD Guanye",
  body: "Компактный кроссовер",
  year: 2026,
  status: "Под заказ",
  sourcePriceCny: 90_900,
  /* Цена под ключ в базовом городе выдачи (Москва). */
  estimatedPriceRub: 2_350_000,
  cityPrices: [
    { city: "Москва", priceRub: 2_350_000 },
    { city: "Санкт-Петербург", priceRub: 2_380_000 },
    { city: "Калининград", priceRub: 2_430_000 },
  ],
  deliveryDays: "25–35 дней",
  powerHp: 155,
  transmission: "7DCT",
  drive: "Передний",
  fuel: "Бензин",
  sourceIds: {
    seriesId: 7903,
    specId: 77944,
  },
  sourceUrl: "https://www.autohome.com.cn/spec/77944/",
  galleryUrl:
    "https://www.autohome.com.cn/cars/imglist-x-x-7903-77944-x-x-x-x-x-1.html",
  panorama: {
    exterior: "/vr/77944/exterior/",
    interior: "/vr/77944/interior/",
    sourceExterior: "https://pano.autohome.com.cn/car/ext/77944",
    sourceInterior: "https://pano.autohome.com.cn/car/pano/77944",
  },
  highlights: [
    { label: "Двигатель", value: "1.5 л · турбо" },
    { label: "Мощность", value: "155 л.с." },
    { label: "Коробка", value: "7-ступ. робот" },
    { label: "Привод", value: "Передний" },
  ],
  uniqueFeatures: [
    {
      title: "Flyme Auto",
      text: "14,6-дюймовый экран, голосовое управление и интеграция навигации.",
      image: "/features/flyme.jpg",
      imageAlt: "Интерфейс Flyme Auto на 14,6-дюймовом экране Geely Cowboy",
    },
    {
      title: "Обзор 540°",
      text: "Круговые камеры дополнены режимом прозрачного шасси на 180°.",
      image: "/features/surround.jpg",
      imageAlt: "Экран кругового обзора 360° с видом сверху и сзади",
    },
    {
      title: "L2 для Guanye",
      text: "ICC, удержание в полосе, распознавание знаков и активное торможение.",
      image: "/features/adas.jpg",
      imageAlt: "Адаптивный круиз ICC: Cowboy держит дистанцию до впереди идущего авто",
    },
    {
      title: "Комфорт переднего ряда",
      text: "Обогрев обоих кресел, электрорегулировка водителя в 6 направлениях и пассажира в 4.",
      image: "/features/comfort.jpg",
      imageAlt: "Подогрев передних сидений Geely Cowboy",
    },
    {
      title: "Независимая подвеска",
      text: "MacPherson спереди и многорычажная схема сзади с амортизаторами RS.",
      image: "/features/suspension.jpg",
      imageAlt: "Схема независимой подвески MacPherson и многорычажной задней оси",
      imageFit: "contain",
    },
    {
      title: "Практичный багажник",
      text: "Около 340 л и до 1100 л при сложенном втором ряду.",
      image: "/features/trunk.jpg",
      imageAlt: "Багажник со сложенным вторым рядом — ровная площадка до 1100 л",
    },
  ] satisfies UniqueFeature[],
  researchSources: [
    {
      kind: "manufacturer",
      name: "Geely China",
      url: "https://icon.geely.com/jlnz",
      usedFor: "Комплектация, технологии, официальная цена и силовая установка",
    },
    {
      kind: "catalog",
      name: "Autohome",
      url: "https://www.autohome.com.cn/spec/77944/",
      usedFor: "Идентификаторы комплектации, характеристики, фото и VR",
    },
    {
      kind: "catalog",
      name: "CARMU",
      url: "https://www.carmucn.com/features/118800",
      usedFor: "Технические параметры и гарантия",
    },
    {
      kind: "market",
      name: "Drom",
      url: "https://geely.drom.ru/cowboy/",
      usedFor: "Российский контекст, объём багажника и позиционирование",
    },
    {
      kind: "importer",
      name: "Infocar",
      url: "https://infocar.group/catalog/geely/cowboy",
      usedFor: "Диапазон российских цен и сроков доставки",
    },
  ],
  gallery: [
    {
      src: "https://g.autoimg.cn/@img/car3/cardfs/product/g34/M07/BF/B0/560x420_c42_autohomecar__ChxpV2pXHYuAOvAxAB8_dnUWXtA099.jpg",
      alt: "Geely Cowboy — вид спереди",
      category: "Экстерьер",
      sourceUrl:
        "https://www.autohome.com.cn/cars/imgs-7903-77944-1-x/13246682.html",
    },
    {
      src: "https://g.autoimg.cn/@img/car3/cardfs/product/g34/M04/BC/F9/560x420_c42_autohomecar__ChtpWGpXHYqASN57ABqLyI3zI2I904.jpg",
      alt: "Geely Cowboy — вид сбоку",
      category: "Экстерьер",
      sourceUrl:
        "https://www.autohome.com.cn/cars/imgs-7903-77944-1-x/13246681.html",
    },
    {
      src: "https://g.autoimg.cn/@img/car2/cardfs/product/g34/M05/BF/B0/560x420_c42_autohomecar__ChxpV2pXHYuAB6i1AB9u21i-Qc4627.jpg",
      alt: "Geely Cowboy — вид сзади",
      category: "Экстерьер",
      sourceUrl:
        "https://www.autohome.com.cn/cars/imgs-7903-77944-1-x/13246680.html",
    },
    {
      src: "https://car2.autoimg.cn/cardfs/product/g34/M0A/BC/F9/1400x1050_autohomecar__ChtpWGpXHYqAOxljAB-ADbPEJnI718.jpg",
      alt: "Geely Cowboy — передняя часть кузова",
      category: "Экстерьер",
      sourceUrl:
        "https://www.autohome.com.cn/cars/imgs-7903-77944-1-x/13246678.html",
    },
    {
      src: "https://car3.autoimg.cn/cardfs/product/g34/M02/BF/BB/1400x1050_autohomecar__ChxpWGpXHYuAdtG_ABqx3kNUu8w876.jpg",
      alt: "Geely Cowboy — профиль кузова",
      category: "Экстерьер",
      sourceUrl:
        "https://www.autohome.com.cn/cars/imgs-7903-77944-1-x/13246677.html",
    },
    {
      src: "https://car2.autoimg.cn/cardfs/product/g34/M03/BF/BB/1400x1050_autohomecar__ChxpWGpXHYuAcyydAB_zQcLbhOA761.jpg",
      alt: "Geely Cowboy — задняя часть кузова",
      category: "Экстерьер",
      sourceUrl:
        "https://www.autohome.com.cn/cars/imgs-7903-77944-1-x/13246676.html",
    },
    {
      src: "https://car2.autoimg.cn/cardfs/product/g34/M09/BC/FB/1400x1050_autohomecar__ChtpWGpXHaSASeo9ACSh2OjlKVc527.jpg",
      alt: "Интерьер Geely Cowboy — передняя панель",
      category: "Интерьер",
      sourceUrl:
        "https://www.autohome.com.cn/cars/imgs-7903-77944-10-x/13246771.html",
    },
    {
      src: "https://car2.autoimg.cn/cardfs/product/g34/M0A/BF/BD/1400x1050_autohomecar__ChxpWGpXHaWAXBprACqpLwYGZ2M408.jpg",
      alt: "Интерьер Geely Cowboy — водительское место",
      category: "Интерьер",
      sourceUrl:
        "https://www.autohome.com.cn/cars/imgs-7903-77944-10-x/13246770.html",
    },
    {
      src: "https://car3.autoimg.cn/cardfs/product/g33/M01/C2/7E/1400x1050_autohomecar__Chto52pXHaSAPqXvACaVWMIvS3U946.jpg",
      alt: "Интерьер Geely Cowboy — мультимедиа",
      category: "Интерьер",
      sourceUrl:
        "https://www.autohome.com.cn/cars/imgs-7903-77944-10-x/13246769.html",
    },
    {
      src: "https://car2.autoimg.cn/cardfs/product/g33/M06/C2/65/1400x1050_autohomecar__ChxpVmpXHaOAIv0JABQEdsEe_BY355.jpg",
      alt: "Интерьер Geely Cowboy — центральная консоль",
      category: "Интерьер",
      sourceUrl:
        "https://www.autohome.com.cn/cars/imgs-7903-77944-10-x/13246767.html",
    },
    {
      src: "https://car2.autoimg.cn/cardfs/product/g34/M08/BC/FB/1400x1050_autohomecar__ChtpWGpXHaSACcz9ACctlEnz84Q455.jpg",
      alt: "Интерьер Geely Cowboy — приборная панель",
      category: "Интерьер",
      sourceUrl:
        "https://www.autohome.com.cn/cars/imgs-7903-77944-10-x/13246766.html",
    },
    {
      src: "https://car2.autoimg.cn/cardfs/product/g34/M08/BC/FA/1400x1050_autohomecar__ChtpWGpXHaKAY_a0ABhRQyc44jw862.jpg",
      alt: "Интерьер Geely Cowboy — задняя часть салона",
      category: "Интерьер",
      sourceUrl:
        "https://www.autohome.com.cn/cars/imgs-7903-77944-10-x/13246765.html",
    },
    {
      src: "https://car2.autoimg.cn/cardfs/product/g33/M05/C2/65/1400x1050_autohomecar__ChxpVmpXHayACuYZACW_kPchqGs521.jpg",
      alt: "Сиденья Geely Cowboy",
      category: "Сиденья",
      sourceUrl:
        "https://www.autohome.com.cn/cars/imgs-7903-77944-3-x/13246727.html",
    },
    {
      src: "https://car2.autoimg.cn/cardfs/product/g34/M04/BC/FB/1400x1050_autohomecar__ChtpWGpXHayAD7utACiS51ch_0g441.jpg",
      alt: "Передние сиденья Geely Cowboy",
      category: "Сиденья",
      sourceUrl:
        "https://www.autohome.com.cn/cars/imgs-7903-77944-3-x/13246726.html",
    },
    {
      src: "https://car3.autoimg.cn/cardfs/product/g34/M00/BF/B2/1400x1050_autohomecar__ChxpV2pXHauAURlXAB0jrdSErqo891.jpg",
      alt: "Задний ряд Geely Cowboy",
      category: "Сиденья",
      sourceUrl:
        "https://www.autohome.com.cn/cars/imgs-7903-77944-3-x/13246725.html",
    },
    {
      src: "https://car2.autoimg.cn/cardfs/product/g34/M0B/BF/B2/1400x1050_autohomecar__ChxpV2pXHauADVSbAButZsJOXEM798.jpg",
      alt: "Отделка сидений Geely Cowboy",
      category: "Сиденья",
      sourceUrl:
        "https://www.autohome.com.cn/cars/imgs-7903-77944-3-x/13246723.html",
    },
    {
      src: "https://car2.autoimg.cn/cardfs/product/g34/M0B/BF/BC/1400x1050_autohomecar__ChxpWGpXHZaAMq6MACULZZrY3_s725.jpg",
      alt: "Деталь экстерьера Geely Cowboy",
      category: "Детали",
      sourceUrl:
        "https://www.autohome.com.cn/cars/imgs-7903-77944-12-x/13246674.html",
    },
    {
      src: "https://car3.autoimg.cn/cardfs/product/g34/M00/BF/B1/1400x1050_autohomecar__ChxpV2pXHZWAMHDrACjUS5neFSk786.jpg",
      alt: "Оптика Geely Cowboy",
      category: "Детали",
      sourceUrl:
        "https://www.autohome.com.cn/cars/imgs-7903-77944-12-x/13246673.html",
    },
    {
      src: "https://car2.autoimg.cn/cardfs/product/g34/M04/BC/FA/1400x1050_autohomecar__ChtpWGpXHZWAO5CeACYWG6s-KAc855.jpg",
      alt: "Колёсный диск Geely Cowboy",
      category: "Детали",
      sourceUrl:
        "https://www.autohome.com.cn/cars/imgs-7903-77944-12-x/13246672.html",
    },
  ] satisfies GalleryImage[],
  specifications: [
    {
      title: "Основные параметры",
      items: [
        ["Класс", "Компактный SUV"],
        ["Год модели", "2026"],
        ["Двигатель", "1.5TD, бензин"],
        ["Мощность", "155 л.с."],
        ["Крутящий момент", "290 Н·м"],
        ["Коробка передач", "7-ступенчатая роботизированная"],
        ["Максимальная скорость", "200 км/ч"],
        ["WLTC расход", "6,97 л/100 км"],
        ["Гарантия в Китае", "4 года / 100 000 км"],
      ],
    },
    {
      title: "Размеры и кузов",
      items: [
        ["Длина × ширина × высота", "4442 × 1860 × 1770 мм"],
        ["Колёсная база", "2640 мм"],
        ["Количество дверей", "5"],
        ["Количество мест", "5"],
        ["Тип привода", "Передний"],
        ["Снаряжённая масса", "1395 кг"],
        ["Топливный бак", "51 л"],
        ["Багажник", "около 340–1100 л"],
      ],
    },
    {
      title: "Оснащение",
      items: [
        ["Камеры", "Круговой обзор 360°"],
        ["Климат", "Автоматический климат-контроль"],
        ["Мультимедиа", "14,6″, Flyme Auto"],
        ["Приборная панель", "8,8″ цифровая"],
        ["Ассистенты", "L2, ICC, удержание в полосе"],
        ["Передние сиденья", "Электрорегулировка и обогрев"],
        ["Атмосферная подсветка", "256 цветов"],
      ],
    },
  ],
} as const;

export type Vehicle = typeof geelyCowboy;

export const galleryCategories: GalleryCategory[] = [
  "Все",
  "Экстерьер",
  "Интерьер",
  "Сиденья",
  "Детали",
];
