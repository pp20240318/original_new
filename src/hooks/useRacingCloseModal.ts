import { createGlobalStore } from "@/hooks/useGlobalState";

export const useRacingCloseModal = createGlobalStore(
  "useRacingCloseModal",
  false
);
