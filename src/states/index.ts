import { createGlobalStore } from "@/hooks/useGlobalState";
import { getLocal } from "@/utils/localStorage";

// export const useLoginState = createGlobalStore(
//   "loginState",
//   !!getLocal("token3")
// );

export const useTokenState = createGlobalStore(
  "useTokenState",
  ""
);  