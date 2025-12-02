import clsx from "clsx";
import { useEffect, useState } from "react";
import { K3BetType, K3Gameplay, K3OddsData } from "../types";

export default function K3Picker2({
  onPick,
  activeTab,
}: {
  onPick: (value: K3OddsData) => void;
  activeTab: K3Gameplay;
}) {
  const ballas: number[] = [11, 22, 33, 44, 55, 66]
  const ballbs: number[] = [1, 2, 3, 4, 5, 6]
  const [selectNum1, setSelectNum1] = useState<number[]>([])
  const [selectNum2, setSelectNum2] = useState<number[]>([])
  const [selectNum3, setSelectNum3] = useState<number[]>([])
  useEffect(() => {
    if (activeTab !== K3Gameplay.same2) {
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
      type: K3BetType.TwoSame.toString(),
      value: [num.toString()],
    } as K3OddsData)
  }
  const handelSelect2 = (num: number) => {
    if (selectNum2.includes(num)) {
      setSelectNum2(selectNum2.filter(item => item !== num))
    } else {
      setSelectNum2([...selectNum2, num]);
      if (selectNum3.includes(num / 11)) {
        setSelectNum3(selectNum3.filter(item => item !== num / 11))
      }
    }
    onPick({
      type: K3BetType.TwoSameWithSingle.toString(),
      value: [num.toString()],
    } as K3OddsData)
  }
  const handelSelect3 = (num: number) => {
    if (selectNum3.includes(num)) {
      setSelectNum3(selectNum3.filter(item => item !== num))
    } else {
      setSelectNum3([...selectNum3, num]);
      if (selectNum2.includes(num * 11)) {
        setSelectNum2(selectNum2.filter(item => item !== num * 11))
      }
    }
    onPick({
      type: K3BetType.TwoSameWithSingleB.toString(),
      value: [num.toString()],
    } as K3OddsData)

  }
  return (
    <>
      <div>
        2 matching numbers: odds
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
      <div>A pair of unique numbers: odds</div>
      <div className="w-full grid grid-cols-6 gap-2 py-1">
        {ballas.map((tab, index) => {
          return (
            <div key={index}>
              <div
                className={clsx(
                  " text-center text-white rounded-sm",
                  selectNum2.includes(tab) && "bg-[#fb5b5b]",
                  !selectNum2.includes(tab) && "bg-[#fdadad]",
                )}
                onClick={() => handelSelect2(tab)}
              >{tab}</div>
            </div>
          )
        })}
      </div>
      <div className="w-full grid grid-cols-6 gap-2 py-1">
        {ballbs.map((tab, index) => {
          return (
            <div key={index}>
              <div
                className={clsx(
                  " text-center text-white rounded-sm",
                  selectNum3.includes(tab) && "bg-[#18B660]",
                  !selectNum3.includes(tab) && "bg-[#8bdaaf]",
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