import NoData from "@/components/NoData";
import { Pagination } from "@/components/Pagination";
import { useEffect, useState } from "react";
import {
  getRoyalRacingHistory,
  getMyRoyalRacingHistory,
} from "@/fetchers/game";
import { useRequest } from "ahooks";
import MyHistoryPage from "./MyHistoryPage";
import { useRefreshHistory } from "@/hooks/useRefreshHistory";
import clsx from "clsx";
import { TrendChart } from "./TrendChart";

export default function HistoryData({
  current,
  activeTab,
  openDate,
}: {
  current: number;
  activeTab: number;
  openDate: string;
}) {
  const tabsList = [
    {
      value: "1",
      title: "A",
    },
    {
      value: "2",
      title: "B",
    },
    {
      value: "3",
      title: "C",
    },
    {
      value: "4",
      title: "D",
    },
    {
      value: "5",
      title: "E",
    },
    {
      value: "6",
      title: "F",
    },
    {
      value: "7",
      title: "G",
    },
  ];
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState<number>(10);
  const [drawerTotal, setDrawerTotal] = useState<number>(1);
  const [list, setList] = useState<DHistoryDataList[]>([]);
  const [myList, setMyList] = useState<DMyHistoryDataList[]>([]);
  const [updateHistory] = useRefreshHistory();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const { runAsync: getRoyalRacingHistoryResult } = useRequest(
    getRoyalRacingHistory,
    {
      manual: true,
    }
  );
  const { runAsync: getMyRoyalRacingHistoryResult } = useRequest(
    getMyRoyalRacingHistory,
    {
      manual: true,
    }
  );

  const backgroundColorCell: string[] = [
    "#e6dc30",
    "#1794da",
    "#4b4b4b",
    "#fd7622",
    "#2ddbdd",
    "#523ff8",
    "#bcbcbc",
    "#fc2a1c",
    "#760d07",
    "#1fba1f",
  ];

  useEffect(() => {
    if (activeTab === 0 || activeTab === 1)
      getRoyalRacingHistoryResult({
        pageIndex,
        pageSize,
        minute: current,
      }).then((res) => {
        setList(res.data.list);
        setTotal(res.data.totalPage);
      });
  }, [pageIndex, pageSize, current, activeTab, openDate]);

  useEffect(() => {
    getMyRoyalRacingHistoryResult({
      pageIndex,
      pageSize,
      minute: current,
    }).then((res) => {
      setMyList(res.data.list);
      setDrawerTotal(res.data.totalPage);
    });
  }, [pageIndex, pageSize, current, updateHistory]);

  useEffect(() => {
    getMyRoyalRacingHistoryResult({
      pageIndex,
      pageSize,
      minute: current,
    }).then((res) => {
      setMyList(res.data.list);
      setDrawerTotal(res.data.totalPage);
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
          <div className="custom-scroll mt-2 overflow-hidden overflow-x-auto">
            <table className="w-full table">
              <colgroup>
                <col span={6} />
              </colgroup>
              <thead className="text-sm text-base-400 font-semibold">
                <tr className="h-14 lg:h-16">
                  <th>
                    <span className="px-2 block text-center" title="Time">
                      Period
                    </span>
                  </th>

                  <th>
                    <span
                      className="px-2 block text-center"
                      title="Subordinate"
                    >
                      Result
                    </span>
                  </th>
                  <th>
                    <span className="px-2 block text-center" title="Game Name">
                      Number
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-white text-center font-medium">
                {!list?.length ? (
                  <tr>
                    <td colSpan={6} className="text-center">
                      <NoData />
                    </td>
                  </tr>
                ) : (
                  list?.map((item, index) => (
                    <tr
                      key={item.opendate + index}
                      className="h-12 lg:h-14 xl:h-16 odd:bg-back-300 hover:bg-base-800 transition-colors"
                    >
                      <td>
                        <span className="px-2 block " title={item.opendate}>
                          {item.opendate.slice(-5)}
                        </span>
                      </td>
                      <td>
                        <span
                          className="flex items-center justify-center px-2  "
                          title={"result"}
                        >
                          {item.results?.split(",").map((res) => {
                            return (
                              <div
                                className="flex items-center justify-center w-4 h-4 mr-1 font-normal"
                                style={{
                                  backgroundColor:
                                    backgroundColorCell[parseInt(res) - 1],
                                }}
                                key={res}
                              >
                                {res}
                              </div>
                            );
                          })}
                        </span>
                      </td>
                      <td>
                        <span className="px-2 block" title={"status"}>
                          <span
                            className={clsx(
                              "rounded-full",
                              "h-5",
                              "w-5",
                              item.bigOrSmall === "Big" && "bg-[#6da7f4]",
                              item.bigOrSmall === "Small" && "bg-[#fea62e]"
                            )}
                            style={{
                              display: "inline-block",
                              width: "20px",
                              height: "20px",
                              lineHeight: "20px",
                            }}
                          >
                            {item.bigOrSmall === "Big" ? "B" : "S"}
                          </span>
                          <span
                            className={clsx(
                              "ml-1",
                              "rounded-full",
                              "h-5",
                              "w-5",
                              item.oddOrEven === "Odd" && "bg-[#40ad72]",
                              item.oddOrEven === "Even" && "bg-[#ac57ee]"
                            )}
                            style={{
                              display: "inline-block",
                              width: "20px",
                              height: "20px",
                              lineHeight: "20px",
                            }}
                          >
                            {item.oddOrEven === "Odd" ? "O" : "E"}
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="py-2 bg-back-300">
            <Pagination
              size={pageSize}
              total={total}
              current={pageIndex}
              onChange={setPageIndex}
            />
          </div>
        </>
      )}
      {activeTab === 1 && (
        <>
          <div className="flex items-center m-3">
            {tabsList.map((item, index) => {
              return (
                <div
                  key={index}
                  className={clsx(
                    "relative rounded-t-[4rem]   w-10 h-10 mr-4 flex  justify-center items-center after:content-[''] after:absolute after:bottom-0 after:-right-[0.9375rem] after:h-[0.9375rem] after:w-[0.9375rem]  ",
                    {
                      "bg-[#ECF24F] after:bg-radial-custom-active":
                        index === activeTabIndex,
                      "bg-base-900 after:bg-radial-custom text-black":
                        index !== activeTabIndex,
                    }
                  )}
                  onClick={() => {
                    setActiveTabIndex(index);
                  }}
                >
                  <div
                    className={clsx(
                      "text-center",
                      activeTabIndex === index ? "text-black" : "text-white"
                    )}
                  >
                    {item.title}
                  </div>
                </div>
              );
            })}
          </div>

          <TrendChart
            show={true}
            data={list}
            isEnd={total === pageIndex}
            activeTabIndex={activeTabIndex}
            onChange={setPageIndex}
            page={pageIndex}
          />
        </>
      )}
      {activeTab === 2 &&
        myList &&
        (myList.length > 0 ? (
          <MyHistoryPage
            list={myList}
            total={drawerTotal * 10}
            onChange={setPageIndex}
          />
        ) : (
          <NoData />
        ))}
    </>
  );
}
