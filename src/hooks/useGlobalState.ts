import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useCallback,
} from "react";

export class GlobalState<T, E extends string = "onEvent"> {
  private _state: T;
  private _listeners = new Set<Dispatch<SetStateAction<T>>>();
  private _events = {} as Record<E, Set<(state: T) => void>>;
  constructor(state: T) {
    this._state = state;
  }
  get state() {
    return this._state;
  }
  update(state: T) {
    this._state = state;
    this._listeners.forEach((listener) => {
      listener(state);
    });
  }
  dispatch(event: E) {
    if (!this._events[event]) return;
    this._events[event].forEach((e) => e(this._state));
  }
  useGlobalState(events?: Partial<Record<E, (state: T) => void>>) {
    /* eslint-disable react-hooks/rules-of-hooks */
    const [state, setState] = useState(this._state);
    useEffect(() => {
      this._listeners.add(setState);
      for (const event in events) {
        if (!events[event]) continue;
        this._events[event] = this._events[event] || new Set();
        this._events[event].add(events[event]);
      }
      return () => {
        this._listeners.delete(setState);
        for (const event in events) {
          if (!events[event]) continue;
          this._events[event].delete(events[event]);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return state;
    /* eslint-enable react-hooks/rules-of-hooks */
  }
  add(listener: Dispatch<SetStateAction<T>>) {
    this._listeners.add(listener);
  }
  remove(listener: Dispatch<SetStateAction<T>>) {
    this._listeners.delete(listener);
  }
}

const GLOBAL_STORE_CHANGE_EVENT = "__GLOBAL_STORE_CHANGE_EVENT__";

const dispatchEvent = <T>(key: string, value: T) => {
  window.dispatchEvent(
    new CustomEvent(GLOBAL_STORE_CHANGE_EVENT, {
      detail: { key, value },
    })
  );
};

export const useGlobalState = <T>(key: string, state: { current?: T }) => {
  const [value, setValue] = useState(state.current);

  const updateValue: Dispatch<SetStateAction<T>> = useCallback(
    (newValue) => {
      if (typeof newValue === "function") {
        setValue((prev) => {
          const computedNewValue = (newValue as (prev: T) => T)(prev as T);
          dispatchEvent(key, computedNewValue);
          state.current = computedNewValue;
          return computedNewValue;
        });

        return;
      }

      state.current = newValue;
      dispatchEvent(key, newValue);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  );

  useEffect(() => {
    const onValueChange = ((e: { detail: { value: T; key: string } }) => {
      if (e.detail.key === key) {
        setValue(e?.detail?.value);
      }
    }) as unknown as (e: Event) => void;

    window.addEventListener(GLOBAL_STORE_CHANGE_EVENT, onValueChange);

    return () => {
      window.removeEventListener(GLOBAL_STORE_CHANGE_EVENT, onValueChange);
    };
  }, [key]);

  const result = [value, updateValue];

  return result as [value: T, updateValue: typeof updateValue];
};

export const createGlobalStore = <T>(key: string, initialState?: T) => {
  const state = { current: initialState };
  return () => useGlobalState<T>(key, state);
};
