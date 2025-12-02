import { useEffect, useState } from "react";
import { nanoid } from "nanoid";

export function createEvent<T = any>(): {
  readonly emit: (value?: T | ((prev?: T) => T | undefined)) => void;
  readonly use: (
    callback?: (detail?: T) => void,
    isUseState?: boolean
  ) => T | undefined;
};

export function createEvent<T = any>(
  defaultValue: T
): {
  readonly emit: (value: T | ((prev: T) => T)) => void;
  readonly use: (callback?: (detail: T) => void, isUseState?: boolean) => T;
};

/**
 * createEvent 创建一个唯一的自定义事件, 并使事件携带的参数作为全局共享的状态
 * 使用返回的 emit 和 use 方法针对此事件进行触发和监听
 * @param defaultValue 全局状态的默认值, 有传入时对应的emit需携参(需要其它情况再酌情修改)
 * @returns { emit, use }
 */
export function createEvent<T = any>(defaultValue?: T) {
  const eventName = nanoid();
  return {
    /**
     * emit 触发事件(携带的参数会更新全局共享的状态)
     * @param value 触发事件携带的参数, 可以是一个能接收到旧值的函数(需要返回新值)
     */
    emit(value?: T | ((prev?: T) => T | undefined)) {
      defaultValue =
        typeof value === "function"
          ? (value as (prev?: T) => T | undefined)(defaultValue)
          : value;
      const event = new CustomEvent(eventName, {
        detail: defaultValue,
      });
      window.dispatchEvent(event);
    },
    /**
     * use 监听事件(同时可以返回最新状态)
     * @param callback 不传则返回一个全局状态 | 传则不更新状态(避免组件无效刷新)
     * @param isUseState 如果同时需要在回调中处理事务和使用全局状态则传入true
     * @returns isUseState 为 true 时, 返回全局共享的状态
     */
    use(callback?: (detail?: T) => void, isUseState?: boolean) {
      const [state, setState] = useState(defaultValue);
      useEffect(() => {
        const eventHandler = (event: Event) => {
          const { detail } = event as CustomEvent<T | undefined>;
          callback?.(detail);
          if (!callback || isUseState) setState(detail);
        };
        window.addEventListener(eventName, eventHandler, false);
        return () => {
          window.removeEventListener(eventName, eventHandler, false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      return state;
    },
  } as const;
}
