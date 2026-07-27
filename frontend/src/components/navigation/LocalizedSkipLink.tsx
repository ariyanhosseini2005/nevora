"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { messages } from "@/i18n/messages";

export function LocalizedSkipLink() {
  const { locale } = useLanguage();

  return (
    <a href="#main-content" className="skip-link">
      {messages[locale].nav.skipToContent}
    </a>
  );
}
