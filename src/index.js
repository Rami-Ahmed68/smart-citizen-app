import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider, createLocalStorageManager } from "@chakra-ui/react";
import { AuthProvider } from "./auth/AuthContext.jsx";

import { Theme } from "./components/ui/theme.jsx";
import "./i18n.js";

const colorModeManager = createLocalStorageManager(
  "smart-citizen-app-color-mode",
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ChakraProvider theme={Theme} colorModeManager={colorModeManager}>
          <App />
        </ChakraProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
