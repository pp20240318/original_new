interface Navigator {
  standalone?: boolean;
}

interface AppConfig {
  CODE: string;
  TITLE: string;
  DOMAIN: string;
  WEB_URL: string;
  ASSETS_URL: string;
  LOGO: string;
  FAVICON: string;
  DESC: string;
  KEYWORDS: string;
  REGION: string;
  LANGUAGE: string;
  LANGUAGES: string[];
  CURRENCY: string;
  SYMBOL: string;
  EMAIL: string;
  EMAIL_TITLE: string;
  PHONE: string;
  PHONE_TITLE: string;
  PHONE_CODE: string;
  PHONE_DIGITS: number;
  ORIGINAL_URL: string;
  APP_URL: string;
  template: {
    mode: string;
    layout: string;
    theme: string;
  };
  manifest?: Manifest;
  pwaRef?: string;
}

interface InitParams {
  site?: string;
  userId?: string;
  token?: string;
  type?: string;
  hl?: string;
}
