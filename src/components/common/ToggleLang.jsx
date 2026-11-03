import { Tooltip, Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export default function ToggleLang() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <Tooltip
      label={!isArabic ? "Switch Language" : " تبديل اللغة "}
      placement="bottom">
      <Button
        bg="icon-btn"
        aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}
        variant="ghost"
        onClick={() => i18n.changeLanguage(isArabic ? "en" : "ar")}>
        {isArabic ? "EN" : "AR"}
      </Button>
    </Tooltip>
  );
}
