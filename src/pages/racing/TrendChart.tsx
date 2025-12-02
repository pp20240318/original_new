"use client";

import { useEffect, useMemo, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

const numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function TrendChart({
  show,
  page,
  isEnd,
  data,
  activeTabIndex,
  onChange,
}: {
  show?: boolean;
  page: number;
  isEnd: boolean;
  data?: any[];
  activeTabIndex: number;
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
      containerRef.current.querySelectorAll<HTMLLIElement>(".racing")
    );
    const points = targets.map((item) => ({
      x: item.offsetLeft + item.offsetWidth / 2,
      y: item.offsetTop + item.offsetHeight / 2,
    }));
    ctx.strokeStyle = "#ECF24F";
    ctx.beginPath();
    points.forEach(({ x, y }, index) => {
      index ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.stroke();
  }, [show, containerRef.current, data, activeTabIndex]);

  const list = useMemo(() => {
    if (!data) return;
    return data.map((item) => {
      const period = item.opendate.slice(-5);
      const number = +item.results.split(",")[activeTabIndex];
      const oddOrEvenSize =
        item.oddOrEven && item.oddOrEven.includes("Odd") ? "O" : "E";
      const bigOrSmallSize =
        item.oddOrEven && item.bigOrSmall.includes("Big") ? "B" : "S";

      return { period, number, oddOrEvenSize, bigOrSmallSize };
    });
  }, [data, activeTabIndex]);

  return (
    <div className={clsx("mt-4", !show && "hidden")}>
      <div className="flex items-center text-white font-medium rounded-t-md bg-[#fd565c] text-2xs  h-8">
        <span className="grow-[2] text-center">Period</span>
        <span className="grow-[4] text-center">Number</span>
      </div>
      <div ref={containerRef} className="relative">
        {list?.map((item) => (
          <div
            key={item.period}
            className="flex items-center  border-b border-b-base-600 bg-base-900 text-2xs h-10 px-2 "
          >
            <label className="text-base-200 font-medium m-auto ">
              {item.period}
            </label>
            <ul className="flex ml-4 gap-1 ">
              {numArr.map((num) => (
                <li
                  className={clsx(
                    "relative z-[1] flex justify-center items-center rounded-full w-[0.875rem] h-[0.875rem] ",
                    item.number !== num
                      ? "text-base-400 border border-base-400"
                      : "racing text-white bg-[#fb4e4e]"
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
                item.bigOrSmallSize === "B" ? "bg-[#6da7f4]" : "bg-[#fea62e]"
              )}
            >
              {item.bigOrSmallSize}
            </span>
            <span
              className={clsx(
                "flex justify-center items-center text-white font-medium rounded-full w-[0.875rem] h-[0.875rem] ml-[0.8125rem]",
                item.oddOrEvenSize === "O" ? "bg-[#40ad72]" : "bg-[#ac57ee]"
              )}
            >
              {item.oddOrEvenSize}
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
