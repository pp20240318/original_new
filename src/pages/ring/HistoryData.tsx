import NoData from "@/components/NoData";
import { useEffect, useState } from "react";
import { Pagination } from "@/components/Pagination";
import { useSocketEmit } from "@/socket";
import { EEmit, EGame } from "@/socket/enums";
import { useLogined } from "@/events";
import { useAppConfig } from "@/appconfig";
import clsx from "clsx";

export default function HistoryData({
  current,
  activeTab,
}: {
  current: number;
  activeTab: number;
}) {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState<number>(10);
  const [list, setList] = useState<DTowerHistory[]>([]);

  const logined = useLogined();
  // 获取游戏历史记录
  useSocketEmit<HistoryRing>({
    ready: logined,
    defaultParams: [
      EEmit.HISTORY,
      EGame.RING,
      { psize: pageSize, page: pageIndex, isMine: Number(activeTab) === 1 },
    ],
    refreshDeps: [pageIndex, activeTab],
    onSuccess: (r) => {
      setTotal(r.data.total);
      setList(r.data.items);
    },
  });

  useEffect(() => {
    setPageIndex(1);
    setPageSize(10);
  }, [activeTab]);

  const { SYMBOL } = useAppConfig();

  return (
    <>
      <>
        <div className="mt-4 overflow-hidden overflow-x-auto">
          <table className="table w-full">
            <colgroup>
              <col span={6} />
            </colgroup>
            <thead className="font-semibold text-sm text-base-400">
              <tr className="h-14 lg:h-16">
                <th className="hidden sm:table-cell">
                  <span className="px-2 text-center" title="Time">
                    TIME
                  </span>
                </th>
                <th>
                  <span className="block px-2 text-center" title="User">
                    USER ID
                  </span>
                </th>

                <th>
                  <span className="block px-2 text-center" title="Bet Amount">
                    BET AMOUNT
                  </span>
                </th>
                <th className="hidden sm:table-cell">
                  <span className="block px-2 text-center" title="Multiplier">
                    MULTIPLIER
                  </span>
                </th>

                <th>
                  <span className="block px-2 text-center" title="Payout">
                    PAYOUT
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="font-medium text-white text-sm text-center">
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
                    <td className="hidden sm:table-cell">
                      <span
                        className="px-2 text-[#a7b5ca]"
                        title={item.createTime}
                      >
                        {item.createTime}
                      </span>
                    </td>
                    <td>
                      <span className="block px-2" title={item.uid}>
                        {item.uid}
                      </span>
                    </td>
                    <td>
                      <span
                        className="flex justify-center items-center px-2"
                        title={item.money}
                      >
                        {item.money}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell">
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
                    </td>
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
        </div>

        <div className="bg-back-300 py-2">
          <Pagination
            size={pageSize}
            total={total}
            current={pageIndex}
            onChange={setPageIndex}
          />
        </div>
      </>
      {/* {activeTab === 1 && myList && (
        <MyHistoryPage
          list={myList}
          total={drawerTotal * 10}
          onChange={setPageIndex}
        />
      )} */}
    </>
  );
}
