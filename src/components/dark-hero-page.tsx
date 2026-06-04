"use client";

import { defaultLocale } from "../lib/i18n";
import { getTranslation } from "../lib/translations";
import { Hero } from "./hero";
import { ZoomFeatureSection } from "./zoom-feature-section";
import { DeviceMockupsSection } from "./device-mockups-section";
import { CustomControlsSection } from "./custom-controls-section";
import { PerformanceSection } from "./performance-section";
import { FAQSection } from "./faq-section";
import { Footer } from "./footer";

export default function DarkHeroPage() {
  const t = getTranslation(defaultLocale);

  return (
    <main>
      <Hero
        copy={t.home.hero}
        currentPath="/"
        headerCopy={t.header}
        languageLabel={t.footer.language}
        locale={defaultLocale}
      />
      <ZoomFeatureSection copy={t.home.zoom} />
      <DeviceMockupsSection copy={t.home.deviceMockups} />
      <CustomControlsSection copy={t.home.controls} />
      <PerformanceSection copy={t.home.performance} />
      <FAQSection copy={t.home.faq} />
      <Footer copy={t.footer} locale={defaultLocale} />
    </main>
  );
}
