"use client";

import { useEffect, useMemo, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { WinGoGameHistoryData } from "./types";

const numArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export function TrendChart({
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

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show || !containerRef.current || !data) return;
    document.getElementById("trend-chart")?.remove();
    const { offsetWidth, offsetHeight } = containerRef.current;
    const canvas = document.createElement("canvas");
    canvas.id = "trend-chart";
    canvas.width = offsetWidth;
    canvas.height = offsetHeight;
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    containerRef.current.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const targets = Array.from(
      containerRef.current.querySelectorAll<HTMLLIElement>(".bingo")
    );
    const points = targets.map((item) => ({
      x: item.offsetLeft + item.offsetWidth / 2,
      y: item.offsetTop + item.offsetHeight / 2,
    }));
    ctx.strokeStyle = "#fd565c";
    ctx.beginPath();
    points.forEach(({ x, y }, index) => {
      index ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.stroke();
  }, [show, containerRef.current, data]);

  const list = useMemo(() => {
    if (!data) return;
    return data.map((item) => {
      const period = item.stage;
      const number = +item.result.slice(-1);
      const size = number < 5 ? "S" : "B";
      return { period, number, size };
    });
  }, [data]);

  return (
    <div className={clsx("mt-4", !show && "hidden")}>
      <div className="flex items-center text-white font-medium rounded-t-md bg-[#fd565c] text-2xs  h-8">
        <span className="grow-[1] text-center">{t`wingo1_period`}</span>
        <span className="grow-[4] text-center">{t`wingo1_number`}</span>
      </div>
      <div ref={containerRef} className="relative">
        {list?.map((item) => (
          <div
            key={item.period}
            className="flex items-center border-b border-b-base-600 bg-base-900 text-2xs h-10 px-2 "
          >
            <label className="text-base-200 font-medium mr-auto">
              {item.period}
            </label>
            <ul className="flex ml-4 gap-1 ">
              {numArr.map((num) => (
                <li
                  className={clsx(
                    "relative z-[1] flex justify-center items-center rounded-full w-[0.875rem] h-[0.875rem] ",
                    item.number !== num
                      ? "text-base-400 border border-base-400"
                      : item.number === 0
                      ? "bingo text-white bg-gradient-to-br from-[#fb4e4e] from-50% to-[#eb43dd] to-50%"
                      : item.number === 5
                      ? "bingo text-white bg-gradient-to-br from-[#5cba47] from-50% to-[#eb43dd] to-50%"
                      : +item.number % 2
                      ? "bingo text-white bg-[#5cba47]"
                      : "bingo text-white bg-[#fb4e4e]"
                  )}
                  key={num}
                >
                  {num}
                </li>
              ))}
            </ul>
            <span
              className={clsx(
                "flex justify-center items-center text-white font-medium rounded-full w-[0.875rem] h-[0.875rem] ml-[0.8125rem]",
                item.size === "S" ? "bg-[#6da7f4]" : "bg-[#f3bd14]"
              )}
            >
              {item.size}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center bg-base-900 gap-5 p-2.5 ">
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
        <span className="text-base-200 font-medium text-xs">
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
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
