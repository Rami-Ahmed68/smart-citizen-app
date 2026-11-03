import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ar from "./constants/translations/ra";
import en from "./constants/translations/en";

const LANG_KEY = "smart-citizen-app-lang";

const resources = {
  ar: { translation: ar },
  en: { translation: en },
};

const savedLang = localStorage.getItem(LANG_KEY) || "en";

i18n.use(initReactI18next).init({
  resources,
  lng: savedLang,
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem(LANG_KEY, lng);
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
});

export default i18n;
