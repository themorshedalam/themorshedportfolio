"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type PrayerTimes = {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

/**
 * Prayer times for Dubai.
 * Fetches from Aladhan API based on Dubai coordinates.
 * Shows on desktop (bottom right of homepage) and mobile (below Quran verse).
 */
export function PrayerTimes({ compact = false }: { compact?: boolean }) {
  const [prayers, setPrayers] = useState<PrayerTimes | null>(null);
  const [nextPrayer, setNextPrayer] = useState<string>("");

  useEffect(() => {
    // Dubai coordinates: 25.2048, 55.2708
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    fetch(
      `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=25.2048&longitude=55.2708&method=2`
    )
      .then((res) => res.json())
      .then((data) => {
        const t = data.data.timings;
        const formatTime = (time: string) => {
          const [h, m] = time.split(":");
          const hour = parseInt(h);
          const ampm = hour >= 12 ? "PM" : "AM";
          const h12 = hour % 12 || 12;
          return `${h12}:${m} ${ampm}`;
        };
        const p: PrayerTimes = {
          Fajr: formatTime(t.Fajr),
          Dhuhr: formatTime(t.Dhuhr),
          Asr: formatTime(t.Asr),
          Maghrib: formatTime(t.Maghrib),
          Isha: formatTime(t.Isha),
        };
        setPrayers(p);

        // Find next prayer
        const now = new Date();
        const dubaiHour = parseInt(
          new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Dubai",
            hour: "2-digit",
            hour12: false,
          }).format(now)
        );
        const dubaiMin = parseInt(
          new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Dubai",
            minute: "2-digit",
          }).format(now)
        );
        const nowMin = dubaiHour * 60 + dubaiMin;

        const prayerTimes = [
          { name: "Fajr", time: t.Fajr },
          { name: "Dhuhr", time: t.Dhuhr },
          { name: "Asr", time: t.Asr },
          { name: "Maghrib", time: t.Maghrib },
          { name: "Isha", time: t.Isha },
        ];

        for (const pt of prayerTimes) {
          const [h, m] = pt.time.split(":");
          const ptMin = parseInt(h) * 60 + parseInt(m);
          if (ptMin > nowMin) {
            setNextPrayer(pt.name);
            break;
          }
        }
        if (!nextPrayer && !nextPrayerSet) {
          setNextPrayer("Fajr (tomorrow)");
        }
      })
      .catch(() => setPrayers(null));
  }, []);

  let nextPrayerSet = false;

  if (!prayers) return null;

  if (compact) {
    // Mobile — very small
    return (
      <div className="px-8 pb-4">
        <div className="font-mono-label mb-1.5 text-[8px] uppercase tracking-[0.2em] text-[var(--meta)]">
          Prayer Times · Dubai
        </div>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5">
          {Object.entries(prayers).map(([name, time]) => (
            <span
              key={name}
              className={`font-mono-label text-[8px] ${
                nextPrayer === name ? "text-foreground font-semibold" : "text-foreground/40"
              }`}
            >
              {name} {time}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Desktop — bottom right
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="fixed bottom-4 right-4 z-20 hidden rounded-2xl border border-[var(--rule)] bg-[var(--cream)]/95 px-4 py-3 backdrop-blur-sm md:block"
    >
      <div className="font-mono-label mb-2 text-[9px] uppercase tracking-[0.2em] text-[var(--meta)]">
        Prayer Times · Dubai
      </div>
      <div className="space-y-1">
        {Object.entries(prayers).map(([name, time]) => (
          <div
            key={name}
            className={`flex items-baseline justify-between gap-6 ${
              nextPrayer === name ? "font-semibold text-foreground" : "text-foreground/50"
            }`}
          >
            <span className="font-mono-label text-[10px]">{name}</span>
            <span className="font-mono-label text-[10px] tabular-nums">{time}</span>
          </div>
        ))}
      </div>
      {nextPrayer && (
        <div className="font-mono-label mt-2 border-t border-[var(--rule)] pt-1.5 text-[8px] uppercase tracking-[0.15em] text-[var(--meta)]">
          Next: {nextPrayer}
        </div>
      )}
    </motion.div>
  );
}
