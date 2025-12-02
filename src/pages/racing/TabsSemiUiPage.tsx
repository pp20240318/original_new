import clsx from "clsx";
import { useRef, useState } from "react";
import { useInViewport, useMemoizedFn } from "ahooks";
import IconLeft from "../../../public/left.svg";
import IconRight from "../../../public/right.svg";

import "./TabsSemiUi.css";

const TabPane = ({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div
      style={{
        display: active ? "block" : "none",
        transition: "all 0.3s ease",
      }}
    >
      {children}
    </div>
  );
};

export const TabsSemiUiPage = ({
  tabs,
  active,
  onChange,
}: {
  tabs: { label: string; content: React.ReactNode }[];
  active: number;
  onChange: (index: number) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement[]>([]);
  const [scrollActive, setScrollActive] = useState(0);

  const scrollLeft = () => {
    if (scrollActive > 0) {
      setScrollActive(scrollActive - 1);
      menuRef.current[scrollActive - 1].scrollIntoView({
        behavior: "smooth",
        inline: "start",
      });
    }
  };

  const scrollRight = () => {
    setScrollActive(scrollActive + 1);
    menuRef.current[scrollActive + 1].scrollIntoView({
      behavior: "smooth",
      inline: "end",
    });
  };

  const callback = useMemoizedFn((entry) => {
    if (entry.isIntersecting) {
      const active = entry.target.getAttribute("id") || "";
      if (active === "0" || parseInt(active) === tabs.length - 1) {
        setScrollActive(parseInt(active));
      }
    }
  });

  useInViewport(menuRef.current, {
    callback,
    root: () => document.getElementById("parent-scroll"),
  });

  return (
    <div className="flex flex-col items-center mb-4 mt-4 p-3 bg-base-900">
      <div className="tabs-bar-top">
        <div className="overflow-list">
          {(active > 0 || scrollActive > 0) && (
            <div
              className="tabs-bar-arrow-start"
              onClick={() => {
                scrollLeft();
              }}
            >
              <button className="text-[#ECF24F] bg-transparent">
                <img src={IconLeft} alt="left" />
              </button>
            </div>
          )}

          <div
            id="parent-scroll"
            className="overflow-list-scroll-wrapper"
            ref={scrollRef}
            style={{ overflowX: "auto", whiteSpace: "nowrap" }}
          >
            {tabs.map((item, index) => {
              return (
                <div
                  key={item.label}
                  ref={(el: HTMLDivElement) => {
                    menuRef.current[index] = el;
                  }}
                  id={index.toString()}
                  onClick={() => {
                    onChange(index);
                  }}
                  className={clsx(
                    "tabs-tab",
                    index === active && "tabs-tab-active"
                  )}
                >
                  {item.label}
                </div>
              );
            })}
          </div>
          {(active !== tabs.length - 1 || scrollActive !== tabs.length - 1) && (
            <div
              className="tabs-bar-arrow-end"
              onClick={() => {
                scrollRight();
              }}
            >
              <button className="text-[#ECF24F] bg-transparent">
                <img src={IconRight} alt="right" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="tab-content w-full text-white">
        {tabs.map((tab, index) => (
          <TabPane key={index} active={active === index}>
            {tab.content}
          </TabPane>
        ))}
      </div>
    </div>
  );
};
