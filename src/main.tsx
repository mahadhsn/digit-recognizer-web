import { StrictMode } from "react";
import type { PostHogConfig } from "posthog-js";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import posthog from 'posthog-js';
import { PostHogProvider } from "posthog-js/react";

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
    api_host: 'https://us.i.posthog.com',
    defaults: '2025-05-24',
    loaded: function (posthog) {
        posthog.identify('[user unique id]')
    },
})

const options: Partial<PostHogConfig> = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2025-05-24",
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <PostHogProvider 
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY} 
      options={options}
      >
        <App />
      </PostHogProvider>
  </StrictMode>
);
