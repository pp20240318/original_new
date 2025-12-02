import ViewModal from "@/components/ViewModal";
import clsx from "clsx";
import { useEffect, useState } from "react";
import AddIcon from "../../../public/add.svg";
import SubtractIcon from "../../../public/subtract.svg";
import { UxMessage } from "../../../ui";
import { useAppConfig } from "@/appconfig";

export default function BettingModal({
  open,
  onClose,
  onContent,
  onConfirm,
  start,
  activeType,
  tabValue,
  tabsList,
  titleValue,
}: {
  open: boolean;
  onClose?: () => void;
  onContent?: () => void;
  onConfirm?: (money: number) => void;
  start: boolean;
  activeType: number;
  tabValue: string;
  tabsList: any[];
  titleValue: string;
}) {
  const BalanceList = [10, 50, 100, 500];
  const [balance, setBalance] = useState(BalanceList[0]);
  const RandomBoxList = [1, 5, 50, 100, 500];
  const [active, setActive] = useState(0);
  const [randomBoxActive, setRandomBoxActive] = useState(0);
  const [num, setNum] = useState(1);
  const [isCheck, setIsCheck] = useState(true);
  const { SYMBOL } = useAppConfig();
  useEffect(() => {
    onClose?.();
  }, [start]);
  useEffect(() => {
    setBalance(BalanceList[0]);
    setActive(0);
    setRandomBoxActive(0);
    setNum(1);
    setIsCheck(true);
  }, [open]);

  return (
    <ViewModal
      open={open}
      isFootClose={!isCheck}
      title={"Racing " + activeType.toString() + " Min"}
      onClose={() => {
        onClose?.();
      }}
      closeTitle={`Total amount:${SYMBOL}${balance * num}`}
      onConfirm={() => {
        if (isCheck) {
          onConfirm?.(balance * num);
        } else {
          UxMessage.warning("checkbox");
        }
      }}
    >
      <div className="flex justify-center items-center pr-9 pb-2 font-semibold text-md">
        {tabValue === "Total"
          ? "Champion runner-up"
          : tabsList[parseInt(tabValue)]?.title}
        &nbsp;-&nbsp;&nbsp;{titleValue}
      </div>
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
                key={item}
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
                key={item}
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
        <div
          className="text-[#ECF24F]"
          onClick={() => {
            onContent?.();
          }}
        >
          《Pre-sale rules》
        </div>
      </div>
    </ViewModal>
  );
}
