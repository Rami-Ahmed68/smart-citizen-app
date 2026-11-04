import { extendTheme } from "@chakra-ui/react";

export const Theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },

  colors: {
    syria: {
      green: {
        light: "#428177",
        mid: "#054239",
        dark: "#002623",
      },
      wheat: {
        light: "#edebe0",
        mid: "#b9a779",
        dark: "#988561",
      },
      umber: {
        light: "#6b1f2a",
        mid: "#4a151e",
        dark: "#260f14",
      },
      charcoal: {
        light: "#ffffff",
        mid: "#3d3a3b",
        dark: "#161616",
      },
    },

    primary: {
      50: "#e6f3ff",
      100: "#cce7ff",
      200: "#99ceff",
      300: "#66b5ff",
      400: "#339cff",
      500: "#007bff",
      600: "#0062cc",
      700: "#004a99",
      800: "#003166",
      900: "#001933",
    },

    secondary: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
    },

    warning: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
    },

    error: {
      30: "#ff000020",
      40: "#d0060677",
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
    },

    info: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },

    success: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
    },

    yellow: {
      50: "#fefce8",
      100: "#fef9c3",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
    },

    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },

    brand: {
      50: "#e6f0fa",
      100: "#ccdbf5",
      200: "#99b7eb",
      300: "#6693e1",
      400: "#336fd7",
      500: "#004bcd",
      600: "#003ca4",
      700: "#002d7b",
      800: "#001e52",
      900: "#000f29",
    },

    background: {
      50: "#ffffff",
      100: "#f9fafb",
      200: "#f3f4f6",
      300: "#e5e7eb",
      400: "#d1d5db",
      500: "#9ca3af",
      600: "#6b7280",
      700: "#4b5563",
      800: "#374151",
      900: "#1f2937",
    },
  },

  semanticTokens: {
    colors: {
      "bg-body": {
        default: "#ececec",
        _dark: "#181818",
      },
      "bg-sid-bar": {
        default: "#fdfdfd",
        _dark: "#030303",
      },
      "nav-bar": {
        default: "#f9f9f9",
        _dark: "#030303",
      },

      "icon-btn": {
        default: "#b2b2b2c9",
        _dark: "#2f2f2fb4",
      },

      "bg-input": {
        default: "#e0e0e0",
        _dark: "#1c1c1c",
      },
    },
  },
});
