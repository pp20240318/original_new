"use client";

import { useOutsideClick } from "@chakra-ui/react-use-outside-click";
import { Transition } from "@headlessui/react";
import { MinusIcon, PlusIcon, CheckIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import {
  useState,
  useMemo,
  ChangeEventHandler,
  useRef,
  Fragment,
  SetStateAction,
  Dispatch,
} from "react";
// import { WinGoGameCodeEnum, WinGoOddsData } from "../../types";
// import { bgColors } from "../../data";
import { useTranslation } from "react-i18next";
import { WinGoGameCodeEnum, WinGoOddsData } from "./types";
import { useAppConfig } from "@/appconfig";

//const amountOptions = [1, 10, 100, 1000];

export function GameBet({
  amountOptions,
  open,
  gameCode,
  multiples,
  multiple,
  pick,
  setMultiple,
  onCancel,
  onConfirm,
  onOpenRule,
  onClosed,
}: {
  amountOptions: number[];
  open: boolean;
  gameCode: WinGoGameCodeEnum;
  multiples: number[];
  multiple: number;
  pick?: WinGoOddsData;
  setMultiple: Dispatch<SetStateAction<number>>;
  onCancel: () => void;
  onConfirm: (amount: number) => void;
  onOpenRule: () => void;
  onClosed: () => void;
}) {
  const { t } = useTranslation();
  const { SYMBOL } = useAppConfig();
  const [baseAmount, setBaseAmount] = useState(amountOptions[0]);
  const [isAgreed, setIsAgreed] = useState(true);
  const [showAgreedTip, setShowAgreedTip] = useState(false);

  const resetData = () => {
    // setBaseAmount(amountOptions[0]);
    // setMultiple(1);
    setIsAgreed(true);
    setShowAgreedTip(false);
    onClosed();
  };

  const totalAmount = useMemo(() => {
    return baseAmount * multiple;
  }, [baseAmount, multiple]);

  const onTimesChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value.replace(/[^0-9]]/g, "");
    setMultiple(value ? parseInt(value) : 1);
  };

  const onTimesStep = (step: number) => {
    step = multiple + step;
    // step < 1 && (step = 1);
    setMultiple(step);
  };

  const tipRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick({
    ref: tipRef,
    handler: () => setShowAgreedTip(false),
  });

  const onConfirmClick = () => {
    if (!isAgreed) {
      setShowAgreedTip(true);
      return;
    }
    onConfirm(totalAmount);
  };

  const curBg = useMemo(() => {
    if (!pick?.num) return null;
    return pick.num === "big"
      ? "bg-[#ffa82e]"
      : pick.num === "small"
      ? "bg-[#6da7f4]"
      : pick.num === "green"
      ? "bg-[#40ad72]"
      : pick.num === "violet"
      ? "bg-[#b658fe]"
      : pick.num === "red"
      ? "bg-[#fd565c]"
      : +pick.num % 2
      ? "bg-[#40ad72]"
      : "bg-[#fd565c]";
  }, [pick?.num]);

  const amountArr = useMemo(() => {
    if (!pick?.low_limit) return [...amountOptions];
    const arr = amountOptions.filter((item) => item >= +pick.low_limit);
    //arr.unshift(+pick.low_limit);
    if (!arr.length) return [...amountOptions];
    setBaseAmount(arr[0]);
    return arr;
  }, [pick?.low_limit]);

  return (
    <Transition.Root show={open} as="div" afterLeave={resetData}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="top-0 right-0 bottom-0 left-0 z-10 absolute bg-black bg-opacity-50 transition-opacity"></div>
      </Transition.Child>

      <div className="top-0 right-0 bottom-0 left-0 z-10 absolute flex overflow-hidden">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-full"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-full"
        >
          {pick && (
            <div className="bg-base-900 mx-auto mt-auto rounded-t-xl w-full lg:max-w-[480px] max-lg:max-w-[540px]">
              <div
                className={clsx(
                  "after:right-0 before:bottom-0 after:bottom-0 before:left-0 before:absolute after:absolute relative before:bg-gradient-to-tr after:bg-gradient-to-tl before:from-50% before:from-base-900 after:from-50% after:from-base-900 before:to-50% before:to-transparent after:to-50% after:to-transparent pb-[25%] before:pb-[7.86%] after:pb-[7.86%] rounded-t-xl before:w-1/2 after:w-1/2",
                  pick.num === "big"
                    ? "bg-gradient-to-r from-[#ffa82e] to-[#ffc511]"
                    : pick.num === "small"
                    ? "bg-gradient-to-r from-[#6ca6f3] to-[#87bcf5]"
                    : pick.num === "green"
                    ? "bg-gradient-to-r from-[#3faa70] to-[#47ba7c]"
                    : pick.num === "violet"
                    ? "bg-gradient-to-r from-[#b658fe] to-[#cd74ff]"
                    : pick.num === "red"
                    ? "bg-gradient-to-r from-[#fc5050] to-[#ff646c]"
                    : pick.num === "0"
                    ? "bg-gradient-to-br from-[#fb4e4e] from-50% to-[#b658fe] to-50%"
                    : pick.num === "5"
                    ? "bg-gradient-to-br from-[#40ad72] from-50% to-[#eb43dd] to-50%"
                    : +pick.num % 2
                    ? "bg-gradient-to-r from-[#3faa70] to-[#47ba7c]"
                    : "bg-gradient-to-r from-[#fc5050] to-[#ff646c]"
                )}
              >
                <div className="absolute max-xs:pt-0.5 xs:pt-1 w-full">
                  <h3 className="max-xs:my-1 xs:my-2 font-bold text-white text-base text-center">
                    {t`wingo1_game_name`} {t(`wingo1_${gameCode}`)}
                  </h3>
                  <h4 className="bg-white mx-auto p-1 rounded w-[73.75%] font-medium text-xs text-center">
                    {t("wingo1_select_num", { num: pick.num })}
                  </h4>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center mt-3">
                  <label className="mr-auto font-medium text-sm text-base-200">
                    {t`wingo1_balance`}
                  </label>
                  <ul className="flex gap-1.5 ml-4">
                    {amountArr.map((option) => (
                      <li
                        key={option}
                        className={clsx(
                          "flex items-center px-2 h-6 font-medium text-sm cursor-pointer",
                          option === baseAmount
                            ? `text-white ${curBg}`
                            : "text-base-200 bg-base-600"
                        )}
                        onClick={() => setBaseAmount(option)}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center mt-3">
                  <h3 className="mr-auto font-medium text-sm text-base-200">
                    {t`wingo1_quantity`}
                  </h3>
                  <div className="flex gap-1.5 ml-4">
                    <button
                      className={clsx(
                        "flex justify-center items-center w-6 h-6 text-white",
                        curBg
                      )}
                      onClick={() => onTimesStep(-1)}
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <input
                      className="bg-transparent p-0 border border-base-400 outline-none w-16 w-full h-6 font-medium text-sm text-base-200 text-center"
                      value={multiple}
                      onChange={onTimesChange}
                    />
                    <button
                      className={clsx(
                        "flex justify-center items-center w-6 h-6 text-white",
                        curBg
                      )}
                      onClick={() => onTimesStep(1)}
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <ul className="flex justify-end gap-1 mt-3">
                  {multiples.map((item) => (
                    <li
                      key={item}
                      className={clsx(
                        "flex items-center px-2 h-6 font-medium text-sm cursor-pointer",
                        multiple === item
                          ? `text-white ${curBg}`
                          : "text-base-200 bg-base-600"
                      )}
                      onClick={() => setMultiple(item)}
                    >
                      &times;{item}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center mt-5">
                  <button
                    className={clsx(
                      "relative border-2 rounded-full w-5 h-5",
                      isAgreed
                        ? "border-[#fd565c] bg-[#fd565c]"
                        : "border-base-400 bg-transparent"
                    )}
                    onClick={() => setIsAgreed(!isAgreed)}
                  >
                    <CheckIcon
                      className={clsx(
                        "m-[-2px] w-5 h-5",
                        isAgreed ? "text-white" : "text-transparent"
                      )}
                    />
                    {showAgreedTip && (
                      <div
                        ref={tipRef}
                        className="-top-8 before:bottom-[-4px] -left-2 before:left-3 absolute before:absolute bg-[#fd565c] px-2 py-1 before:border-x-transparent before:border-t-[#fd565c] before:border-t-4 before:border-r-4 before:border-l-4 rounded-sm before:w-0 before:h-0 font-medium text-white text-xs whitespace-nowrap"
                      >
                        {t`wingo1_check_rule_tip`}
                      </div>
                    )}
                  </button>

                  <button
                    className="pr-1 pl-2 font-medium text-2xs text-base-200"
                    onClick={() => setIsAgreed(!isAgreed)}
                  >
                    {t`wingo1_agree`}
                  </button>

                  <button
                    className="px-1 font-medium text-[#fd565c] text-2xs"
                    onClick={() => onOpenRule()}
                  >
                    {t`wingo1_presale_rule_title`}
                  </button>
                </div>
              </div>

              <div className="flex h-8">
                <button
                  className="bg-base-400 w-1/3 font-medium text-sm text-base-200"
                  onClick={() => onCancel()}
                >
                  {t`wingo1_cancel`}
                </button>
                <button
                  className={clsx(
                    "w-2/3 font-medium text-white text-sm",
                    curBg
                  )}
                  onClick={onConfirmClick}
                >
                  {t("wingo1_total_amount", {
                    SYMBOL: SYMBOL,
                    totalAmount: totalAmount,
                  })}
                </button>
              </div>
            </div>
          )}
        </Transition.Child>
      </div>
    </Transition.Root>
  );
}
