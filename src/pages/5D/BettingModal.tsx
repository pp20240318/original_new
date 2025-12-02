import { ReactNode, useEffect, useState } from "react";
import clsx from "clsx";
import AddIcon from "../../../public/add.svg";
import SubtractIcon from "../../../public/subtract.svg";
import PopupModal from "@/components/PopupModal";
import { use5DTabcontent } from "@/hooks/use5DTabcontent";
import { UxMessage } from "../../../ui";

export default function BettingPopupModal({
  children,
  showPopup,
  position = "bottom",
  onClose,
  onContent,
  onConfirm,
  start,
}: {
  children: ReactNode;
  showPopup: boolean;
  onClose: () => void;
  onContent: () => void;
  position?: "bottom" | "bottom" | "right" | "left" | "center";
  onConfirm?: (money: number) => void;
  start: boolean;
}) {
  const [tabcontent] = use5DTabcontent();
  const BalanceList = [10, 50, 100, 500];
  const [balance, setBalance] = useState(10);
  const RandomBoxList = [1, 5, 50, 100, 500];
  const [active, setActive] = useState(0);
  const [randomBoxActive, setRandomBoxActive] = useState(0);
  const [isCheck, setIsCheck] = useState(true);
  const [num, setNum] = useState(1);
  const getNumberCount = (str: string) => {
    const items = str.split(",");
    return items.filter((item) => item.trim() !== "").length;
  };
  useEffect(() => {
    onClose?.();
  }, [start]);
  useEffect(() => {
    setBalance(BalanceList[0]);
    setActive(0);
    setRandomBoxActive(0);
    setNum(1);
    setIsCheck(true);
  }, [showPopup]);

  return (
    <PopupModal
      visible={showPopup}
      onClose={() => onClose()}
      position={position}
      className="bg-base-800"
    >
      {children}
      <div className="w-full text-white">
        <div className="p-3">
          <div className="flex justify-between items-center mb-2">
            <div className="font-bold text-lg">Balance</div>
            <div className="flex flex-1 justify-end items-center">
              {BalanceList.map((item, index) => {
                return (
                  <div
                    className={clsx("px-2 py-1 rounded-md cursor-pointer", {
                      content_info_active: active === index,
                      content_info: active !== index,
                    })}
                    key={index}
                    onClick={() => {
                      setBalance(item);
                      setActive(index);
                    }}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="font-bold text-lg">Quantity</div>
            <div className="flex flex-1 justify-end items-center">
              <button
                className="bg-transparent mr-1 text-[#ECF24F]"
                onClick={() => {
                  if (num > 1) {
                    const index = RandomBoxList.findIndex(
                      (item) => item === num - 1
                    );
                    setRandomBoxActive(index);
                    setNum(num - 1);
                  }
                }}
              >
                <img className="w-6 h-6" src={SubtractIcon} alt="subtract" />
              </button>
              <input
                style={{
                  width: "60px",
                  height: "24px",
                  backgroundColor: "#4c38",
                  border: "1px solid #F6FDFF",
                  borderRadius: "4px",
                  textAlign: "center",
                  outline: "none",
                  transition: "border-color 0.3s",
                }}
                value={num}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (isNaN(value) || value < 1) {
                    setNum(1);
                  } else {
                    setNum(value);
                    const index = RandomBoxList.findIndex(
                      (item) => item === value + 1
                    );
                    setRandomBoxActive(index);
                  }
                }}
              />
              <button
                className="bg-transparent ml-1 text-[#ECF24F]"
                onClick={() => {
                  if (num < RandomBoxList[RandomBoxList.length - 1]) {
                    setNum(num + 1);
                    const index = RandomBoxList.findIndex(
                      (item) => item === num + 1
                    );
                    setRandomBoxActive(index);
                  }
                }}
              >
                <img className="w-6 h-6" src={AddIcon} alt="add" />
              </button>
            </div>
          </div>
          <div>
            <div className="flex flex-1 justify-end items-center">
              {RandomBoxList.map((item, index) => {
                return (
                  <div
                    className={clsx("px-2 py-1 rounded-md cursor-pointer", {
                      content_info_active:
                        num === item ? num === item : randomBoxActive === index,

                      content_info: randomBoxActive !== index,
                    })}
                    key={index}
                    onClick={() => {
                      setRandomBoxActive(index);
                      setNum(item);
                    }}
                  >
                    {"X" + item}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center mt-4 mb-2">
            <div>
              <input
                type="checkbox"
                id="myCheckbox"
                checked={isCheck}
                onChange={() => {
                  setIsCheck(!isCheck);
                }}
              />
              <label className="ml-2 text-sm" htmlFor="myCheckbox">
                I agree
              </label>
            </div>
            <div className="text-[#ECF24F]" onClick={() => onContent?.()}>
              《Pre-sale rules》
            </div>
          </div>
        </div>
        <div className="flex h-8">
          <button
            className="bg-base-400 w-1/3 font-medium text-sm text-base-200"
            onClick={() => {
              onClose();
            }}
          >
            cancel
          </button>
          <button
            className={clsx(
              "bg-[#f95959] w-full font-medium text-white text-sm"
            )}
            onClick={() => {
              if (isCheck) {
                onConfirm?.(balance * num);
              } else {
                UxMessage.warning("checkbox");
              }
            }}
          >
            Total amount
            {tabcontent.bigTabContent || tabcontent.activeTabContent
              ? !tabcontent.activeTabContent
                ? balance * num
                : getNumberCount(tabcontent.activeTabContent) * balance * num
              : 0}
          </button>
        </div>
      </div>
    </PopupModal>
  );
}
