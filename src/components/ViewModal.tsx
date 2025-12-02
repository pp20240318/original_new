import React from "react";
import { UxModal } from "../../ui";
import { ReactNode } from "react";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { DialogTitle } from "@headlessui/react";
import clsx from "clsx";
export default function ViewModal({
  open,
  children,
  onClose,
  title,
  footer,
  width = "340px",
  closeTitle = "Close",
  isFootClose,
  onConfirm,
}: {
  open: boolean;
  children?: ReactNode;
  onClose?: () => void;
  title: string;
  footer?: ReactNode;
  width?: string;
  closeTitle?: string;
  isFootClose?: boolean;
  onConfirm?: () => void;
}) {
  return (
    <UxModal
      styles={{
        overlay: {
          width: document.documentElement.style.maxWidth,
          margin: "auto",
        },
        container: {
          width: document.documentElement.style.maxWidth,
          margin: "auto",
        },
      }}
      open={open}
      render={
        <div className="relative flex flex-col rounded-lg shadow-xl bg-back-200 ">
          <button
            className="absolute top-3 right-3 flex justify-center items-center w-9 h-9 text-base-200 hover:text-base-white"
            onClick={onClose}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          <DialogTitle
            as="h2"
            className={clsx(
              "shrink-0 text-base-white text-lg font-semibold leading-6 truncate pl-6 pr-16 py-4 text-center"
            )}
          >
            {title}
          </DialogTitle>
          <div
            className="custom-scroll  text-base-white text-xs m-2 overflow-auto max-h-[40vh] break-all"
            style={{ width: width }}
          >
            {children}
          </div>
          {!footer && (
            <div className=" mx-2  mt-5 pb-5 items-center flex justify-between">
              <button
                className="flex-1 h-10 bg-[#ECF24F] rounded-3xl  text-sm"
                onClick={() => {
                  if (!isFootClose) {
                    onClose?.();
                  }
                  onConfirm?.();
                }}
              >
                {closeTitle}
              </button>
            </div>
          )}
        </div>
      }
      onClose={onClose}
    />
  );
}
