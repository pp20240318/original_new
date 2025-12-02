import { useEffect, useRef, useState } from "react";
import { Options, Plugin } from "ahooks/lib/useRequest/src/types";
import { useRequest } from "ahooks";
import { EEmit, EOn } from "./enums";
import { socketIO } from "./socketIO";
import { getWebSocket, webSocketOn, webSocketOff } from "./webSocket";

const getSocketHandler = (event: string, handler: (data: any) => void) => {
  if (event.startsWith("ws_")) {
    const match = event.match(/^ws_(?<g>[^_]+)_(?<e>[^_].*)$/);
    if (match?.groups) {
      const { g, e } = match.groups;
      const url = `${import.meta.env.VITE_WSS_BASE_URL}/game-service/${g}-ws`;
      return [
        () => webSocketOn(url, e, handler),
        () => webSocketOff(url, e, handler),
      ] as const;
    } else {
      console.warn("event format error");
      return [] as const;
    }
  } else {
    return [
      () => socketIO.on(event, handler),
      () => socketIO.off(event, handler),
    ] as const;
  }
};

/**
 * useSocketOn 监听事件
 * @param event 事件名称
 * @param callback 二次处理监听结果, 接收 data 和 prev 两个参数: data 为事件监听结果, prev 为初始值或上一次 callback 的返回值
 * @returns 不传 callback 默认为事件监听的结果, 否则为 callback 的返回值
 */
function useSocketOn<O extends [EOn, any]>(event: O[0]): O[1] | undefined;

function useSocketOn<O extends [EOn, any]>(
  event: O[0],
  initialState: O[1]
): O[1];

function useSocketOn<O extends [EOn, any], D = O[1]>(
  event: O[0],
  callback: (data: O[1], prev?: D) => D
): D | undefined;

function useSocketOn<O extends [EOn, any], D = O[1]>(
  event: O[0],
  callback: (data: O[1], prev: D) => D,
  initialState: D
): D;

function useSocketOn<O extends [EOn, any], D = O[1]>(
  event: O[0],
  callback?: D | ((data: O[1], prev?: D) => D),
  initialState?: D
) {
  const [state, setState] = useState(
    typeof callback === "function" ? initialState : callback
  );

  const callbackRef = useRef(typeof callback === "function" ? callback : null);

  useEffect(() => {
    if (typeof callback === "function") callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (data: O[1]) => {
      setState(
        (prev) =>
          (
            callbackRef.current as Parameters<
              typeof useSocketOn<O, D | undefined>
            >[1]
          )?.(data, prev) ?? data
      );
    };

    const [on, off] = getSocketHandler(event, handler);

    on?.();

    return off;
  }, [event]);

  return state;
}

/**
 * useSocketEmit 发送事件
 * @param options 与 useRequest 的 options 相同
 * @param plugins 与 useRequest 的 plugins 相同
 * @returns 与 useRequest 的返回值相同
 */
function useSocketEmit<E extends SocketEmit<[EEmit, ...any[]], any>>(
  options?: Options<E[1], E[0]>,
  plugins?: Plugin<E[1], E[0]>[]
) {
  const result = useRequest(
    (event, ...rest) => {
      return new Promise((resolve, reject) => {
        try {
          socketIO.emit(event, ...rest, (res: any) => {
            resolve(res);
          });
        } catch (err) {
          reject(err);
        }
      });
    },
    {
      ...options,
      manual: options?.defaultParams ? options?.manual : true,
      refreshDepsAction:
        options?.refreshDepsAction ??
        (() => options?.defaultParams && result.run(...options.defaultParams)),
    },
    plugins
  );

  return result;
}

export { socketIO, getWebSocket, useSocketOn, useSocketEmit };
