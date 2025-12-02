"use client";

import { useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { WinGoGameHistory, WinGoGameHistoryData } from "./types";

export function GameHistory({
  show,
  page,
  isEnd,
  data,
  onChange,
}: {
  show: boolean;
  page: number;
  isEnd: boolean;
  data?: WinGoGameHistoryData[];
  onChange: (page: number) => void;
}) {
  const { t } = useTranslation();
  const list = useMemo(() => {
    if (!data) return;
    
    const listData: WinGoGameHistory[] = data.map((item) => {
      const period = item.stage;
      const price = item.result.replace(/\,/g, "");
      const number = +item.result.slice(-1);
      const size = number < 5 ? "small" : "big";
      const color: ("red" | "green" | "violet")[] = [
        number % 2 ? "green" : "red",
      ];
      if ([0, 5].includes(number)) color.push("violet");
      return { period, price, number, size, color };
    });
    
    return listData;
  }, [data]);

  return (
    <div className={clsx("mt-4", !show && "hidden")}>
      <table className="w-full">
        <thead>
          <tr className="text-white text-2xs h-8 ">
            <th className="font-medium w-1/4 bg-[#fd565c] rounded-tl-md">{t`wingo1_period`}</th>
            <th className="font-medium w-1/4 bg-[#fd565c]">{t`wingo1_number`}</th>
            <th className="font-medium w-1/4 bg-[#fd565c]">{t`wingo1_big_small`}</th>
            <th className="font-medium w-1/4 bg-[#fd565c] rounded-tr-md">{t`wingo1_color`}</th>
          </tr>
        </thead>
        <tbody>
          {list?.map((item) => (
            <tr
              className="border-b border-b-base-600 bg-base-900 h-8 "
              key={item.period}
            >
              <td className="text-base-200 text-center font-medium px-2 text-2xs ">
                {item.period}
              </td>
              <td
                className={clsx(
                  "text-center font-bold px-2 text-xl",
                  item.number === 0
                    ? "text-transparent bg-gradient-to-b from-[#fd565c] from-50% to-[#b659fe] to-50% bg-clip-text"
                    : item.number === 5
                    ? "text-transparent bg-gradient-to-b from-[#40ad72] from-50% to-[#b659fe] to-50% bg-clip-text"
                    : item.number % 2
                    ? "text-[#40ad72]"
                    : "text-[#fd565c]"
                )}
              >
                {item.number}
              </td>
              <td className="text-base-200 text-center font-medium px-2 text-2xs">
                {t(`wingo1_${item.size}`)}
              </td>
              <td className="text-center px-2">
                {item.color.map((item) => (
                  <span
                    key={item}
                    className={clsx(
                      "inline-block align-middle rounded-full mx-1 w-2.5 h-2.5",
                      item === "red"
                        ? "bg-[#fd565c]"
                        : item === "green"
                        ? "bg-[#40ad72]"
                        : "bg-[#b659fe]"
                    )}
                  ></span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center items-center bg-base-900 gap-5 p-2.5">
        <button
          className={clsx(
            "rounded-md p-0.5",
            page === 1
              ? "cursor-default text-base-400 bg-base-600"
              : "text-white bg-[#fd565c]"
          )}
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
        >
          <ChevronLeftIcon className="w-6 h-6 " />
        </button>
        <span className="text-base-200 font-medium text-xs ">
          {t("wingo1_page_number", { page })}
        </span>
        <button
          className={clsx(
            "rounded-md p-0.5",
            isEnd
              ? "cursor-default text-base-400 bg-base-600"
              : "text-white bg-[#fd565c]"
          )}
          disabled={isEnd}
          onClick={() => onChange(page + 1)}
        >
          <ChevronRightIcon className="w-6 h-6 " />
        </button>
      </div>
    </div>
  );
}
