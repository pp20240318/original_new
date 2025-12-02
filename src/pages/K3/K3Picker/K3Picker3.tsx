import clsx from "clsx";
import { useEffect, useState } from "react";
import { K3BetType, K3Gameplay, K3OddsData } from "../types";

export default function K3Picker3({
  onPick,
  activeTab,
}: {
  onPick: (value: K3OddsData) => void;
  activeTab:K3Gameplay;
}) {
  const ballas: number[] = [111, 222, 333, 444, 555, 666]
  const ballbs: number[] = [1, 2, 3, 4, 5, 6]
  const [selectNum1, setSelectNum1] = useState<number[]>([])
  const [selectNum2, setSelectNum2] = useState<number[]>([])
  useEffect(() => {
    if (activeTab !== K3Gameplay.same3) {
      setSelectNum1([])
      setSelectNum2([])
    }
    }, [activeTab]);
  const handelSelect1 = (num: number) => {
    if (selectNum1.includes(num)) {
      setSelectNum1(selectNum1.filter(item => item !== num))
    } else {
      setSelectNum1([...selectNum1, num])
    }
    onPick({
          type: K3BetType.ThreeSame.toString(),
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
      type: K3BetType.AnyThreeSame.toString(),
      value: [num.toString()],
    } as K3OddsData)
  }

  return (
    <>
      <div>
        3 of the same number: odds
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
      <div>Any 3 of the same number: odds </div>
      <div className="w-full">

        <div>
          <div
            className={clsx(
              " text-center text-white rounded-sm text-xs",
              selectNum2.includes(777) && "bg-[#fb5b5b]",
              !selectNum2.includes(777) && "bg-[#fdadad]",
            )}
            onClick={() => handelSelect2(777)}
          >Any 3 of the same number: odds</div>
        </div>
      </div>
    </>
  );
}