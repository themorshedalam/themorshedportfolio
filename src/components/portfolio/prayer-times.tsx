"use client";

import { useState, useEffect } from "react";

type PrayerTimes = {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

/**
 * Prayer times — mobile compact view.
 * Shows only the next prayer for Dubai.
 */
export function PrayerTimes() {
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
