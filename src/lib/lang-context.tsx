"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Lang = "en" | "ar";

type Translations = {
  project: string;
  about: string;
  contact: string;
  projects: string;
  location: string;
  social: string;
  allRightsReserved: string;
  client: string;
  year: string;
  caseStudy: string;
  video: string;
  view: string;
  nextProject: string;
  capabilities: string;
  disciplines: string;
  experience: string;
  roles: string;
  recommendations: string;
  getInTouch: string;
  letsMake: string;
  somethingGood: string;
  contactDesc: string;
  date: string;
  localTime: string;
  startAProject: string;
  writeAHello: string;
  showreel: string;
  openForCollaborations: string;
};

const en: Translations = {
  project: "Project", about: "About", contact: "Contact",
  projects: "Projects", location: "Location", social: "Social",
  allRightsReserved: "All rights reserved",
  client: "Client", year: "Year", caseStudy: "Case Study",
  video: "Video", view: "View", nextProject: "Next Project",
  capabilities: "Capabilities", disciplines: "disciplines",
  experience: "Experience", roles: "roles", recommendations: "Recommendations",
  getInTouch: "Get in touch", letsMake: "Let's make", somethingGood: "something good.",
  contactDesc: "Always open to conversation about campaigns, launches, and seasonal films. If you have a brief — or even just a direction — I'd love to hear what you're making.",
  date: "Date", localTime: "Local Time", startAProject: "Start a project",
  writeAHello: "Write a hello →", showreel: "Showreel",
  openForCollaborations: "Open for collaborations",
};

const ar: Translations = {
  project: "الأعمال", about: "نبذة عني", contact: "تواصل معي",
  projects: "الأعمال", location: "الموقع", social: "روابط التواصل",
  allRightsReserved: "جميع الحقوق محفوظة",
  client: "العميل", year: "السنة", caseStudy: "دراسة حالة",
  video: "فيديو", view: "عرض", nextProject: "العمل التالي",
  capabilities: "المهارات والقدرات", disciplines: "تخصصات",
  experience: "الخبرات العملية", roles: "وظائف", recommendations: "التوصيات",
  getInTouch: "تواصل معي", letsMake: "لنصنع", somethingGood: "شيئاً استثنائياً.",
  contactDesc: "أنا دائماً منفتحٌ على الحوار حول الحملات والإطلاقات والأعمال الموسمية. إن كان لديك مشروعٌ — أو حتى مجرد فكرة — يسعدني أن أسمع ما تعمل عليه.",
  date: "التاريخ", localTime: "التوقيت المحلي", startAProject: "ابدأ مشروعك",
  writeAHello: "أرسل رسالة ←", showreel: "معرض الأعمال",
  openForCollaborations: "متاحٌ للتعاون",
};

type LangContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
  isRTL: boolean;
};

const LangContext = createContext<LangContextType>({
  lang: "en", setLang: () => {}, t: en, isRTL: false,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang;
    if (stored === "ar" || stored === "en") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = l;
  };

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t: lang === "ar" ? ar : en, isRTL: lang === "ar" }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
