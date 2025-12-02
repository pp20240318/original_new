"use client";

import { useTranslation } from "react-i18next";
// import { WinGoOdds, WinGoOddsData, WinGoOpenInfoData } from "../../types";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { WinGoOdds, WinGoOddsData } from "./types";

let randomTimer: number | null = null;
const colorList = ["green", "violet", "red"];
const sizeList = ["big", "small"];
const numberList = Array.from({ length: 10 }, (_, i) => ({
  num: (i ) +"",
}));

export function GamePicker({
  opening,
  seconds,
  multiples,
  multiple,
  setMultiple,
  onPick,
}: {
  opening: boolean;
  seconds?: number;
  multiples: number[];
  multiple: number;
  setMultiple: Dispatch<SetStateAction<number>>;
  onPick: (value: WinGoOddsData) => void;
}) {
  const { t } = useTranslation();

  const secondsLayout = useMemo(() => {
    if (typeof seconds !== "number") return ["-", "-"];
    return [Math.floor(seconds / 10) % 10, seconds % 10];
  }, [seconds]);

  const [randomIndex, setRandomIndex] = useState<number>();

  const clearTimer = () => {
    if (randomTimer === null) return;
    window.clearInterval(randomTimer);
    randomTimer = null;
  };

  const onRandomPick = () => {
    clearTimer();
    let count = 0;
    randomTimer = window.setInterval(() => {
      count++;
      const index = Math.floor(Math.random() * 10);
      setRandomIndex(index);
      if (count > 100) {
        clearTimer();
        setRandomIndex(undefined);
        // odds && onPick(odds.numbers[index]);
      }
    }, 50);
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  return (
    <div className="relative mt-4 p-1.5 rounded-lg bg-base-900">
      <ul className="flex gap-2">
        {colorList.map((item) => (
          <li
            key={item}
            className={clsx(
              "cursor-pointer flex justify-center items-center text-white font-medium text-xs  w-1/3 h-8 ",
              item === "green" &&
                "bg-[#40ad72] shadow-[0_0.125rem_0.375rem_rgba(64,173,114,0.5)] rounded-tr-lg rounded-bl-lg ",
              item === "violet" &&
                "bg-[#b659fe] shadow-[0_0.125rem_0.375rem_rgba(182,89,254,0.5)] rounded-lg ",
              item === "red" &&
                "bg-[#fd565c] shadow-[0_0.125rem_0.375rem_rgba(253,86,92,0.5)] rounded-tl-lg rounded-br-lg "
            )}
            onClick={() => onPick({
              num:item,
              tp3:(item=="green"?"G":(item=="violet"?"V":"R")),
            } as WinGoOddsData)}
          >
            {t(`wingo1_${item}`)}
          </li>
        ))}
      </ul>
      <ul className="grid grid-cols-5 rounded-lg bg-base-600 gap-x-2.5 gap-y-1 p-2.5 mt-2">
        {numberList.map((item, index) => (
          <li
            key={item.num}
            className={clsx(
              "cursor-pointer w-full duration-75",
              index === randomIndex && "scale-90"
            )}
            onClick={() => onPick({
              num:item.num,
              tp3:item.num,
            } as WinGoOddsData)}
          >
            <img className="w-full" src={`/wingo/n${index}.png`} />
          </li>
        ))}
      </ul>

      <div className="flex mt-2">
        <button
          className="text-[#fd565c] border border-[#fd565c] rounded-md text-xs h-7 px-1.5 mr-1 "
          onClick={onRandomPick}
        >
          {t`wingo1_random`}
        </button>
        <ul className="flex grow gap-1">
          {multiples.map((item) => (
            <li
              key={item}
              className={clsx(
                "cursor-pointer flex justify-center items-center rounded-md text-xs  w-1/6",
                multiple === item
                  ? "text-white bg-[#40ad72]"
                  : "text-base-200 bg-base-600"
              )}
              onClick={() => setMultiple(item)}
            >
              &times;{item}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 px-2.5 mt-2 ">
        {sizeList.map((item) => (
          <button
            key={item}
            className={clsx(
              "text-white font-medium text-xs h-8 ",
              item === "big" && "rounded-l-full bg-[#ffa82e]",
              item === "small" && "rounded-r-full bg-[#6da7f4]"
            )}
            onClick={() => onPick({
              num:item,
              tp3:(item=="big"?"B":"S"),
            } as WinGoOddsData)}
          >
            {t(`wingo1_${item}`)}
          </button>
        ))}
      </div>

      <div
        className={clsx(
          "absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center gap-8 bg-black/60",
          opening && "hidden"
        )}
      >
        <span className="text-white text-center font-semibold leading-[1.2] rounded-xl bg-[#fd565c] text-[7.5rem] w-28 ">
          {secondsLayout[0]}
        </span>
        <span className="text-white text-center font-semibold leading-[1.2] rounded-xl bg-[#fd565c] text-[7.5rem] w-28">
          {secondsLayout[1]}
        </span>
      </div>
    </div>
  );
}
