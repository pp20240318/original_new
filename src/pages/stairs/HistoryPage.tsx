import { useState } from "react";
import HistoryData from "./HistoryData";

export default function History({ current }: { current: number }) {
  const tabs = ["Game History", "My History"];
  const [activeTab, setActiveTab] = useState(0);
  return (
    <>
      <div className="flex justify-start items-center mx-3.5 py-3">
        {tabs.map((item, index) => {
          return (
            <div
              className="flex flex-1 justify-center items-center mr-2 last:mr-0 p-2 rounded-lg font-bold"
              style={{
                backgroundColor: activeTab !== index ? "#2c71c3" : "",
                color: activeTab !== index ? "#FFFFFF" : "#FFFFFF",
                backgroundImage:
                  activeTab === index
                    ? "linear-gradient(#2283f6 10%, #67adff)"
                    : "",
              }}
              key={item}
              onClick={() => setActiveTab(index)}
            >
              {item}
            </div>
          );
        })}
      </div>
      <HistoryData current={current} activeTab={activeTab} />
    </>
  );
}
