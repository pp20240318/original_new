import { useState } from "react";
import HistoryData from "./HistoryData";

export default function History({
  current,
  openDate,
}: {
  current: number;
  openDate: string;
}) {
  const tabs = ["Game History", "History"];
  const [activeTab, setActiveTab] = useState(0);
  return (
    <>
      <div className="flex justify-start items-center mx-3.5 py-3">
        {tabs.map((item, index) => {
          return (
            <div
              className="flex flex-1 justify-center items-center mr-2 last:mr-0 p-2 rounded-lg font-bold"
              style={{
                backgroundColor: activeTab !== index ? "#22674B" : "",
                color: activeTab !== index ? "#FFFFFF" : "#FFFFFF",
                backgroundImage:
                  activeTab === index
                    ? "linear-gradient(rgb(49, 148, 112) 10%, rgb(34, 103, 75))"
                    : "",
              }}
              key={index}
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
