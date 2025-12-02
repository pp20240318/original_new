import { useEffect, useState } from "react";
import { EEmit, EGame, EOn } from "./enums";
import { useSocketEmit, useSocketOn } from ".";
import clsx from "clsx";
import { useLogined } from "@/events";

export default function SocketDemo() {
  const isLogined = useLogined();
  console.log("isLogined", isLogined);

  /**
   * 监听事件 =============================================
   */

  // 默认得到最新数据, 没得到结果之前 balanceObj 为 undefined
  const balanceObj = useSocketOn<OnBalance>(EOn.BALANCE);

  // 传入了初始值，一开始 balanceObj2 即为初始值
  // 初始值是第二或者第三个参数，取决于是否在第二个参数位置传入回调函数，会自动识别
  const balanceObj2 = useSocketOn<OnBalance>(EOn.BALANCE, {
    balance: 0,
    business_id: "",
    currency: "",
    debit: -1,
    pay_out: null,
    typ: "",
  });

  // 通过回调只输出需要的字段, 此处在第三个参数位置传入了初始值
  // 第二个泛型指定的是经回调函数处理后的类型，不传默认与socket返回值类型一致，也可以传入自定义类型
  // 此处指定第二个泛型为 string, 则回调函数需要返回 string 类型，否则TS会提示错误
  const balance = useSocketOn<OnBalance, string>(
    EOn.BALANCE,
    (data) => data.balance.toFixed(2),
    "--"
  );

  // 通过回调输出历史数据集合, 此处在第三个参数位置传入了初始值
  const balanceObjArr = useSocketOn<OnBalance, Array<OnBalance[1]>>(
    EOn.BALANCE,
    (data, prev) => [data, ...prev],
    []
  );

  /**
   * 发送事件 =============================================
   */

  // 当传入了 defaultParams 并且不去设置 manual 为 true, 则一开始就会自动发送事件
  // 如果还传入了 refreshDeps 则当其中的某个状态变化就会再次自动发送事件
  const [playTowerPayload, setPlayTowerPayload] = useState<PlayTower[0][2]>({
    hit: 1,
    position: 2,
  });

  const { data: playTowerData } = useSocketEmit<PlayTower>({
    ready: isLogined,
    defaultParams: [EEmit.PLAY, EGame.TOWER, playTowerPayload],
    refreshDeps: [playTowerPayload],
    onSuccess: (data) => {
      console.log(data);
    },
  });

  // 没有传入 defaultParams 时, manual 会自动设为 true (防止以空参数自动发送事件导致错误)
  // 此时须手动调用 run 或者 runAsync 并传入相应参数
  const { data: betTowerData, run: betTowerRun } = useSocketEmit<BetTower>();

  const onBet = (payload: BetTower[0][2]) => {
    if (isLogined) betTowerRun(EEmit.BET, EGame.TOWER, payload);
  };

  const result = useSocketOn<OnCircleResult, OnCircleResult[1]["data"]>(
    EOn.WS_CIRCLE_RESULT,
    (data) => {
      console.log(data);
      return data.data;
    }
  );

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center gap-4">
        <span>
          Balance: {balanceObj?.balance} | {balance}
        </span>
        <button
          className="bg-sky-600 px-2 py-1 rounded text-white"
          onClick={() => setPlayTowerPayload({ hit: 3, position: 4 })}
        >
          PLAY
        </button>
        <button
          className="bg-sky-600 px-2 py-1 rounded text-white"
          onClick={() => onBet({ bet_amount: 100, bomb: 2 })}
        >
          BET
        </button>
      </div>

      <ul>
        <li className="flex justify-between bg-slate-500 px-2 py-1 text-white">
          <span>Balance</span>
          <span>Type</span>
        </li>
        {balanceObjArr.map((item, index) => (
          <li
            className={clsx(
              "flex justify-between px-2 py-1",
              index % 2 && "bg-slate-200"
            )}
            key={index}
          >
            <span>{item.currency + " " + item.balance.toFixed(2)}</span>
            <span>{item.typ}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
