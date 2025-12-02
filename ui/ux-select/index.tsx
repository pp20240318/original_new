"use client";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/16/solid";

import clsx from "clsx";
import {
  ChangeEventHandler,
  Children,
  Fragment,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePopper } from "react-popper";
import { useTranslation } from "react-i18next";

export const cancelBubble = (e: SyntheticEvent) => {
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
};

export const getComponentDisplayName = (element: React.ReactElement<any>) => {
  const node = element as React.ReactElement<React.ComponentType<any>>;
  const type = (node as unknown as React.ReactElement<React.FunctionComponent>)
    .type;
  const displayName =
    typeof type === "function"
      ? (type as React.FunctionComponent).displayName ||
        (type as React.FunctionComponent).name ||
        "Unknown"
      : type;
  return displayName;
};

export type UxNativeProps = {
  className?: string;
  style?: React.CSSProperties;
} & React.AriaAttributes;

export type UxSelectValue = string | number | Record<string, any>;

export type UxSelectProps<V> = {
  triggerClass?: string;
  textClass?: string;
  iconClass?: string;
  popoverClass?: string;
  popinnerClass?: string;
  value?: V;
  render: React.ReactNode;
  placeholder?: string;
  placement?: NonNullable<Parameters<typeof usePopper>[2]>["placement"];
  filterValue?: string;
  filterable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  required?: boolean;
  effect?: boolean;
  prefix?: React.ReactNode;
  error?: boolean | string;
  onFilterChange?: (value: string) => void;
  onChange?: (value?: V) => void;
  onClear?: () => void;
  children?: React.ReactNode;
} & UxNativeProps;

const UxSelect = <V extends UxSelectValue>({
  className,
  style,
  triggerClass,
  textClass,
  iconClass,
  popoverClass,
  popinnerClass,
  value,
  render,
  placeholder,
  placement,
  filterValue = "",
  filterable,
  clearable,
  disabled,
  required,
  effect,
  prefix,
  error,
  onFilterChange,
  onChange,
  onClear,
  children,
}: UxSelectProps<V>) => {
  const { t } = useTranslation();

  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);

  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      { name: "offset", options: { offset: effect ? [0, 8] : [0, 4] } },
    ],
    placement,
  });

  const [selectValue, setSelectValue] = useState<V>("" as V);

  useEffect(() => {
    setSelectValue(value ?? ("" as V));
  }, [value]);

  const onSelectChange = (value: V) => {
    if (onChange) {
      onChange(value);
    } else {
      setSelectValue(value);
    }
  };

  const onSelectClear = (e: React.SyntheticEvent) => {
    cancelBubble(e);
    setSelectValue("" as V);
    onChange?.(undefined);
    onClear?.();
  };

  const filterRef = useRef<HTMLInputElement | null>(null);

  return (
    <Listbox
      as="div"
      className={className}
      style={style}
      value={selectValue}
      onChange={onSelectChange}
    >
      <ListboxButton
        ref={setReferenceElement}
        className={clsx(
          "relative flex items-stretch w-full text-left font-semibold rounded-lg border bg-[rgba(68,88,116,0.24)] hover:bg-[rgba(68,88,116,0.32)] shadow-md shadow-black/15 transition-colors focus:outline-none",
          error ? "border-error-default" : "border-transparent",
          effect ? "text-sm h-14 py-2 px-4" : "text-xs h-9 py-1.5 px-3",
          triggerClass
        )}
        disabled={disabled}
      >
        {({ open }) => {
          /* eslint-disable react-hooks/rules-of-hooks */
          useEffect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            !open && onFilterChange?.("");
            setTimeout(() => {
              if (open) {
                filterRef.current?.focus();
              } else {
                filterRef.current?.blur();
              }
            });
          }, [open]);
          /* eslint-enable react-hooks/rules-of-hooks */
          return (
            <>
              {prefix && <div className="shrink-0 mr-2">{prefix}</div>}

              <div className="relative grow flex items-center overflow-hidden">
                <div className="absolute inset-0 top-0 left-0 right-0 bottom-0 flex items-center">
                  <span
                    className={clsx(
                      "truncate",
                      effect
                        ? "origin-left duration-100"
                        : render || render === 0
                        ? "hidden"
                        : null,
                      effect && (open || render || render === 0)
                        ? "text-primary-default scale-[0.85] -translate-y-2.5"
                        : "text-base-400",
                      required &&
                        'before:text-error-default before:content-["*"] before:align-middle before:mr-1'
                    )}
                  >
                    {placeholder}
                  </span>
                </div>

                <div className={clsx("relative grow", effect && "mt-4")}>
                  <span
                    className={clsx(
                      "block min-h-4 truncate",
                      !filterable || !open
                        ? "text-white"
                        : filterValue
                        ? "opacity-0"
                        : "text-base-400",
                      textClass
                    )}
                  >
                    {render}
                  </span>
                  {filterable && (
                    <input
                      ref={filterRef}
                      className={clsx(
                        "pointer-events-none absolute top-0 left-0 text-white w-full border-none outline-none bg-transparent",
                        textClass
                      )}
                      type="text"
                      value={filterValue}
                      onChange={(e) => onFilterChange?.(e.target.value)}
                    />
                  )}
                </div>
              </div>

              {clearable && selectValue
                ? !disabled && (
                    <span
                      className="shrink-0 flex items-center ml-1"
                      onClick={onSelectClear}
                    >
                      <XMarkIcon className="text-base-200 w-5 h-5" />
                    </span>
                  )
                : !disabled && (
                    <span
                      className={clsx(
                        "pointer-events-none flex items-center",
                        effect ? "ml-3" : "ml-2"
                      )}
                    >
                      <ChevronDownIcon
                        className={clsx(
                          "h-4 w-4 text-base-200 transition-transform",
                          open && "rotate-180",
                          iconClass
                        )}
                      />
                    </span>
                  )}
            </>
          );
        }}
      </ListboxButton>

      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          ref={setPopperElement}
          className={clsx(
            "z-10 rounded-lg bg-base-900 shadow-md shadow-black/15",
            effect ? "py-3" : "py-[0.375rem]",
            popoverClass
          )}
          style={{ ...styles.popper, minWidth: referenceElement?.offsetWidth }}
          {...attributes.popper}
        >
          <ListboxOptions
            className={clsx(
              "max-h-60 overflow-auto scrollbar focus:outline-none custom-scroll",
              effect ? "px-3" : "px-[0.625rem]",
              popinnerClass
            )}
          >
            {Children.count(children) ? (
              children
            ) : (
              <li className="text-xs text-base-400 text-center font-semibold leading-5 min-h-5">{t`common_no_data`}</li>
            )}
          </ListboxOptions>
        </div>
      </Transition>

      {error && typeof error === "string" && (
        <div className="text-error-default text-xs font-medium break-words mt-1 px-4">
          {error}
        </div>
      )}
    </Listbox>
  );
};

export type UxOptionProps<V> = {
  textClass?: string;
  value?: V;
  label?: React.ReactNode;
  effect?: boolean;
  children?: React.ReactNode;
} & UxNativeProps;

const UxOption = <V extends UxSelectValue>({
  className,
  style,
  textClass,
  value,
  label,
  effect,
  children,
}: UxOptionProps<V>) => {
  return (
    <ListboxOption
      className={({ selected, focus }) => {
        return clsx(
          "group relative cursor-pointer select-none pl-3 pr-[0.375rem] transition-colors",
          effect ? "py-3" : "py-2",
          className,
          selected
            ? "text-white rounded-md bg-base-600"
            : focus
            ? "text-white"
            : "text-base-400"
        );
      }}
      style={style}
      value={value}
    >
      {children ?? (
        <span
          className={clsx(
            "text-xs font-semibold leading-5 min-h-5 block truncate",
            textClass
          )}
        >
          {label}
        </span>
      )}
    </ListboxOption>
  );
};

export { UxSelect, UxOption };
