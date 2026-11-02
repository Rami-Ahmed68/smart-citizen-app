import { Tooltip, IconButton, useColorMode } from "@chakra-ui/react";
import { LuSun, LuMoon } from "react-icons/lu";

export default function ToggleTheme() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Tooltip
      label={colorMode === "light" ? "الوضع الداكن" : "الوضع الفاتح"}
      placement="bottom">
      <IconButton
        bg="icon-btn"
        aria-label="تبديل المظهر"
        icon={colorMode === "light" ? <LuMoon /> : <LuSun />}
        variant="ghost"
        onClick={toggleColorMode}
      />
    </Tooltip>
  );
}
