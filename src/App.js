import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes.js";
import i18n from "./i18n.js";

function App() {
  useEffect(() => {
    const applyLanguage = (lang) => {
      const html = document.documentElement;
      const direction = lang === "ar" ? "rtl" : "ltr";

      html.setAttribute("lang", lang);
      html.setAttribute("dir", direction);
      html.setAttribute("data-language", lang);
    };

    applyLanguage(i18n.language || "en");

    const handleLanguageChange = (lng) => applyLanguage(lng);
    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, []);

  return <AppRoutes />;
}

export default App;
