"use client";

/* Постеры отзывов отдаёт VK CDN, поэтому оптимизация Next.js здесь не нужна. */
/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";
import { videoReviews, type VideoReview } from "@/data/company";
import { trackEvent } from "@/lib/track";
import styles from "./model-landing.module.css";

export function ReviewCarousel() {
  const [playing, setPlaying] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("article");
    const width = card instanceof HTMLElement ? card.offsetWidth + 12 : 360;
    track.scrollBy({ left: direction * width, behavior: "smooth" });
  };

  const play = (review: VideoReview) => {
    setPlaying(review.id);
    trackEvent("review_play", { id: review.id });
  };

  return (
    <div className={styles.reviewWrap}>
      <button
        className={styles.reviewNav}
        onClick={() => scrollByCard(-1)}
        aria-label="Предыдущие отзывы"
        type="button"
      >
        <Arrow />
      </button>
      <div className={styles.reviewTrack} ref={trackRef}>
        {videoReviews.map((review) => (
          <article key={review.id} className={styles.reviewCard}>
            {playing === review.id ? (
              <iframe
                src={`${review.embed}&autoplay=1`}
                title={`Видео-отзыв клиента CHE168 ${review.id}`}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => play(review)}
                aria-label="Смотреть видео-отзыв"
              >
                <img src={review.poster} alt="Видео-отзыв клиента CHE168" />
                <span className={styles.reviewPlay}>
                  <svg
                    aria-hidden="true"
                    width={22}
                    height={22}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7Z" />
                  </svg>
                </span>
              </button>
            )}
          </article>
        ))}
      </div>
      <button
        className={`${styles.reviewNav} ${styles.reviewNavNext}`}
        onClick={() => scrollByCard(1)}
        aria-label="Следующие отзывы"
        type="button"
      >
        <Arrow />
      </button>
    </div>
  );
}

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
