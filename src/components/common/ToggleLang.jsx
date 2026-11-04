// src/components/common/ToggleLang.jsx
import { Tooltip, Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export default function ToggleLang() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <Tooltip
      label={isArabic ? "Switch to English" : "تغيير اللغة"}
      placement="auto">
      <Button
        bg="icon-btn"
        variant="ghost"
        onClick={() => i18n.changeLanguage(isArabic ? "en" : "ar")}>
        {isArabic ? "EN" : "ar"}
      </Button>
    </Tooltip>
  );
}
