"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { messages } from "@/i18n/messages";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, toggleLocale } = useLanguage();
  const copy = messages[locale].language;

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={copy.switchLabel}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full border border-cream/20 bg-coffee-dark/55 px-3 text-xs font-medium tracking-[0.12em] text-cream backdrop-blur-md transition-colors hover:border-premium-gold hover:text-premium-gold",
        className,
      )}
    >
      <Languages className="size-4" aria-hidden="true" />
      <span>{copy.currentLabel}</span>
      <span className="text-cream/35" aria-hidden="true">
        /
      </span>
      <span>{locale === "en" ? "فا" : "EN"}</span>
    </button>
  );
}
