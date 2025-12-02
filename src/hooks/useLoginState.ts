import { GlobalState } from "./useGlobalState";
import { getLocal, removeLocal, setLocal } from "@/utils/localStorage";

const gs = new GlobalState(!!getLocal("token"));

export const useLoginState = function () {
  const isLogined = gs.useGlobalState();

  return {
    isLogined,
    updateLoginState: (token?: null | string) => {
      // token: 传入 string 表示登入 | 传入 null 表示登出 | 不传 表示刷新登录状态
      if (token === null) {
        removeLocal("token");
      } else {
        token = token || getLocal("token");
        if (token) setLocal("token", token);
      }
      gs.update(!!getLocal("token"));
    },
  };
};
