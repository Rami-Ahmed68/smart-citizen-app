import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ar from "./constants/translations/ra";
import en from "./constants/translations/en";

const resources = {
  ar: { translation: ar },
  en: { translation: en },
};

const savedLang = localStorage.getItem("smart-citizen-lang") || "ar";

i18n.use(initReactI18next).init({
  resources,
  lng: savedLang,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("smart-citizen-app-lang", lng);
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
});

export default i18n;
