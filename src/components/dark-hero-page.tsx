"use client";

import { Hero } from "./hero";
import { ZoomFeatureSection } from "./zoom-feature-section";
import { DeviceMockupsSection } from "./device-mockups-section";
import { CustomControlsSection } from "./custom-controls-section";
import { PerformanceSection } from "./performance-section";
import { FAQSection } from "./faq-section";
import { Footer } from "./footer";

export default function DarkHeroPage() {
  return (
    <main>
      <Hero />
      <ZoomFeatureSection />
      <DeviceMockupsSection />
      <CustomControlsSection />
      <PerformanceSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
