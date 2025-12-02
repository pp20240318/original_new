"use client";

import { CSSProperties, Fragment, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { createRoot } from "react-dom/client";
import "./index.css";
import { useSiteConfig } from "@/app/hook";
import { SiteConfig } from "@/app/siteConfig";
import SiteConfigProvider from "@/app/siteConfigProvider";
import { SWRConfigProvider } from "@/app/SWRConfigProvider";
import { useRouter } from "next/navigation";
import {
  AppRouterContext,
  AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface UxModalProps {
  className?: string;
  style?: CSSProperties;
  classNames?: {
    root?: string;
    overlay?: string;
    container?: string;
    header?: string;
    body?: string;
    content?: string;
    footer?: string;
  };
  styles?: {
    root?: CSSProperties;
    overlay?: CSSProperties;
    container?: CSSProperties;
    header?: CSSProperties;
    body?: CSSProperties;
    content?: CSSProperties;
    footer?: CSSProperties;
  };
  zIndex?: number;
  open?: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  render?: React.ReactNode;
  maskHide?: boolean;
  showCloseButton?: boolean;
  onClose?: () => void;
  onClosed?: () => void;
}

export interface UxModalRenderEvents {
  close: () => void;
}

export interface UxModalRenderProps
  extends Omit<
    UxModalProps,
    "open" | "title" | "content" | "footer" | "render" | "onClose"
  > {
  title?: React.ReactNode | ((e: UxModalRenderEvents) => React.ReactNode);
  content?: React.ReactNode | ((e: UxModalRenderEvents) => React.ReactNode);
  footer?: React.ReactNode | ((e: UxModalRenderEvents) => React.ReactNode);
  render?: React.ReactNode | ((e: UxModalRenderEvents) => React.ReactNode);
  onClose?: (e: UxModalRenderEvents) => void;
}

const UxModal = ({
  className,
  style,
  classNames,
  styles,
  zIndex,
  open,
  title,
  children,
  footer,
  render,
  maskHide,
  showCloseButton = true,
  onClose,
  onClosed,
}: UxModalProps) => {
  return (
    <Transition show={open} as={Fragment} afterLeave={onClosed}>
      <Dialog
        as="div"
        className={clsx("relative z-50 focus:outline-none", classNames?.root)}
        style={{ ...styles?.root, zIndex }}
        onClose={() => {}}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={clsx(
              "fixed top-0 left-0 right-0 bottom-0",
              !maskHide && " bg-base-black/75 backdrop-blur-lg",
              classNames?.overlay
            )}
            style={styles?.overlay}
          />
        </TransitionChild>

        <div
          className={clsx(
            "fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center px-4 py-8",
            classNames?.container
          )}
          style={styles?.container}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leave="ease-out duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
          >
            {render ? (
              <DialogPanel className="relative">{render}</DialogPanel>
            ) : (
              <DialogPanel
                className={clsx(
                  "relative flex flex-col rounded-lg shadow-xl bg-back-200 max-h-full w-full sm:w-full sm:max-w-lg md:max-w-2xl",
                  className
                )}
                style={style}
              >
                {showCloseButton && (
                  <button
                    className="absolute top-3 right-3 flex justify-center items-center w-9 h-9 text-base-200 hover:text-base-white"
                    onClick={onClose}
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                )}

                {typeof title === "string" ? (
                  <DialogTitle
                    as="h2"
                    className={clsx(
                      "shrink-0 text-base-white text-lg font-semibold leading-6 truncate pl-6 pr-16 py-5",
                      classNames?.header
                    )}
                    style={styles?.header}
                  >
                    {title}
                  </DialogTitle>
                ) : (
                  title
                )}

                {typeof children === "string" ? (
                  <div
                    className={clsx("overflow-y-auto", classNames?.body)}
                    style={styles?.body}
                  >
                    <div
                      className={clsx(
                        "text-lg text-base-200 text-center px-6 pb-6",
                        !title && "pt-10",
                        classNames?.content
                      )}
                      style={styles?.content}
                    >
                      {children}
                    </div>
                  </div>
                ) : (
                  children
                )}

                {footer && (
                  <div
                    className={clsx(
                      "shrink-0 flex justify-center items-center px-6 py-4 rounded-b-lg border-t border-solid border-base-800 bg-back-300",
                      classNames?.footer
                    )}
                    style={styles?.footer}
                  >
                    {footer}
                  </div>
                )}
              </DialogPanel>
            )}
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

const UxModalRender = ({
  title,
  content,
  footer,
  render,
  onClose,
  ...props
}: UxModalRenderProps) => {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  useEffect(() => setOpen(true), []);

  const titleNode = useMemo(() => {
    return typeof title === "function" ? title({ close }) : title;
  }, [title]);

  const contentNode = useMemo(() => {
    return typeof content === "function" ? content({ close }) : content;
  }, [content]);

  const footerNode = useMemo(() => {
    return typeof footer === "function" ? footer({ close }) : footer;
  }, [footer]);

  const renderNode = useMemo(() => {
    return typeof render === "function" ? render({ close }) : render;
  }, [render]);

  return (
    <UxModal
      {...props}
      open={open}
      title={titleNode}
      footer={footerNode}
      render={renderNode}
      onClose={onClose ? () => onClose({ close }) : close}
    >
      {contentNode}
    </UxModal>
  );
};

const createModal = ({
  props,
  siteConfig,
  router,
}: {
  props: UxModalRenderProps;
  siteConfig: SiteConfig;
  router: AppRouterInstance;
}) => {
  const uxPortal = document.createElement("div");
  uxPortal.className = "ux-portal";
  document.body.appendChild(uxPortal);
  const handleClosed = () => {
    modalRoot.unmount();
    uxPortal.remove();
    props.onClosed?.();
  };
  const modalRoot = createRoot(uxPortal);
  modalRoot.render(
    <AppRouterContext.Provider value={router}>
      <SiteConfigProvider siteConfig={siteConfig}>
        <SWRConfigProvider siteConfig={siteConfig}>
          <UxModalRender {...props} onClosed={handleClosed} />
        </SWRConfigProvider>
      </SiteConfigProvider>
    </AppRouterContext.Provider>
  );
  return;
};

const useUxModal = () => {
  const siteConfig = useSiteConfig();
  const router = useRouter();

  return {
    openUxModal: (props: UxModalRenderProps) => {
      return createModal({ props, siteConfig, router });
    },
  };
};

export { UxModal, useUxModal };
