import { useAppConfig } from "@/appconfig";
import { useLogined } from "@/events";
import { useSocketEmit } from "@/socket";
import { EEmit, EGame } from "@/socket/enums";
import { useState, useEffect } from "react";
import clsx from "clsx";
import NoData from "@/components/NoData";

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState(1);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState<number>(10);
  const [list, setList] = useState<DStairsHistory[]>([]);
  const [myList, setMyList] = useState<DMyHistoryDataList[]>([]);

  const logined = useLogined();
  // 获取游戏历史记录
  useSocketEmit<HistoryHilo>({
    ready: logined,
    defaultParams: [
      EEmit.HISTORY,
      EGame.HILO,
      { psize: pageSize, page: pageIndex, isMine: Number(activeTab) === 1 },
    ],
    refreshDeps: [pageIndex],
    onSuccess: (r) => {
      console.log("历史记录:", r, activeTab, pageIndex);
      setTotal(r.data.total);
      setList(r.data.items);
    },
  });

  useEffect(() => {
    console.log("activeTab", activeTab);
    setPageIndex(1);
    setPageSize(10);
  }, [activeTab]);

  const { SYMBOL } = useAppConfig();
  return (
    <>
      <div className="bg-[#1b2431] my-2 px-4 py-4 rounded-sm text-[#fff]">
        My History
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[#55657e]">
            <td>Create Time</td>
            <td>Bet Amount</td>
            <td>Payout</td>
          </tr>
        </thead>
        <tbody className="text-[#a7b5ca]">
          {!list?.length ? (
            <tr>
              <td colSpan={6} className="text-center">
                <NoData />
              </td>
            </tr>
          ) : (
            list?.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-base-800 odd:bg-back-300 h-12 lg:h-14 xl:h-16 transition-colors"
              >
                <td className="sm:table-cell">
                  <span className="px-2 text-[#a7b5ca]" title={item.createTime}>
                    {item.createTime}
                  </span>
                </td>
                {/* <td>
                  <span className="block px-2" title={item.uid}>
                    {item.uid}
                  </span>
                </td> */}
                {/* <td className="px-2">Hilo</td> */}
                <td>
                  <span className="px-2" title={item.money}>
                    {item.money}
                  </span>
                </td>
                {/* <td className="hidden sm:table-cell">
                                  <span className="block px-2" title={item.result}>
                                    <span
                                      className={clsx(
                                        "bg-[#2a3546] px-1 rounded-lg",
                                        Number(item.result) > 0
                                          ? "text-[#1bb83d]"
                                          : "text-[#55657e]"
                                      )}
                                    >
                                      x{item.result}
                                    </span>
                                  </span>
                                </td> */}
                <td>
                  <span className="block px-2" title={item.winMoney}>
                    <span
                      className={clsx(
                        Number(item.result) > 0
                          ? "text-[#1bb83d]"
                          : "text-[#55657e]"
                      )}
                    >
                      {SYMBOL}
                      {item.winMoney}
                    </span>
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
