// src/components/common/ToggleLang.jsx
import { Tooltip, Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export default function ToggleLang() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <Tooltip
      label={!isArabic ? "Switch Language" : "تغيير اللغة"}
      placement="auto">
      <Button
        size="sm"
        variant="ghost"
        bg="lang-btn"
        color="text-primary"
        fontWeight="semibold"
        fontSize="xs"
        letterSpacing="0.05em"
        px={2.5}
        _hover={{
          bg: "bg-hover",
        }}
        onClick={() => i18n.changeLanguage(isArabic ? "en" : "ar")}
        sx={{
          transition: "background 0.15s, color 0.15s",
        }}>
        {isArabic ? "EN" : "ar"}
      </Button>
    </Tooltip>
  );
}
