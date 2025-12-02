"use client";

import { Transition } from "@headlessui/react";
import { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

export function DialogPresaleRule({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Transition.Root show={open} as="div">
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="absolute z-20 top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 transition-opacity"></div>
      </Transition.Child>

      <div className="absolute z-20 top-0 left-0 right-0 bottom-0">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="flex m-auto max-w-md w-full h-full p-6">
            <div className="flex flex-col m-auto w-11/12 max-h-full rounded-sm shadow-2xl overflow-hidden">
              <div className="relative">
                <img className="-mb-1" src="/wingo/dialog-header-bg.png" />
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-white font-medium text-sm ">{t`wingo1_presale_rule_title`}</div>
              </div>

              <div className="bg-white overflow-auto p-3 ">
                <div
                  className={clsx(
                    "font-medium text-2xs ",
                    "text-base-900"
                  )}
                >
                  <p className="mb-2.5">
                    {t("wingo1_presale_rules_p1")}
                  </p>
                  <p className="mb-2.5">
                    {t("wingo1_presale_rules_r1")}
                  </p>
                  <p className="mb-2.5">
                    {t("wingo1_presale_rules_r11")}
                  </p>
                  <p className="mb-2.5">
                    {t("wingo1_presale_rules_r12")}
                  </p>
                  <p className="mb-2.5">
                    {t("wingo1_presale_rules_r13")}
                  </p>
                  <p className="mb-2.5">
                    {t("wingo1_presale_rules_r14")}
                  </p>
                  <p>{t("wingo1_presale_rules_r15")}</p>
                </div>
              </div>

              <div className="flex justify-center rounded-b-2xl bg-white py-4 ">
                <button
                  className="text-white font-semibold rounded-full bg-[#f2413b] text-xs  w-3/5 h-8  px-4"
                  onClick={() => onClose()}
                >
                  {t`wingo1_i_know`}
                </button>
              </div>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition.Root>
  );
}
