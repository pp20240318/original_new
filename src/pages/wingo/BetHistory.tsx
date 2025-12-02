"use client";

import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";

import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { WinGoBetHistoryData, WinGoBetHistory, WinGoBetName } from "./types";
import NoData from "./NoData";

export function BetHistory({
  show,
  page,
  isEnd,
  data,
  onChange,
}: {
  show: boolean;
  page: number;
  isEnd: boolean;
  data?: WinGoBetHistoryData[];
  onChange: (page: number) => void;
}) {
  const { t } = useTranslation();

  const [list, setList] = useState<WinGoBetHistory[]>();

  useEffect(() => {
    if (!data?.length) return;

    const listData: WinGoBetHistory[] = data.map((item) => {
      const orderId = item.num_id;
      const period = item.stage;
      const contractMoney = item.drop_money.toFixed(2);
      // const price = item.lotteryResult?.replace(/\,/g, "") ?? "--";
      const resultNum = Number(item.num1);
      const result = resultNum
        ? ([
          resultNum,
          +resultNum % 2 ? "green" : "red",
          ...([0, 5].includes(+resultNum) ? ["violet"] : []),
          +resultNum < 5 ? "small" : "big",
        ] as WinGoBetName[])
        : "--";
      if (period === "202412090793") {
        console.log("item.num123", item);
      }
      const select =
        item.drop_content === "绿"
          ? "green"
          : item.drop_content === "紫"
            ? "violet"
            : item.drop_content === "红"
              ? "red"
              : item.drop_content === "大"
                ? "big"
                : item.drop_content === "小"
                  ? "small"
                  : (item.drop_content as WinGoBetName);
      const status =
        item.status === "待开奖"
          ? "pending"
          : item.status === "已中奖"
            ? "succeed"
            : item.status === "未中奖"
              ? "failed"
              : "revoked";
      console.log("item.delivery", item.delivery);
      const amount = item.amount
        ? (Number(item.amount) > 0 ? "+" : "") + Number(item.amount).toFixed(2)
        : "--";
      const rate = item.drop_rate;
      const fee: number = item.fee ? Number(item.fee) : 0;
      const createTime = format(item.drop_time, "yyyy-MM-dd HH:mm:ss");
      const showDetail =
        list?.find((item) => item.orderId === orderId)?.showDetail ?? false;
      return {
        orderId,
        period,
        contractMoney,
        result,
        status,
        amount,
        fee,
        rate,
        select,
        createTime,
        showDetail,
      };
    });

    setList(listData);
  }, [data]);

  return (
    <div className={clsx("mt-4", !show && "hidden")}>
      {!list?.length ? (
        <NoData />
      ) : (
        <>
          <div className="w-full bg-base-900 px-2.5 ">
            {list?.map((item) => (
              <div className="border-b border-base-600" key={item.orderId}>
                <div
                  className="cursor-pointer flex py-2.5"
                  onClick={() => {
                    item.showDetail = !item.showDetail;
                    setList([...list]);
                  }}
                >
                  <div
                    className={clsx(
                      "flex justify-center items-center text-white rounded-md w-9 h-9 p-0.5",
                      item.select === "big"
                        ? "bg-[#ffc511]"
                        : item.select === "small"
                          ? "bg-[#6da7f4]"
                          : item.select === "green"
                            ? "bg-[#5cba47]"
                            : item.select === "violet"
                              ? "bg-[#eb43dd]"
                              : item.select === "red"
                                ? "bg-[#fb4e4e]"
                                : item.select === "0"
                                  ? "bg-gradient-to-br from-[#fb4e4e] from-50% to-[#eb43dd] to-50%"
                                  : item.select === "5"
                                    ? "bg-gradient-to-br from-[#5cba47] from-50% to-[#eb43dd] to-50%"
                                    : +item.select % 2
                                      ? "bg-[#5cba47]"
                                      : "bg-[#fb4e4e]"
                    )}
                  >
                    {isNaN(+item.select) ? (
                      <span className="font-medium text-3xs truncate">
                        {t(`wingo1_${item.select}`)}
                      </span>
                    ) : (
                      <span className="font-semibold text-xl">
                        {item.select}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col justify-around ml-2.5  mr-auto">
                    <span className="text-base-200 font-medium text-xs ">
                      {item.period}
                    </span>
                    <span className="text-base-400 font-medium text-3xs ">
                      {item.createTime}
                    </span>
                  </div>
                  <div className="flex flex-col items-end justify-around ml-2.5 ">
                    <span
                      className={clsx(
                        "font-medium border rounded text-3xs px-3.5  py-px",
                        item.status === "succeed"
                          ? "text-[#5cba47] border-[#5cba47]"
                          : item.status === "failed"
                            ? "text-[#fb4e4e] border-[#fb4e4e]"
                            : item.status === "pending"
                              ? "text-[#ffc511] border-[#ffc511]"
                              : "text-base-400 border-base-400"
                      )}
                    >
                      {t(`wingo1_status_${item.status}`)}
                    </span>
                    <span
                      className={clsx(
                        "font-medium text-xs ",
                        item.amount !== "--"
                          ? +item.amount > 0
                            ? "text-[#5cba47]"
                            : "text-[#fb4e4e]"
                          : item.status === "pending"
                            ? "text-[#ffc511]"
                            : "text-base-400"
                      )}
                    >
                      {item.amount}
                    </span>
                  </div>
                </div>

                <div
                  className={clsx(
                    "duration-200 overflow-hidden",
                    item.showDetail ? "h-[17rem] " : "h-0"
                  )}
                >
                  <div className="py-1.5">
                    <h4 className="text-white font-semibold text-lg ">
                      {t`wingo1_label_details`}
                    </h4>
                    <ul className="font-medium !leading-[1.8] text-xs mt-1.5">
                      <li className="flex bg-base-800 px-1.5">
                        <span className="text-base-400 mr-auto">Period</span>
                        <span className="text-base-400 ml-4">
                          {item.period}
                        </span>
                      </li>
                      <li className="flex bg-base-800 px-1.5 mt-1.5">
                        <span className="text-base-400 mr-auto">
                          {t`wingo1_label_purchase_amount`}
                        </span>
                        <span className="text-base-400 ml-4">
                          {item.contractMoney}
                        </span>
                      </li>
                      <li className="flex bg-base-800 px-1.5 mt-1.5">
                        <span className="text-base-400 mr-auto">{t`wingo1_label_result`}</span>
                        <span className="text-base-400 ml-4 flex gap-1.5 ">
                          {typeof item.result === "string"
                            ? item.result
                            : item.result.map((n) => (
                              <span
                                key={n}
                                className={clsx(
                                  n === "big"
                                    ? "text-[#ffa82e]"
                                    : n === "small"
                                      ? "text-[#6da7f4]"
                                      : n === "green"
                                        ? "text-[#40ad72]"
                                        : n === "violet"
                                          ? "text-[#b659fe]"
                                          : n === "red"
                                            ? "text-[#fd565c]"
                                            : "text-white"
                                )}
                              >
                                {isNaN(+n) ? t(`wingo1_${n}`) : n}
                              </span>
                            ))}
                        </span>
                      </li>
                      <li className="flex bg-base-800 px-1.5 mt-1.5 ">
                        <span className="text-base-400 mr-auto">{t`wingo1_label_select`}</span>
                        <span className="text-base-400 ml-4 flex gap-1.5 ">
                          {isNaN(+item.select)
                            ? t(`wingo1_${item.select}`)
                            : item.select}
                        </span>
                      </li>
                      <li className="flex bg-base-800 px-1.5 mt-1.5 ">
                        <span className="text-base-400 mr-auto">{t`wingo1_label_status`}</span>
                        <span
                          className={clsx(
                            "text-base-400 ml-4 flex gap-1.5",
                            item.status === "succeed"
                              ? "text-[#5cba47] border-[#5cba47]"
                              : item.status === "failed"
                                ? "text-[#fb4e4e] border-[#fb4e4e]"
                                : item.status === "pending"
                                  ? "text-[#ffc511] border-[#ffc511]"
                                  : "text-base-400 border-base-400"
                          )}
                        >
                          {t(`wingo1_status_${item.status}`)}
                        </span>
                      </li>
                      <li className="flex bg-base-800 px-1.5 mt-1.5">
                        <span className="text-base-400 mr-auto">{t`wingo1_label_win_lose`}</span>
                        <span
                          className={clsx(
                            "text-base-400 ml-4 flex gap-1.5",
                            item.amount !== "--"
                              ? +item.amount > 0
                                ? "text-[#5cba47]"
                                : "text-[#fb4e4e]"
                              : item.status === "pending"
                                ? "text-[#ffc511]"
                                : "text-base-400"
                          )}
                        >
                          {item.amount}
                        </span>
                      </li>
                      <li className="flex bg-base-800 px-1.5 mt-1.5 ">
                        <span className="text-base-400 mr-auto">{t`wingo1_label_rate`}</span>
                        <span className="text-base-400 ml-4 flex gap-1.5 ">
                          {item.fee}
                        </span>
                      </li>
                      <li className="flex bg-base-800 px-1.5 mt-1.5 ">
                        <span className="text-base-400 mr-auto">{t`wingo1_label_order_time`}</span>
                        <span className="text-base-400 ml-4 flex gap-1.5 ">
                          {item.createTime}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center bg-base-900 gap-5 p-2.5">
            <button
              className={clsx(
                "rounded-md p-0.5 ",
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
                "rounded-md p-0.5 ",
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
        </>
      )}
    </div>
  );
}
