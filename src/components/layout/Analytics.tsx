"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const GA_ID = "G-NFK8W8MT0B";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export function Analytics() {
  const [consentLoaded, setConsentLoaded] = useState(false);

  useEffect(() => {
    // Initialize consent mode defaults BEFORE gtag loads
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    // Set default consent to denied (Consent Mode v2)
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      wait_for_update: 500, // Wait 500ms for consent update before sending data
    });

    // Check if user already consented
    const consent = localStorage.getItem("cookie-consent");
    if (consent === "accepted") {
      updateConsent(true);
    }

    setConsentLoaded(true);

    // Listen for consent changes from CookieConsent component
    const handleConsent = (e: CustomEvent) => {
      updateConsent(e.detail.accepted);
    };
    window.addEventListener("cookie-consent-update" as string, handleConsent as EventListener);
    return () => window.removeEventListener("cookie-consent-update" as string, handleConsent as EventListener);
  }, []);

  return consentLoaded ? (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            send_page_view: true,
          });
        `}
      </Script>
    </>
  ) : null;
}

export function updateConsent(accepted: boolean) {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("consent", "update", {
    analytics_storage: accepted ? "granted" : "denied",
    ad_storage: "denied", // Always denied — no ads
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}
