import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

import es from "@/locales/es.json";
import ru from "@/locales/ru.json";
import en from "@/locales/en.json";

export type Locale = "es" | "ru" | "en";

type Translations = Record<string, unknown>;

const bundles: Record<Locale, Translations> = {
  es: es as Translations,
  ru: ru as Translations,
  en: en as Translations,
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getNested = (obj: Record<string, unknown>, path: string): string | undefined => {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : undefined;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem("feliz-locale") as Locale | null;
      return saved === "ru" || saved === "es" || saved === "en" ? saved : "es";
    } catch {
      return "es";
    }
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState((prev) => {
      if (prev === newLocale) return prev;
      try {
        localStorage.setItem("feliz-locale", newLocale);
      } catch {}
      return newLocale;
    });
  }, []);

  const t = useCallback(
    (key: string): string => {
      const translations = bundles[locale];
      const value = getNested(translations as Record<string, unknown>, key);
      return value ?? key;
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, loading: false }),
    [locale, setLocale, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
