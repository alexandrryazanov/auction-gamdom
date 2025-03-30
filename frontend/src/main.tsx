import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import MainLayout from "./layouts/MainLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "@/pages/login.tsx";
import { ToastContainer } from "react-toastify";
import { NO_TOKEN_ERROR_MESSAGE } from "@/api/rest/auth/constants.ts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error.message === NO_TOKEN_ERROR_MESSAGE) return false; // disable repeats
        return failureCount < 3;
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
          <ToastContainer />
        </MainLayout>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
