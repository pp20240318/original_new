import dayjs from "dayjs";
import clsx from "clsx";
import { useAppConfig } from "@/appconfig";
export default function MyHistoryDetails({
  itemInfo,
}: {
  itemInfo: DMyHistoryDataList;
}) {
  const { SYMBOL } = useAppConfig();
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
  const ranklList = {
    1: "ST",
    2: "ND",
    3: "RD",
  } as any;

  const contentValue = JSON.parse(itemInfo.content);
  return (
    <div className="flex flex-col text-white">
      <div className="pb-2 font-bold text-white text-xl">Details</div>
      <div className="flex justify-between items-center bg-[#1A543D] mb-3 px-2 py-3 h-7">
        <div>Period</div>
        <div>{itemInfo.opendate}</div>
      </div>
      <div className="flex justify-between items-center bg-[#1A543D] mb-3 px-2 py-3 h-7">
        <div>Purchase amount</div>
        <div>
          {SYMBOL}
          {itemInfo.originalMoney}
        </div>
      </div>
      <div className="flex justify-between items-center bg-[#1A543D] mb-3 px-2 py-3 h-7">
        <div>Amount after tax</div>
        <div>
          {SYMBOL}
          {itemInfo.money}
        </div>
      </div>
      <div className="flex justify-between items-center bg-[#1A543D] mb-3 px-2 py-3 h-7">
        <div>tax</div>
        <div>
          {SYMBOL}
          {(itemInfo.originalMoney - itemInfo.money).toFixed(2)}
        </div>
      </div>
      <div className="flex justify-between items-center bg-[#1A543D] mb-3 px-2 py-3 h-7">
        <div>Result</div>
        <div className="flex justify-center items-center">
          {itemInfo.result?.split(",").map((res) => {
            return (
              <div
                className="flex justify-center items-center mr-1 w-4 h-4 font-normal"
                style={{
                  backgroundColor: backgroundColorCell[parseInt(res) - 1],
                }}
                key={res}
              >
                {res}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between items-center bg-[#1A543D] mb-3 px-2 py-3 h-7">
        <div>Select</div>

        {["Single"].includes(contentValue.type) && (
          <div>
            <span className="pr-1">
              {contentValue.value.split("|")[0] +
              contentValue.value.split("|")[0]
                ? [contentValue.value.split("|")[0]] +
                  ranklList[contentValue.value.split("|")[0]]
                : contentValue.value.split("|")[0] + "th"}
            </span>
            <span>{contentValue.value.split("|")[1]}</span>
          </div>
        )}
        {["Total", "BigOrSmall", "OddOrEven"].includes(contentValue.type) && (
          <div>
            <span className="pr-1">1ST+2ND</span>
            <span>{contentValue.value}</span>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center bg-[#1A543D] mb-3 px-2 py-3 h-7">
        <div>Status</div>
        <div
          className={clsx(
            itemInfo.status === 0 && " text-[#ECF24F]  ",
            itemInfo.status === 1 && itemInfo.winMoney > 0 && " text-[#13ae86]",
            itemInfo.status === 1 && itemInfo.winMoney <= 0 && " text-[#d03749]"
          )}
        >
          {itemInfo.status === 0
            ? "wait"
            : itemInfo.winMoney > 0
            ? "Succeed"
            : "Failed"}
        </div>
      </div>
      <div className="flex justify-between items-center bg-[#1A543D] mb-3 px-2 py-3 h-7">
        <div>Win/lose</div>
        <div>{itemInfo.winMoney}</div>
      </div>
      <div className="flex justify-between items-center bg-[#1A543D] mb-3 px-2 py-3 h-7">
        <div>Order Tme</div>
        <div>{dayjs(itemInfo.createTime).format("MM/DD/YYYY HH:mm:ss")}</div>
      </div>
    </div>
  );
}
