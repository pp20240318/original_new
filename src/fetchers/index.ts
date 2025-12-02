// import { useLoginState } from "@/states";
import { useFetch } from "./fetch";
import { accountInfo, ownGames } from "./user";
import { Options } from "ahooks/lib/useRequest/src/types";
import { useLogined } from "@/events";

export function useAccountInfo(options?: Options<ResData<DAccountInfo>, []>) {
  const isLogined = useLogined();
  return useFetch(accountInfo, {
    ...options,
    cacheKey: "accountInfo",
    ready: isLogined,
  });
}

export function useOwnGames(options?: Options<ResData<DOwnGames>, []>) {
  return useFetch(ownGames, {
    ...options,
    cacheKey: "ownGames",
  });
}
