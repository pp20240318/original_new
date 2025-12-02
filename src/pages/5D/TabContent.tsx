import clsx from "clsx";
import BettingModal from "./BettingModal";
import { ReactNode, useEffect, useState } from "react";
import RulesModal from "./RulesModal";
import { FiveDragonBet } from "@/fetchers/game";

import { use5DTabcontent } from "@/hooks/use5DTabcontent";
import { UxMessage } from "../../../ui";
import { useRefreshHistory } from "@/hooks/useRefreshHistory";

export default function TabContent({
  dataFromChild,
  active,
  tabValue,
  start,
  children,
}: {
  dataFromChild?: RacingBetItem[];
  active?: number;
  tabValue: string;
  start: boolean;
  children: ReactNode;
}) {
  const [openRules, setOpenRules] = useState(false);
  const [type, setType] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const categorizedContent = dataFromChild?.reduce(
    (acc, item) => {
      if (item.type === "Total") {
        acc.total.push(item);
      } else if (!["Total", "Single"].includes(item.type)) {
        acc.others.push(item);
      } else if (item.type === "Single") {
        const singleItems = Array.from({ length: 10 }, (_, index) => ({
          type: item.type,
          value: `${index}`,
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
  const [, setUpdateHistory] = useRefreshHistory();
  const [tabcontent, setTabcontent] = use5DTabcontent();
  const [bigActive, setBigActive] = useState(tabcontent.bigActive);

  const othersContent = categorizedContent ? categorizedContent.others : [];

  const singleContent = categorizedContent ? categorizedContent.single : [];

  const onConfirm = (money: number) => {
    FiveDragonBet({
      minute: active,
      content: JSON.stringify({
        type,
        value: tabcontent.activeTabContent
          ? tabcontent.activeTabIndex + 1 + "|" + tabcontent.activeTabContent
          : tabcontent.bigTabContent + "|" + (tabcontent.activeTabIndex + 1),
      }),
      money,
    })
      .then((rr) => {
        if (rr.code !== 200) {
          UxMessage.error(rr.msg? rr.msg : "bet fail");
          return;
        }
        UxMessage.success("bet success");
        setUpdateHistory({ status: true });
        setShowPopup(false);
        setTabcontent({
          activeTabIndex: 0,
          showPopup: false,
          bigActive: -1,
          activeTabContent: "",
          bigTabContent: "",
        });
      })
      .catch(() => {
        UxMessage.error("bet failed");
      });
  };
  useEffect(() => {
    setBigActive(tabcontent.bigActive);
  }, [tabcontent.bigActive]);

  const TabContent = () => {
    return (
      <>
        <div className="flex justify-center py-4 align-center">
          {othersContent.map((num, index) => (
            <div
              key={index}
              className={clsx(
                "flex flex-1 justify-center items-center bg-[#02a7f0] mr-2 last:mr-0 px-2 py-2 rounded-lg text-center cursor-pointer",
                bigActive === index
                  ? "bg-[#ECF24F] text-black"
                  : "bg-[#02a7f0] text-white"
              )}
              onClick={() => {
                setType(num.type);
                setBigActive(index);
                if (!tabcontent.showPopup) {
                  setShowPopup(true);
                }
                setTabcontent({
                  ...tabcontent,
                  bigActive: tabcontent.bigActive === index ? -1 : index,
                  bigTabContent: num.value,
                  showPopup: true,
                  activeTabContent: "",
                });
              }}
            >
              <div className="pr-2">{num.value}</div>
              <div>{num.rate}</div>
            </div>
          ))}
        </div>
        {tabValue !== "sun" ? (
          <div className="flex flex-wrap justify-between items-center">
            {singleContent.map((item,index) => {
              return (
                <div
                  key={index}
                  className={clsx(
                    `flex flex-col items-center last:mr-0 mb-3 px-2 rounded-lg w-16`
                  )}
                >
                  <div
                    className={clsx(
                      "flex justify-center items-center rounded-full w-12 h-12 text-black",
                      tabcontent.activeTabContent
                        .split(",")
                        .includes(item.value)
                        ? "bg-blue-500 text-white"
                        : "bg-white text-black"
                    )}
                    onClick={() => {
                      setType(item.type);
                      setTabcontent({
                        ...tabcontent,
                        showPopup: true,
                        bigActive: -1,
                        activeTabContent: tabcontent.activeTabContent.includes(
                          item.value
                        )
                          ? tabcontent.activeTabContent
                              .split(",")
                              .map(Number)
                              .filter((value) => value !== Number(item.value)) // 删除 item.value
                              .sort((a, b) => a - b)
                              .filter(
                                (value, index, self) =>
                                  index === self.indexOf(value)
                              ) // 去重
                              .join(",")
                          : [
                              ...tabcontent.activeTabContent
                                .split(",")
                                .map(Number)
                                .filter((value) => value !== 0), // 过滤掉空字符串转换成的0
                              Number(item.value),
                            ]
                              .sort((a, b) => a - b)
                              .filter(
                                (value, index, self) =>
                                  index === self.indexOf(value)
                              ) // 去重
                              .join(","),
                      });
                      if (!tabcontent.showPopup) {
                        setShowPopup(true);
                      }
                    }}
                  >
                    {item.value}
                  </div>
                  <div className="text-white">{item.rate}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-40"></div>
        )}
      </>
    );
  };

  return (
    <div className="p-3 w-full">
      <TabContent />
      <BettingModal
        showPopup={showPopup}
        start={start}
        onContent={() => setOpenRules(true)}
        onConfirm={(res) => {
          onConfirm(res);
        }}
        onClose={() => {
          setTabcontent({
            activeTabIndex: 0,
            showPopup: false,
            bigActive: -1,
            activeTabContent: "",
            bigTabContent: "",
          });
          setShowPopup(false);
        }}
      >
        {dataFromChild && active && (
          <>
            {children} <TabContent />
          </>
        )}
      </BettingModal>
      <RulesModal open={openRules} onClose={() => setOpenRules(false)} />
    </div>
  );
}
