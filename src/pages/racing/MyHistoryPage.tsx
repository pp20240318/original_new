import CustomCollapse from "@/components/CustomCollapse";
import dayjs from "dayjs";
import MyHistoryDetails from "./MyHistoryDetails";
import clsx from "clsx";
import { Pagination } from "@/components/Pagination";

export default function MyHistoryPage({
  list,
  total,
  onChange,
}: {
  list: DMyHistoryDataList[];
  total: number;
  onChange: (currentPage: number) => void;
}) {
  if (!list?.length) return null;
  return (
    <div>
      <CustomCollapse defaultActiveKey="1" accordion>
        {list?.map((item) => (
          <CustomCollapse.Item
            key={item.sid}
            header={
              <div className="flex items-center flex-1">
                <div
                  className={clsx(
                    "flex items-center w-12 h-12 rounded-md text-center justify-center text-white",
                    ["Single", "Total"].includes(JSON.parse(item.content)?.type)
                      ? "bg-[#ffa82e]"
                      : "bg-[#6da7f4]"
                  )}
                >
                  {item.content && (
                    <div>
                      {JSON.parse(item.content)?.type === "Single"
                        ? JSON.parse(item.content)?.value.split("|")[1]
                        : JSON.parse(item.content)?.value}
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col mx-2 text-white">
                  <div className="flex-1 flex flex-col ">
                    <div className="flex items-center justify-between">
                      <div>{item.opendate}</div>
                      <div
                        className={clsx(
                          "border-[1px] rounded-md px-2 py-1 text-xs",
                          item.status === 0 &&
                            "border-[#ECF24F] text-[#ECF24F]  ",
                          item.status === 1 &&
                            item.winMoney > 0 &&
                            "border-[#13ae86] text-[#13ae86]",
                          item.status === 1 &&
                            item.winMoney <= 0 &&
                            "border-[#d03749] text-[#d03749]"
                        )}
                      >
                        {item.status === 0
                          ? "wait"
                          : item.winMoney > 0
                          ? "Succeed"
                          : "Failed"}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 flex justify-between ">
                    <div>
                      {dayjs(item?.createTime).format("YYYY-MM-DD HH:mm:ss")}
                    </div>
                    <div
                      className={clsx(
                        "px-2 py-1 text-xs",
                        item.status === 0 && " text-[#ECF24F]  ",
                        item.status === 1 &&
                          item.winMoney > 0 &&
                          " text-[#13ae86]",
                        item.status === 1 &&
                          item.winMoney <= 0 &&
                          " text-[#d03749]"
                      )}
                    >
                      {item.status === 0
                        ? item.money
                        : item.winMoney > 0
                        ? item.winMoney
                        : -item.money}
                    </div>
                  </div>
                </div>
              </div>
            }
          >
            <MyHistoryDetails itemInfo={item} />
          </CustomCollapse.Item>
        ))}
      </CustomCollapse>
      <div className="py-2 bg-[#22674B]">
        <Pagination total={total} onChange={onChange} />
      </div>
    </div>
  );
}
