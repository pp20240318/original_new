import { createGlobalStore } from "@/hooks/useGlobalState";

export const useRefreshHistory = createGlobalStore("useRefreshHistoryStatus", {
  status: false,
});
