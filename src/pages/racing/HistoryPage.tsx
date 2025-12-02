import { useState } from "react";
import HistoryData from "./HistoryData";

export default function History({
  current,
  openDate,
}: {
  current: number;
  openDate: string;
}) {
  const tabs = ["Game History", "Chart", "My History"];
  const [activeTab, setActiveTab] = useState(0);
  return (
    <>
      <div className="flex justify-start items-center mx-3.5 py-3">
        {tabs.map((item, index) => {
          return (
            <div
              className="flex-1 flex font-bold mr-2 last:mr-0 rounded-lg p-2 items-center justify-center "
              style={{
                backgroundColor: "#161F2C",
                color: activeTab === index ? "#FFFFFF" : "#56657E",
                fontSize: "14px",
              }}
              key={item}
              onClick={() => setActiveTab(index)}
            >
              {item}
            </div>
          );
        })}
      </div>
      <HistoryData
        current={current}
        activeTab={activeTab}
        openDate={openDate}
      />
    </>
  );
}
