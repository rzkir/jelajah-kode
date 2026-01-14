import { useLanguage } from "@/utils/context/LanguageContext";

export function useTranslation() {
  const { t, language, refreshTranslations, isLoading } = useLanguage();
  return { t, language, refreshTranslations, isLoading };
}
