import NoData from "@/components/NoData";
// import { Pagination } from "@douyinfe/semi-ui";
import { useEffect, useState } from "react";
import { Pagination } from "@/components/Pagination";
import {
  getCurrentFiveDragonResult,
  getMyFiveDragonHistory,
} from "@/fetchers/game";
import { useRequest } from "ahooks";
import MyHistoryPage from "./MyHistoryPage";
import { useRefreshHistory } from "@/hooks/useRefreshHistory";

export default function HistoryData({
  current,
  activeTab,
  openDate,
}: {
  current: number;
  activeTab: number;
  openDate: string;
}) {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState<number>(10);
  const [drawerTotal, setDrawerTotal] = useState<number>(1);
  const [list, setList] = useState<DGetFiveDragonHistoryItem[]>([]);
  const [myList, setMyList] = useState<DGetMyFiveDragonHistoryItem[]>([]);
  const [updateHistory] = useRefreshHistory();

  const { runAsync: getCurrentFiveDragonResultData } = useRequest(
    getCurrentFiveDragonResult,
    {
      manual: true,
    }
  );

  const { runAsync: getMyFiveDragonHistoryData } = useRequest(
    getMyFiveDragonHistory,
    {
      manual: true,
    }
  );
  useEffect(() => {
    if (activeTab === 0) {
      getCurrentFiveDragonResultData({
        pageIndex,
        pageSize,
        minute: current,
      }).then((res) => {
        setList(res.data.list);
        setTotal(res.data.totalPage);
      });
      
    }
  }, [pageIndex, pageSize, current, activeTab, openDate]);
  useEffect(() => {
    getMyFiveDragonHistoryData({
      pageIndex,
      pageSize,
      minute: current,
    }).then((res) => {
      setMyList(res.data.list);
      setDrawerTotal(res.data.totalPage);
    });
  }, [pageIndex, pageSize, current, updateHistory]);

  useEffect(() => {
    getMyFiveDragonHistoryData({
      pageIndex,
      pageSize,
      minute: current,
    }).then((res) => {
      setMyList(res.data.list);
      // setDrawerTotal(res.data.totalPage);
    });
  }, []);

  useEffect(() => {
    setPageIndex(1);
    setPageSize(10);
  }, [activeTab]);

  return (
    <>
      {activeTab === 0 && (
        <>
          <div className="mt-4 overflow-hidden overflow-x-auto">
            <table className="table w-full">
              <colgroup>
                <col span={6} />
              </colgroup>
              <thead className="font-semibold text-sm text-base-400">
                <tr className="h-14 lg:h-16">
                  <th>
                    <span className="block px-2 text-center" title="Time">
                      Period
                    </span>
                  </th>

                  <th>
                    <span
                      className="block px-2 text-center"
                      title="Subordinate"
                    >
                      Result
                    </span>
                  </th>
                  <th>
                    <span className="block px-2 text-center" title="Game Name">
                      Number
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
                      <td>
                        <span className="block px-2" title={item.opendate}>
                          {item.opendate.slice(-5)}
                        </span>
                      </td>
                      <td>
                        <span
                          className="flex justify-center items-center px-2"
                          title={"result"}
                        >
                          {Array.from({
                            length: 6,
                          }).map((_, i) => {
                            return (
                              <div
                                className="flex justify-center items-center mr-1 w-4 h-4 font-normal"
                                key={i}
                              >
                                {
                                  item[
                                    ("num" +
                                      i.toString()) as keyof DGetFiveDragonHistoryItem
                                  ]
                                }
                              </div>
                            );
                          })}
                        </span>
                      </td>
                      <td>
                        <span className="block px-2" title={"number"}>
                          <span>
                            {
                              Array.from({ length: 6 }).reduce(
                                (sum: number, _, i) => {
                                  return (
                                    sum +
                                    Number(
                                      item[
                                        ("num" +
                                          i.toString()) as keyof DGetFiveDragonHistoryItem
                                      ] || 0
                                    )
                                  );
                                },
                                0
                              ) as number
                            }
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
      )}
      {activeTab === 1 && myList && (
        <MyHistoryPage
          list={myList}
          total={drawerTotal * 10}
          onChange={setPageIndex}
        />
      )}
    </>
  );
}
