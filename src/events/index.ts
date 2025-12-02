import { createEvent } from "./createEvent";
import { getLocal } from "@/utils/localStorage";

// 错误信息
export const { emit: emitError, use: useError } = createEvent<ErrorInfo>();

// 余额信息(来自Socket)
export const { emit: emitSocketBalance, use: useSocketBalance } =
  createEvent<OnBalance[1]>();

// 登录状态
export const { emit: emitLogined, use: useLogined } = createEvent(false);
