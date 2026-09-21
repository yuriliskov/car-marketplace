import type { Metadata } from "next";
import { AnchorScroll } from "@/components/anchor-scroll";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { isIndexable, site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Автомобили из Китая под ключ — подбор, проверка, доставка | CHE168",
    template: "%s | CHE168",
  },
  description:
    "Привезём автомобиль из Китая под ключ: подбор, видеоинспекция, логистика, таможня и ЭПТС. Каталог моделей с характеристиками, галереей и панорамами 360°.",
  applicationName: site.name,
  robots: {
    index: isIndexable,
    follow: isIndexable,
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "ru_RU",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body>
        <ScrollToTop />
        <AnchorScroll />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
