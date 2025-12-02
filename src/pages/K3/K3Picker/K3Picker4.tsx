import clsx from "clsx";
import { useEffect, useState } from "react";
import { K3BetType, K3Gameplay, K3OddsData } from "../types";

export default function K3Picker4({
  onPick,
  activeTab,
}: {
  onPick: (value: K3OddsData) => void;
  activeTab: K3Gameplay;
}) {
  const ballas: number[] = [1, 2, 3, 4, 5, 6]
  const [selectNum1, setSelectNum1] = useState<number[]>([])
  const [selectNum2, setSelectNum2] = useState<number[]>([])
  const [selectNum3, setSelectNum3] = useState<number[]>([])
  useEffect(() => {
    if (activeTab !== K3Gameplay.different) {
      setSelectNum1([])
      setSelectNum2([])
      setSelectNum3([])
    }
  }, [activeTab]);
  const handelSelect1 = (num: number) => {
    if (selectNum1.includes(num)) {
      setSelectNum1(selectNum1.filter(item => item !== num))
    } else {
      setSelectNum1([...selectNum1, num])
    }
    onPick({
      type: K3BetType.ThreeDifferent.toString(),
      value: [num.toString()],
    } as K3OddsData)
  }
  const handelSelect2 = (num: number) => {
    if (selectNum2.includes(num)) {
      setSelectNum2(selectNum2.filter(item => item !== num))
    } else {
      setSelectNum2([...selectNum2, num]);
    }
    onPick({
      type: K3BetType.Continuous.toString(),
      value: [num.toString()],
    } as K3OddsData)
  }
  const handelSelect3 = (num: number) => {
    if (selectNum3.includes(num)) {
      setSelectNum3(selectNum3.filter(item => item !== num))
    } else {
      setSelectNum3([...selectNum3, num]);
    }
    onPick({
      type: K3BetType.TwoDifferent.toString(),
      value: [num.toString()],
    } as K3OddsData)
  }

  return (
    <>
      <div>
        3 different numbers: odds
      </div>
      <div className="w-full grid grid-cols-6 gap-2 py-1">
        {ballas.map((tab, index) => {
          return (
            <div key={index}>
              <div
                className={clsx(
                  " text-center text-white rounded-sm",
                  selectNum1.includes(tab) && "bg-[#c86eff]",
                  !selectNum1.includes(tab) && "bg-[#e3b6ff]",
                )}
                onClick={() => handelSelect1(tab)}
              >{tab}</div>
            </div>
          )
        })}
      </div>
      <div>3 continuous numbers: odds </div>
      <div className="w-full">

        <div>
          <div
            className={clsx(
              " text-center text-white rounded-sm text-xs",
              selectNum2.includes(777) && "bg-[#fb5b5b]",
              !selectNum2.includes(777) && "bg-[#fdadad]",
            )}
            onClick={() => handelSelect2(777)}
          >3 continuous numbers</div>
        </div>
      </div>
      <div>2 different numbers: odds </div>
      <div className="w-full grid grid-cols-6 gap-2 py-1">
        {ballas.map((tab, index) => {
          return (
            <div key={index}>
              <div
                className={clsx(
                  " text-center text-white rounded-sm",
                  selectNum3.includes(tab) && "bg-[#c86eff]",
                  !selectNum3.includes(tab) && "bg-[#e3b6ff]",
                )}
                onClick={() => handelSelect3(tab)}
              >{tab}</div>
            </div>
          )
        })}
      </div>
    </>
  );
}