import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import "./types/i18n";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    lng: "ja", // デフォルト言語
    debug: false,

    // 名前空間の設定
    ns: ["common"],
    defaultNS: "common",

    // バックエンドの設定
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },

    // リソースの読み込み完了を待つ
    react: {
      useSuspense: false,
    },
  });

export default i18n;
