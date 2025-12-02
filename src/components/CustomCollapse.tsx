import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const CustomCollapse = ({
  children,
  defaultActiveKey,
  accordion = false,
}: {
  children: React.ReactNode;
  defaultActiveKey: string;
  accordion?: boolean;
}) => {
  const [activeKeys, setActiveKeys] = useState(
    defaultActiveKey
      ? Array.isArray(defaultActiveKey)
        ? defaultActiveKey
        : [defaultActiveKey]
      : []
  );

  const handleItemClick = (key: string) => {
    if (accordion) {
      setActiveKeys(activeKeys.includes(key) ? [] : [key]);
    } else {
      setActiveKeys((prevKeys) =>
        prevKeys.includes(key)
          ? prevKeys.filter((k) => k !== key)
          : [...prevKeys, key]
      );
    }
  };

  return (
    <div className="custom-collapse">
      {React.Children.map(children, (child: any) =>
        React.cloneElement(child, {
          isActive: activeKeys.includes(child.key),
          onClick: () => handleItemClick(child.key),
        })
      )}
    </div>
  );
};

CustomCollapse.Item = ({
  children,
  header,
  isActive,
  onClick,
}: {
  children?: React.ReactNode;
  header?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div className="custom-collapse-item bg-[#22674d]">
      <div className="custom-collapse-header" onClick={onClick}>
        {header}
        <span className={"custom-collapse-icon"}>
          {isActive ? (
            <ChevronUpIcon className="h-5 w-5 text-white" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-white" />
          )}
        </span>
      </div>
      <div
        className={`custom-collapse-content bg-[#22674d]  ${
          isActive ? "open" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default CustomCollapse;
