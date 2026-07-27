"use client";

import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Locale } from "./messages";

type LanguageContextValue = {
  locale: Locale;
  direction: "ltr" | "rtl";
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "nevora-locale";
const LOCALE_CHANGE_EVENT = "nevora:locale-change";

function getBrowserLocale(): Locale {
  const storedLocale = window.localStorage.getItem(STORAGE_KEY);
  if (storedLocale === "fa" || storedLocale === "en") return storedLocale;
  return window.navigator.language.toLowerCase().startsWith("fa") ? "fa" : "en";
}

function subscribeToLocale(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(LOCALE_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(LOCALE_CHANGE_EVENT, onStoreChange);
  };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getBrowserLocale,
    (): Locale => "en",
  );
  const setLocale = useCallback((nextLocale: Locale) => {
    window.localStorage.setItem(STORAGE_KEY, nextLocale);
    window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
  }, []);
  const toggleLocale = useCallback(() => {
    setLocale(getBrowserLocale() === "en" ? "fa" : "en");
  }, [setLocale]);

  useEffect(() => {
    const direction = locale === "fa" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      direction: locale === "fa" ? "rtl" : "ltr",
      setLocale,
      toggleLocale,
    }),
    [locale, setLocale, toggleLocale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider.");
  }
  return context;
}
