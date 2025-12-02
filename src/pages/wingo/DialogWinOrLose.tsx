"use client";

import { Transition } from "@headlessui/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckIcon } from "@heroicons/react/16/solid";
import { XCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { WinGoLatestResultData } from "./types";
import { getLocal, setLocal } from "@/utils/localStorage";

let autoCloseTimer: number | null = null;

export function DialogWinOrLose({
  open,
  drawResult,
  userProfit,
  currencySymbol,
  onClose,
}: {
  open: boolean;
  drawResult?: WinGoLatestResultData | null;
  userProfit?: number | null;
  currencySymbol: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  const [autoCloseWinOrLose, setAutoCloseWinOrLose] = useState(
    !!getLocal("autoCloseWinOrLose")
  );

  const isWin = useMemo(() => {
    return typeof userProfit === "number" && userProfit > 0;
  }, [userProfit]);

  const result = useMemo(() => {
    if (!drawResult) return;
    const num = +drawResult.num1;
    const color = [num % 2 ? "green" : "red"].concat(
      [0, 5].includes(num) ? ["violet"] : []
    );
    const size = num < 5 ? "small" : "big";
    return { color, num, size };
  }, [drawResult]);

  const clearAutoCloseTimer = () => {
    if (!autoCloseTimer) return;
    window.clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
  };

  useEffect(() => {
    if (!open) return;
    if (autoCloseWinOrLose) {
      autoCloseTimer = window.setTimeout(() => onClose(), 3000);
    } else {
      clearAutoCloseTimer();
    }
    return clearAutoCloseTimer;
  }, [open, autoCloseWinOrLose]);

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

      <div className="absolute z-20 top-0 left-0 right-0 bottom-0 flex justify-center items-center">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="relative shrink-0 max-2xs:scale-[0.8] max-xs:scale-90">
            <img
              className="w-[23.25rem]"
              src={`/wingo/${isWin ? "win" : "lose"}-bg.png`}
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center pt-40">
              <h3 className="text-white text-3xl font-bold">
                {isWin ? "Congratulations" : "Sorry"}
              </h3>
              <div className="flex items-center gap-2 text-white text-sm font-medium mt-9">
                <label className="flex justify-center items-center h-7 mr-1">
                  {t`wingo1_lottery_results`}
                </label>
                {result && (
                  <>
                    <span
                      className={clsx(
                        "flex justify-center items-center h-7 px-2 rounded-md bg-[#40ad72]",
                        result.color[0] === "green" &&
                          (result.color.length > 1
                            ? "bg-gradient-to-br from-[#40ad72] from-50% to-[#b659fe] to-50%"
                            : "bg-[#40ad72]"),
                        result.color[0] === "red" &&
                          (result.color.length > 1
                            ? "bg-gradient-to-br from-[#fd565c] from-50% to-[#b659fe] to-50%"
                            : "bg-[#fd565c]")
                      )}
                    >
                      {result.color.map((c) => t(`wingo1_${c}`)).join(" ")}
                    </span>
                    <span
                      className={clsx(
                        "flex justify-center items-center w-7 h-7 rounded-full bg-[#40ad72]",
                        result.num === 0
                          ? "bg-gradient-to-br from-[#fd565c] from-50% to-[#b659fe] to-50%"
                          : result.num === 5
                          ? "bg-gradient-to-br from-[#40ad72] from-50% to-[#b659fe] to-50%"
                          : result?.num % 2
                          ? "bg-[#40ad72]"
                          : "bg-[#fd565c]"
                      )}
                    >
                      {result?.num}
                    </span>
                    <span
                      className={clsx(
                        "flex justify-center items-center h-7 px-2 rounded-md bg-[#40ad72]",
                        result.size === "big" ? "bg-[#ffc511]" : "bg-[#6da7f4]"
                      )}
                    >
                      {t(`wingo1_${result.size}`)}
                    </span>
                  </>
                )}
              </div>
              <div className="flex flex-col items-center mt-10">
                <label className="text-[#f54a32] text-base font-semibold leading-5 h-5">
                  {isWin ? t`wingo1_bonus` : ""}
                </label>
                {isWin ? (
                  <span className="text-[#f54a32] text-3xl font-bold">
                    {currencySymbol}
                    {userProfit}
                  </span>
                ) : (
                  <span className="text-[#587ba4] text-3xl font-bold">
                    {t`wingo1_lose`}
                  </span>
                )}
                <span className="text-[#6b6b6b] text-sm font-medium mt-2">
                  {t`wingo1_period`}: {drawResult?.DropDate}
                </span>
              </div>
              <div className="absolute left-10 bottom-8 flex items-center">
                <button
                  className="relative w-7 h-7 mr-2 rounded-full border border-white bg-white/25"
                  onClick={() => {
                    setLocal("autoCloseWinOrLose", !autoCloseWinOrLose);
                    setAutoCloseWinOrLose(
                      !!getLocal("autoCloseWinOrLose")
                    );
                  }}
                >
                  <CheckIcon
                    className={clsx(
                      "-m-px w-7 h-7",
                      autoCloseWinOrLose ? "text-white" : "text-transparent"
                    )}
                  />
                </button>
                <span className="text-white text-base font-medium">
                  {t`wingo1_auto_close`}
                </span>
              </div>
              <button
                className="absolute left-1/2 -translate-x-1/2 -bottom-14"
                onClick={onClose}
              >
                <XCircleIcon className="text-white w-12 h-12" />
              </button>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition.Root>
  );
}
