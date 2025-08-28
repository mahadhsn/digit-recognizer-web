import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PostHogProvider } from "posthog-js/react";
import posthog from 'posthog-js';
import type { PostHogConfig } from 'posthog-js';


const PH_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY as string | undefined;
const PH_HOST = (import.meta.env.VITE_PUBLIC_POSTHOG_HOST as string | undefined) || 'https://app.posthog.com';

if (PH_KEY) {
  const cfg: Partial<PostHogConfig> = {
    api_host: PH_HOST,
    capture_pageview: true,
    autocapture: true,
    session_recording: {
    },
  };
  posthog.init(PH_KEY, cfg);
} else {
  console.warn('[PostHog] Missing VITE_PUBLIC_POSTHOG_KEY — analytics init skipped');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {PH_KEY ? (
      <PostHogProvider client={posthog}>
        <App />
      </PostHogProvider>
    ) : (
      <App />
    )}
  </StrictMode>
);
