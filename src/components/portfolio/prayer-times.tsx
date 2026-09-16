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
 * Desktop: floating bottom-right card showing only next prayer.
 * Mobile: compact centered, only next prayer.
 */
export function PrayerTimes({ compact = false }: { compact?: boolean }) {
  const [nextPrayerName, setNextPrayerName] = useState("");
  const [nextPrayerTime, setNextPrayerTime] = useState("");

  useEffect(() => {
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

        const prayerList = [
          { name: "Fajr", time: t.Fajr },
          { name: "Dhuhr", time: t.Dhuhr },
          { name: "Asr", time: t.Asr },
          { name: "Maghrib", time: t.Maghrib },
          { name: "Isha", time: t.Isha },
        ];

        let found = false;
        for (const pt of prayerList) {
          const [h, m] = pt.time.split(":");
          const ptMin = parseInt(h) * 60 + parseInt(m);
          if (ptMin > nowMin) {
            setNextPrayerName(pt.name);
            setNextPrayerTime(formatTime(pt.time));
            found = true;
            break;
          }
        }
        if (!found) {
          setNextPrayerName("Fajr (tomorrow)");
          setNextPrayerTime(formatTime(t.Fajr));
        }
      })
      .catch(() => {});
  }, []);

  if (!nextPrayerName) return null;

  if (compact) {
    // Mobile — compact, centered, only next prayer
    return (
      <div className="px-8 pb-4 text-center">
        <div className="font-mono-label text-[8px] uppercase tracking-[0.2em] text-[var(--meta)]">
          Next Prayer · Dubai
        </div>
        <div className="font-mono-label mt-0.5 text-[10px] text-foreground/70">
          <span className="font-semibold text-foreground">{nextPrayerName}</span> — {nextPrayerTime}
        </div>
      </div>
    );
  }

  // Desktop — floating bottom-right, only next prayer
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="fixed bottom-4 right-4 z-20 hidden rounded-2xl border border-[var(--rule)] bg-[var(--cream)]/95 px-4 py-3 backdrop-blur-sm md:block"
    >
      <div className="font-mono-label mb-1 text-[9px] uppercase tracking-[0.2em] text-[var(--meta)]">
        Next Prayer · Dubai
      </div>
      <div className="font-mono-display text-[14px] text-foreground">
        {nextPrayerName} — {nextPrayerTime}
      </div>
    </motion.div>
  );
}
