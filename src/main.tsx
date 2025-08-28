import { StrictMode } from "react";
import type { PostHogConfig } from "posthog-js";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PostHogProvider } from "posthog-js/react";

const options: Partial<PostHogConfig> = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
};

const apiKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {apiKey ? (
      <PostHogProvider apiKey={apiKey} options={options}>
        <App />
      </PostHogProvider>
    ) : (
      <App />
    )}
  </StrictMode>
);
