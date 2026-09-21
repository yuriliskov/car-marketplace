import type { Metadata } from "next";
import { ConsentText } from "@/components/consent-modal";
import { consent } from "@/data/consent";
import { absoluteUrl } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: consent.title,
  description:
    "Условия обработки персональных данных, которые вы принимаете при отправке заявки на подбор автомобиля.",
  alternates: { canonical: absoluteUrl("/privacy") },
};

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <h1>{consent.title}</h1>
      <div className={styles.text}>
        <ConsentText />
      </div>
    </main>
  );
}
