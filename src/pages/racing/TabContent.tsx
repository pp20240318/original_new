import clsx from "clsx";
import BettingModal from "./BettingModal";
import { useState } from "react";
import RulesModal from "./RulesModal";
import { RacingBet } from "@/fetchers/game";
import { useRefreshHistory } from "@/hooks/useRefreshHistory";
import { UxMessage } from "../../../ui";
import { useRequest } from "ahooks";

export default function TabContent({
  dataFromChild,
  active,
  itemContent,
  start,
  tabValue,
  tabsList,
  onChange,
}: {
  dataFromChild: RacingBetItem[];
  active: number;
  itemContent: {
    title: string;
    value: string;
  };
  start: boolean;
  tabValue: string;
  tabsList: any[];
  onChange: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [openRules, setOpenRules] = useState(false);
  const [type, setType] = useState("");
  const [value, setValue] = useState("");
  const [, setUpdateHistory] = useRefreshHistory();
  const categorizedContent = dataFromChild?.reduce(
    (acc, item) => {
      if (item.type === "Total") {
        acc.total.push(item);
      } else if (!["Total", "Single"].includes(item.type)) {
        acc.others.push(item);
      } else if (item.type === "Single") {
        const singleItems = Array.from({ length: 10 }, (_, index) => ({
          type: item.type,
          value: `${index + 1}`,
          rate: item.rate,
        }));
        acc.single = singleItems;
      }
      return acc;
    },
    {
      total: [] as RacingBetItem[],
      others: [] as RacingBetItem[],
      single: [] as RacingBetItem[],
    }
  );
  const BigContentItemBgColor = ["#fc2a1c", "#1fba1f", "#1794da"];
  const othersContent = categorizedContent.others;
  const totalContent = categorizedContent.total;
  const singleContent = categorizedContent.single;

  const { run, loading } = useRequest(RacingBet, {
    manual: true,
    onSuccess(res) {
      if (res.code === 200) {
        UxMessage.success("bet success");
        setUpdateHistory({ status: true });
        onChange();
      } else {
        UxMessage.error(res?.msg || "bet failed");
      }
    },
    onError() {
      UxMessage.error("bet failed");
    },
  });

  const onConfirm = (money: number) => {
    console.log("onConfirm")
    if(loading) return;
    run({
      minute: active,
      content: JSON.stringify({
        type,
        value: type === "Single" ? tabValue + "|" + value : value,
      }),
      money,
    });
    // RacingBet({
    //   minute: active,
    //   content: JSON.stringify({
    //     type,
    //     value: type === "Single" ? tabValue + "|" + value : value,
    //   }),
    //   money,
    // })
    //   .then((res) => {
    //     if (res.code === 200) {
    //       UxMessage.success("bet success");
    //       setUpdateHistory({ status: true });
    //       onChange()
    //     } else {
    //       UxMessage.error(res?.msg || "bet failed");
    //     }
    //   })
    //   .catch(() => {
    //     UxMessage.error("bet failed");
    //   });
  };
  return (
    <div className="p-3 w-full">
      {itemContent.value === "Total" ? (
        <div>
          <div className="flex justify-center py-4 align-center">
            {othersContent.map((num) => (
              <div
                key={num.value}
                className="flex-col flex-1 justify-center items-center bg-[#02a7f0] mr-2 last:mr-0 px-2 py-2 rounded-lg text-center cursor-pointer"
                onClick={() => {
                  setType(num.type);
                  setValue(num.value);
                  setOpen(true);
                }}
              >
                <div>{num.value}</div>
                <div>{num.rate}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-between items-center">
            {totalContent.map((item, index) => {
              const bgColor =
                BigContentItemBgColor[index % BigContentItemBgColor.length];
              return (
                <div
                  key={item.value}
                  className={clsx(
                    `flex flex-col items-center last:mr-0 mb-3 px-2 rounded-lg w-16`
                  )}
                  style={{ backgroundColor: bgColor }}
                  onClick={() => {
                    setType(item.type);
                    setValue(item.value);
                    setOpen(true);
                  }}
                >
                  <div>{item.value}</div>
                  <div>{item.rate}</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-center py-4 align-center">
            {othersContent.map((num) => (
              <div
                key={num.value}
                className="flex-col flex-1 justify-center items-center bg-[#02a7f0] mr-2 last:mr-0 px-2 py-2 rounded-lg text-center cursor-pointer"
                onClick={() => {
                  setType(num.type);
                  setValue(num.value);
                  setOpen(true);
                }}
              >
                <div>{num.value}</div>
                <div>{num.rate}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-between items-center">
            {singleContent.map((item, index) => {
              const bgColor =
                BigContentItemBgColor[index % BigContentItemBgColor.length];
              return (
                <div
                  key={item.value}
                  className={clsx(
                    `flex flex-col items-center last:mr-0 mb-3 px-2 rounded-lg w-16`
                  )}
                  style={{ backgroundColor: bgColor }}
                  onClick={() => {
                    setType(item.type);
                    setValue(item.value);
                    setOpen(true);
                  }}
                >
                  <div>{item.value}</div>
                  <div>{item.rate}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <BettingModal
        open={open}
        start={start}
        activeType={active}
        tabValue={tabValue}
        titleValue={value}
        tabsList={tabsList}
        key={itemContent.value}
        onClose={() => setOpen(false)}
        onContent={() => setOpenRules(true)}
        onConfirm={(res) => {
          onConfirm(res);
        }}
      />
      <RulesModal open={openRules} onClose={() => setOpenRules(false)} />
    </div>
  );
}
