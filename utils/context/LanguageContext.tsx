"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";

import idTranslations from "@/locales/id.json";

import enTranslations from "@/locales/en.json";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Cache for translations with timestamp
const translationCache: {
    [key in Language]?: {
        data: Translations;
        timestamp: number;
    };
} = {};

const CACHE_DURATION = 5 * 60 * 1000;

export function LanguageProvider({ children }: { children: ReactNode }) {
    // Always start with "id" to match server-side render
    // This prevents hydration mismatch
    const [language, setLanguageState] = useState<Language>("id");
    const [translations, setTranslations] = useState<Translations>(idTranslations);
    const [isLoading, setIsLoading] = useState(false);
    const isInitialMount = useRef(true);
    const hasHydrated = useRef(false);

    // Fetch translations from API
    const fetchTranslations = useCallback(async (lang: Language, forceRefresh = false): Promise<void> => {
        // Check cache first (unless force refresh)
        if (!forceRefresh && translationCache[lang]) {
            const cached = translationCache[lang]!;
            const now = Date.now();
            if (now - cached.timestamp < CACHE_DURATION) {
                setTranslations(cached.data);
                return;
            }
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/translations/${lang}`, {
                cache: forceRefresh ? "no-store" : "default",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch translations");
            }

            const data = await response.json();

            // Update cache
            translationCache[lang] = {
                data,
                timestamp: Date.now(),
            };

            setTranslations(data);
        } catch (error) {
            console.error("Error fetching translations:", error);
            // Fallback to static imports
            const fallback = lang === "id" ? idTranslations : enTranslations;
            setTranslations(fallback);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load language from localStorage after hydration (client-only)
    useEffect(() => {
        if (!hasHydrated.current && typeof window !== "undefined") {
            hasHydrated.current = true;
            const savedLanguage = localStorage.getItem("language") as Language;
            if (savedLanguage === "id" || savedLanguage === "en") {
                // Update language and translations immediately
                setLanguageState(savedLanguage);
                setTranslations(savedLanguage === "id" ? idTranslations : enTranslations);
                // Then fetch from API in background
                fetchTranslations(savedLanguage, false);
            } else {
                // No saved language, fetch default (id) from API
                fetchTranslations("id", false);
            }
        }
    }, [fetchTranslations]);

    // Load translations when language changes (after initial mount)
    useEffect(() => {
        if (hasHydrated.current && !isInitialMount.current) {
            // When language changes after hydration, fetch new translations
            fetchTranslations(language, false);
        }
        if (isInitialMount.current) {
            isInitialMount.current = false;
        }
    }, [language, fetchTranslations]);

    // Refresh translations function
    const refreshTranslations = useCallback(async () => {
        await fetchTranslations(language, true);
    }, [language, fetchTranslations]);

    // Save language to localStorage when it changes
    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        if (typeof window !== "undefined") {
            localStorage.setItem("language", lang);
            // Update html lang attribute
            document.documentElement.lang = lang;
        }
    };

    // Translation function
    const t = (key: string): string => {
        try {
            const keys = key.split(".");
            let value: TranslationValue = translations;

            for (const k of keys) {
                if (value && typeof value === "object" && k in value) {
                    value = value[k] as TranslationValue;
                } else {
                    return key;
                }
            }

            return typeof value === "string" ? value : key;
        } catch {
            return key;
        }
    };

    // Update html lang attribute when language changes
    useEffect(() => {
        if (typeof window !== "undefined") {
            document.documentElement.lang = language;
        }
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, refreshTranslations, isLoading }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}