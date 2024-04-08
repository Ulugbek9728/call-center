import i18next from "i18next";
import I18NextHttpBackend from "i18next-http-backend";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
// Resources files
import translationUz from "../locales/uz/translation.json";
import translationRu from "../locales/ru/translation.json";
import translationEn from "../locales/en/translation.json";
import { getLocale } from "./locales/getLocale";

const resources = {
  uz: {
    translation: translationUz,
  },
  ru: {
    translation: translationRu,
  },
  en: {
    translation: translationEn,
  },
};

i18next
  .use(I18NextHttpBackend)
  .use(I18nextBrowserLanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: getLocale() ? getLocale() : "uz",
    debug: false,
    resources,
    detection: {
      order: ["queryString", "cookie"],
      cache: ["cookie"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
