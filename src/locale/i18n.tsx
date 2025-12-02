import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import fil from "./fil.json";
import { getLocal } from "@/utils/localStorage";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fil: { translation: fil },
  },
  lng:
  getLocal("currentLang") ||
  getLocal("siteConfig")?.data?.LANGUAGE ||
    "en", // 默认语言环境
  fallbackLng: "en", // 如果当前语言没有翻译，则回退到这种语言
});

export default i18n;
