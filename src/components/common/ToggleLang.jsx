import { Tooltip, IconButton } from "@chakra-ui/react";
import { LuLanguages } from "react-icons/lu";
import { useTranslation } from "react-i18next";

export default function ToggleLang() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <Tooltip
      label={!isArabic ? "Switch Language" : " تبديل اللغة "}
      placement="bottom">
      <IconButton
        bg="icon-btn"
        aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}
        icon={<LuLanguages />}
        variant="ghost"
        onClick={() => i18n.changeLanguage(isArabic ? "en" : "ar")}
      />
    </Tooltip>
  );
}
