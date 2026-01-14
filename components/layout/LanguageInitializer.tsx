"use client";

import { useEffect } from "react";

export default function LanguageInitializer() {
    useEffect(() => {
        // Initialize language from localStorage or default to "id"
        if (typeof window !== "undefined") {
            const savedLanguage = localStorage.getItem("language");
            const language = savedLanguage === "en" ? "en" : "id";
            document.documentElement.lang = language;
        }
    }, []);

    return null;
}

