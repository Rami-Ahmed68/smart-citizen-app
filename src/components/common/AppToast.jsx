// src/components/common/AppToast.jsx
import {
  Box,
  CloseButton,
  HStack,
  Icon,
  Spinner,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  LuCircleCheck,
  LuCircleX,
  LuTriangleAlert,
  LuInfo,
} from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "../../api/axios";

const STATUS_CONFIG = {
  success: {
    icon: LuCircleCheck,
    color: "green.500",
    bg: "green.50",
    border: "green.200",
    darkBg: "green.900",
    darkBorder: "green.700",
  },
  error: {
    icon: LuCircleX,
    color: "red.500",
    bg: "red.50",
    border: "red.200",
    darkBg: "red.900",
    darkBorder: "red.700",
  },
  warning: {
    icon: LuTriangleAlert,
    color: "orange.500",
    bg: "orange.50",
    border: "orange.200",
    darkBg: "orange.900",
    darkBorder: "orange.700",
  },
  info: {
    icon: LuInfo,
    color: "blue.500",
    bg: "blue.50",
    border: "blue.200",
    darkBg: "blue.900",
    darkBorder: "blue.700",
  },
  loading: {
    icon: null,
    color: "brand.500",
    bg: "brand.50",
    border: "brand.200",
    darkBg: "brand.900",
    darkBorder: "brand.700",
  },
};

export function AppToast({ id, status = "info", title, description, onClose }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.info;
  const IconComponent = config.icon;

  return (
    <Box
      role="alert"
      minW={{ base: "280px", md: "360px" }}
      maxW={{ base: "90vw", md: "420px" }}
      bg={config.bg}
      borderWidth="1px"
      borderColor={config.border}
      borderInlineStartWidth="4px"
      borderInlineStartColor={config.color}
      rounded="lg"
      boxShadow="lg"
      p={4}
      _dark={{
        bg: config.darkBg,
        borderColor: config.darkBorder,
      }}>
      <HStack align="start" spacing={3}>
        <Box flexShrink={0} pt="1px">
          {status === "loading" ? (
            <Spinner size="sm" color={config.color} thickness="2px" />
          ) : (
            <Icon as={IconComponent} boxSize={5} color={config.color} />
          )}
        </Box>

        <VStack align="start" spacing={1} flex="1" minW={0}>
          {title && (
            <Text fontWeight="semibold" fontSize="sm" color="text-primary">
              {title}
            </Text>
          )}
          {description && (
            <Text fontSize="sm" color="text-secondary" wordBreak="break-word">
              {description}
            </Text>
          )}
        </VStack>

        {onClose && (
          <CloseButton
            size="sm"
            onClick={onClose}
            aria-label="close"
            flexShrink={0}
          />
        )}
      </HStack>
    </Box>
  );
}

export function useAppToast() {
  const toast = useToast();
  const { t, i18n } = useTranslation();

  const position = i18n.language === "ar" ? "top-left" : "top-right";

  const trigger = ({ status, title, description, duration = 4000, id }) =>
    toast({
      id,
      position,
      duration,
      isClosable: false,
      render: ({ onClose, id: toastId }) => (
        <AppToast
          id={toastId}
          status={status}
          title={title}
          description={description}
          onClose={onClose}
        />
      ),
    });

  const success = (title, description, opts = {}) =>
    trigger({
      status: "success",
      title: title || t("toast.success"),
      description,
      ...opts,
    });

  const error = (errorOrTitle, description, opts = {}) => {
    const isError =
      errorOrTitle &&
      (errorOrTitle.isAxiosError ||
        errorOrTitle.response ||
        errorOrTitle instanceof Error);

    const title = isError ? t("toast.error") : errorOrTitle || t("toast.error");

    const desc = isError
      ? getErrorMessage(errorOrTitle, t("toast.errorDesc"))
      : description;

    trigger({
      status: "error",
      title,
      description: desc,
      duration: 5000,
      ...opts,
    });
  };

  const warning = (title, description, opts = {}) =>
    trigger({
      status: "warning",
      title: title || t("toast.warning"),
      description,
      ...opts,
    });

  const info = (title, description, opts = {}) =>
    trigger({
      status: "info",
      title: title || t("toast.info"),
      description,
      ...opts,
    });

  const loading = (title, description, opts = {}) =>
    toast({
      id: opts.id || "app-loading",
      position,
      duration: null,
      isClosable: false,
      render: ({ id: toastId }) => (
        <AppToast
          id={toastId}
          status="loading"
          title={title || t("toast.loading")}
          description={description}
        />
      ),
      ...opts,
    });

  const close = (id) => toast.close(id);
  const closeAll = () => toast.closeAll();
  const update = (id, opts) => toast.update(id, opts);

  return {
    success,
    error,
    warning,
    info,
    loading,
    close,
    closeAll,
    update,
    toast,
  };
}

export default AppToast;
