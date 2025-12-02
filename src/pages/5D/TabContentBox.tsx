import clsx from "clsx";
import CountdownMask from "./CountdownMask";
import { useEffect, useState } from "react";
import TabContent from "./TabContent";
import { use5DTabcontent } from "@/hooks/use5DTabcontent";

export default function TabContentBox({
  start,
  dataFromChild,
  active,
}: {
  dataFromChild: RacingBetItem[];
  start: boolean;
  active: number;
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
      value: "sun",
      title: "SUM",
    },
  ];

  const [activeTabType, setActiveTabType] = useState(tabsList[0].value);
  const [tabcontent, setTabcontent] = use5DTabcontent();
  const [activeTabIndex, setActiveTabIndex] = useState(
    tabcontent.activeTabIndex
  );
  useEffect(() => {
    setActiveTabIndex(tabcontent.activeTabIndex);
  }, [tabcontent.activeTabIndex]);
  const HeadBox = () => {
    return (
      <div className="flex items-center m-3">
        {tabsList.map((item, index) => {
          return (
            <div
              key={index}
              className={clsx(
                "after:-right-[0.9375rem] after:bottom-0 after:absolute relative flex justify-center items-center mr-4 rounded-t-[4rem] w-10 after:w-[0.9375rem] h-10 after:h-[0.9375rem] after:content-['']",
                {
                  "bg-[#ECF24F] after:bg-radial-custom-active":
                    index === activeTabIndex,
                  "bg-base-900 after:bg-radial-custom text-black":
                    index !== activeTabIndex,
                }
              )}
              onClick={() => {
                setActiveTabIndex(index);
                setActiveTabType(item.value);
                setTabcontent({
                  ...tabcontent,
                  activeTabIndex: index,
                  showPopup: false,
                });
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
    );
  };
  return (
    <div className="relative w-full">
      <CountdownMask start={start} />
      <div className="flex items-center m-3">
        {tabsList.map((item, index) => {
          return (
            <div
              key={index}
              className={clsx(
                "after:-right-[0.9375rem] after:bottom-0 after:absolute relative flex justify-center items-center mr-4 rounded-t-[4rem] w-10 after:w-[0.9375rem] h-10 after:h-[0.9375rem] after:content-['']",
                {
                  "bg-[#ECF24F] after:bg-radial-custom-active":
                    index === activeTabIndex,
                  "bg-base-900 after:bg-radial-custom text-black":
                    index !== activeTabIndex,
                }
              )}
              onClick={() => {
                setActiveTabIndex(index);
                setActiveTabType(item.value);
                setTabcontent({
                  ...tabcontent,
                  activeTabIndex: index,
                  showPopup: false,
                });
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
      <TabContent
        dataFromChild={dataFromChild}
        active={active}
        tabValue={activeTabType}
        start={start}
        children={<HeadBox />}
      />
    </div>
  );
}
