"use client";

import { DocumentTextIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import {
  WinGoGameCodeEnum,
  WinGoLatestResultData,
  WinGoOpenInfoData,
} from "./types";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { formatCountdown } from "@/utils/formatCountdown";

let randomTimer: number | null = null;

export function GameInfo({
  openInfo,
  seconds,
  drawing,
  drawResult,
  gameCode,
  onOpenRule,
}: {
  openInfo: WinGoOpenInfoData;
  seconds?: number;
  drawing: boolean;
  drawResult?: WinGoLatestResultData | null;
  gameCode: WinGoGameCodeEnum;
  onOpenRule: () => void;
}
) {
  const { t } = useTranslation();

  const [result, setResult] = useState<number[] | string[]>();

  const countdown = useMemo(() => {
    if (typeof seconds !== "number") return ["-", "-", ":", "-", "-"];
    const { m1, m2, s1, s2 } = formatCountdown(seconds);
    return [m1, m2, ":", s1, s2];
  }, [seconds]);

  const clearTimer = () => {
    if (randomTimer === null) return;
    window.clearInterval(randomTimer);
    randomTimer = null;
  };

  useEffect(() => {
    clearTimer();
    console.log("drawing",drawing);
    if (drawing) {
      randomTimer = window.setInterval(() => {
        setResult(
          Array.from({ length: 5 }, () => Math.floor(Math.random() * 10))
        );
      }, 200);
    } else {
      if (drawResult) {
        const { num1, num2, num3, num4, num5 } = drawResult;
        setResult([+num1, +num2, +num3, +num4, +num5]);
      } else {
        setResult(["?", "?", "?", "?", "?"]);
      }
    }

    return clearTimer;
  }, [drawing, drawResult]);

  return (
    <div className="relative mt-4">
      <img className="w-full" src="/wingo/info-bg.png" />
      <div className="absolute top-0 left-0 right-0 bottom-0 grid grid-cols-2">
        <div className="relative flex flex-col justify-evenly py-1 px-3">
          <button
            className="flex justify-center items-center text-white border border-white rounded-full py-1"
            onClick={onOpenRule}
          >
            <DocumentTextIcon className="w-3 h-3 " />
            <span className="ml-1 font-medium text-3xs ">{t`wingo1_how_to_play`}</span>
          </button>
          <h4 className="text-white font-medium px-2 text-3xs">
            {t`wingo1_game_name`} {t(`wingo1_${gameCode}`)}
          </h4>
          <ul className="flex gap-1">
            {result?.map((n, i) => (
              <li
                key={i}
                className="flex justify-center items-center w-5 h-5 "
              >
                {typeof n === "number" ? (
                  <img src={`/wingo/n${n}.png`} />
                ) : (
                  <span className="text-white font-semibold text-xs">
                    {n}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative flex flex-col justify-evenly items-end py-1 px-3">
          <h4 className="text-white font-semibold text-3xs ">{t`wingo1_time_remaining`}</h4>
          <div className="flex gap-1 ">
            {countdown.map((n, i) => (
              <span
                key={i}
                className={clsx(
                  "flex justify-center items-center text-[#f85050] font-bold text-lg bg-[#f2f2f2]",
                  i === 2
                    ? "w-3 h-7"
                    : "w-4 h-7",
                  i === 0 && "rounded-tl-lg",
                  i === 4 && "rounded-br-lg"
                )}
              >
                {n}
              </span>
            ))}
          </div>
          <div className="text-white font-semibold text-sm">
            {openInfo?.DropDate ?? "--"}
          </div>
        </div>
      </div>
    </div>
  );
}
