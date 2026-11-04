// src/components/common/ToggleTheme.jsx
import { Tooltip, IconButton, useColorMode } from "@chakra-ui/react";
import { LuSun, LuMoon } from "react-icons/lu";
import { useTranslation } from "react-i18next";

const labels = {
  ar: {
    darkMode: "الوضع الداكن",
    lightMode: "الوضع الفاتح",
    toggleTheme: "تبديل المظهر",
  },
  en: {
    darkMode: "Dark mode",
    lightMode: "Light mode",
    toggleTheme: "Toggle theme",
  },
};

export default function ToggleTheme() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { i18n } = useTranslation();

  const lang = i18n.language === "ar" ? "ar" : "en";
  const text = labels[lang];
  const isDark = colorMode === "dark";

  return (
    <Tooltip label={isDark ? text.lightMode : text.darkMode} placement="bottom">
      <IconButton
        bg="icon-btn"
        aria-label={text.toggleTheme}
        icon={isDark ? <LuSun /> : <LuMoon />}
        variant="ghost"
        onClick={toggleColorMode}
      />
    </Tooltip>
  );
}
