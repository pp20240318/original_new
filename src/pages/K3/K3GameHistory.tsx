"use client";

import { useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { K3GameHistoryItem, K3GameHistoryData } from "./types";

export function K3GameHistory({
  show,
  page,
  isEnd,
  data,
  onChange,
}: {
  show: boolean;
  page: number;
  isEnd: boolean;
  data?: ThreeKingHistoryItem[];
  onChange: (page: number) => void;
}) {
  const { t } = useTranslation();
  // const list = useMemo(() => {
  //   if (!data) return;

  //   const listData: K3GameHistoryItem[] = data.map((item) => {
  //     const period = item.opendate;
  //     const price = item.result;//.replace(/\,/g, "");
  //     const number = +item.result;//.slice(-1);
  //     const size = number < 5 ? "small" : "big";
  //     const color: ("red" | "green" | "violet")[] = [
  //       number % 2 ? "green" : "red",
  //     ];
  //     if ([0, 5].includes(number)) color.push("violet");
  //     return { period, price, number, size, color };
  //   });

  //   return listData;
  // }, [data]);

  return (
    <div className={clsx("mt-4", !show && "hidden")}>
      <table className="w-full">
        <thead>
          <tr className="text-white text-2xs h-8 ">
            <th className="font-medium w-1/4 bg-[#fd565c] rounded-tl-md">{t`wingo1_period`}</th>
            <th className="font-medium w-1/4 bg-[#fd565c]" colSpan={3}>Sum</th>
            <th className="font-medium w-1/4 bg-[#fd565c] rounded-tr-md" colSpan={3}>Results</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => (
            <tr
              className="border-b border-b-base-600 bg-base-900 h-8  text-4xs"
              key={item.opendate}
            >
              <td className="text-base-200 text-center font-medium px-2 ">
                {item.opendate}
              </td>
              <td>{item.total}</td>
              <td>{item.bigOrSmall}</td>
              <td>{item.oddOrEven}</td>
              <td> <img className="h-4 w-4" src={`/k3/${item.num1}.png`} /></td>
              <td> <img className="h-4 w-4" src={`/k3/${item.num2}.png`} /></td>
              <td> <img className="h-4 w-4" src={`/k3/${item.num3}.png`} /></td>

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
