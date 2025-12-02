import { createContext } from "react";
import { useContext } from "react";

export const AppConfigContext = createContext<AppConfig>({} as AppConfig);

export function useAppConfig() {
  return useContext(AppConfigContext);
}
