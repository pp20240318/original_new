import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import { Input } from "@headlessui/react";
import { useAppConfig } from "@/appconfig";
import { UxMessage } from "../../../ui";
import { useSocketEmit, useSocketOn } from "@/socket";
import { EEmit, EGame, EOn } from "@/socket/enums";
import { useLogined } from "@/events";
import { wait } from "@/utils/wait";
import { Timeout } from "ahooks/lib/useRequest/src/types";

const scrollAudio = new Audio("/circle/circle-roulette.mp3");
const timeAudio = new Audio("/circle/circle-timer.mp3");
const finishAudio = new Audio("/circle/circle-finish.mp3");
let playing = false;

const colors = ["#5b6773", "#ea5656", "#28983b", "#dda800"]; //灰 红 绿 黄
const lenColors = ["#55657e", "#ed1d49", "#1bb83d", "#ffb636"];
const odds = [2.04, 3.12, 5.3, 53.03];
const len = ["35%", "50%", "70%", "85%"];
const sectors = [
  4, 3, 1, 2, 1, 2, 1, 2, 1, 3, 1, 3, 1, 2, 1, 2, 1, 2, 1, 3, 1, 3, 1, 2, 1, 2,
  1, 2, 1, 2, 1, 2, 1, 3, 1, 3, 1, 2, 1, 2, 1, 2, 1, 3, 1, 3, 1, 2, 1, 2, 1, 2,
  1, 3,
];
const myStones: { ang: number; type: number; x: number; y: number }[] = [];
let startAng = 0;
const interval = ((360 / sectors.length) * Math.PI) / 180;
for (let t = 0; t < sectors.length; t++) {
  myStones.push({
    type: sectors[t],
    ang: Math.floor((startAng / Math.PI) * 180),
    x: 182.5 * Math.sin(startAng) + 182.5,
    y: 182.5 * Math.cos(startAng) + 182.5,
  });
  startAng += interval;
}

let speed = 0.1;
const maxSpeed = 4;
let timer: NodeJS.Timeout | null = null;

export default function PeriodContent({
  start,
  setStart,
  balance = 0,
}: {
  start: boolean;
  setStart: Dispatch<SetStateAction<boolean>>;
  balance?: number;
}) {
  const { SYMBOL } = useAppConfig();
  const logined = useLogined();

  const [shipId, setShipId] = useState<string>(); // 当前期号
  // const [max, setMax] = useState(0); // 最大角度
  const [countDown, setCountDown] = useState(0); // 倒计时

  const result = useSocketOn<OnCircleResult, OnCircleResult[1]>(
    EOn.WS_CIRCLE_RESULT,
    (data) => {
      return data;
    }
  );

  const startObj = useSocketOn<OnCircleStart, OnCircleStart[1]>(
    EOn.WS_CIRCLE_START,
    (data) => {
      return data;
    }
  );

  // 开奖结果
  useEffect(() => {
    if (!result) return;
    if (result.ship_id === shipId && countDown <= 0) {
      if (!result?.data) return;
      const idx = result?.data?.index;
      let max = 0;

      setLabel("Show result");

      // 初始化转盘
      speed = 0.1; // 重置速度
      playing = false; // 重置播放状态
      rollDegRef.current = rollDegRef.current % 360;
      setRollDeg(rollDegRef.current); // 重置角度

      const ani = async () => {
        let newDeg = 0;
        // if (t > 1) {
        speed += 0.05;
        if (max) {
          const t = max - rollDegRef.current; // 计算当前角度与目标角度的差距
          speed = 0.03 * t; // 根据差距调整速度
          if (t < 2) speed = 0.1;
        }
        if (speed >= maxSpeed) {
          speed = maxSpeed;
          max = myStones[idx].ang + 361;
        }
        newDeg = rollDegRef.current + speed; // 更新角度
        if (!max) return requestAnimationFrame(ani);

        // } else {
        //   speed = 0.1; // 差距小于2时速度太慢了，直接重置速度
        //   newDeg = rollDegRef.current + speed; // 更新角度
        // }
        if (newDeg < max) {
          rollDegRef.current = newDeg; // 更新角度到 ref
          setRollDeg(newDeg); // 更新状态
          requestAnimationFrame(ani);
          if (max - newDeg < 1 && !playing) {
            playing = true;
            await wait(500);
            finishAudio.play();
            setBorderColor(
              colors[sectors[Math.floor((max % 360) / (360 / 54))] - 1]
            );
            setLabel("Preparing next round");
          }
        } else {
          rollDegRef.current = max;
          setRollDeg(max);
          await wait(1000);
          setResults((prev) => [result.data.num, ...(prev || [])].slice(0, 30));
        }
      };
      requestAnimationFrame(ani);
    }
  }, [result, shipId, countDown]);

  // 开始新一期
  useEffect(() => {
    if (!startObj) return;
    if (shipId !== startObj?.ship_id) {
      setLabel("Place your bets");
      setBorderColor("#1b2233");
      if (init) setInit(false);
      setShipId(startObj.ship_id);
      const t = startObj.nextSettleTime - new Date().getTime();
      setCountDown(Math.floor(t / 1000) - 3);
      setStateMode("betting");
    }
  }, [startObj]);

  const [betAmount, setBetAmount] = useState<string[]>([
    "1.0000",
    "1.0000",
    "1.0000",
    "1.0000",
  ]);
  const [currIndex, setCurrIndex] = useState(0);
  const [rollDeg, setRollDeg] = useState(0); // 转盘旋转角度
  const [init, setInit] = useState(true);
  const [stateMode, setStateMode] = useState<string>();
  const [label, setLabel] = useState<string>("Preparing next round");
  const [borderColor, setBorderColor] = useState<string>("#1b2233");
  const [results, setResults] = useState<number[]>(); // 历史结果

  const currSectorIndex = useMemo(() => {
    const t = rollDeg % 360;
    return Math.floor(t / (360 / 54));
  }, [rollDeg]);

  // 箭头颜色
  const arrowColor = useMemo(
    () => colors[sectors[currSectorIndex] - 1],
    [currSectorIndex]
  );

  // 播放转动的声音
  useEffect(() => {
    if (Math.round(rollDeg / (360 / sectors.length)) % 2) scrollAudio.play();
  }, [arrowColor]);

  // 倒计时
  useEffect(() => {
    if (init) return;
    if (countDown <= 0) {
      if (timer) clearInterval(timer);
      setLabel("Show result");
      return;
    }
    timer = setInterval(() => {
      timeAudio.play();
      setCountDown((prev) => Math.max(0, prev - 0.01)); // 每次减少 0.01 秒
    }, 10); // 每 10 毫秒更新一次
    return () => clearInterval(timer as Timeout); // 清除定时器
  }, [countDown]);

  // 更新余额
  useEffect(() => {
    if (start) return;
    if (balance && balance < Number(betAmount)) {
      const amount = [
        balance.toFixed(4),
        balance.toFixed(4),
        balance.toFixed(4),
        balance.toFixed(4),
      ];
      setBetAmount(amount);
    }
  }, [balance]);

  const rollDegRef = useRef(0); // 存储最新的 rollDeg

  const [betLoading, setBetLoading] = useState(false);

  // 下注请求
  const { run: betRun } = useSocketEmit<BetCircle>({
    onSuccess: async (r) => {
      setBetLoading(false);
      if (r.code !== 200) return UxMessage.error("bet fail");
    },
  });

  // 下注
  const betSubmit = useCallback(
    async (index: number) => {
      if (!shipId) return;
      if (!balance)
        return UxMessage.warning("Insufficient balance, please recharge");

      let amount = betAmount[index];
      if (Number(betAmount) > balance) amount = balance.toFixed(4);
      else if (Number(betAmount) < 0.0001) amount = "0.0001";
      setBetAmount((prev) => {
        const newArr = [...prev];
        newArr[index] = amount;
        return newArr;
      });

      setBetLoading(true);
      if (init) setInit(false);

      setStart(true);
      betRun(EEmit.BET, EGame.CIRCLE, {
        ship_id: shipId,
        money: Number(amount),
        num: index + 1,
      });
    },
    [balance, betAmount, shipId]
  );

  // 获取历史结果
  useSocketEmit<HisResultsCricle>({
    defaultParams: [EEmit.HIS_RESULTS, EGame.CIRCLE, {}],
    // refreshDeps: [pageIndex],
    onSuccess: (r) => {
      if (r.code === 200 && Array.isArray(r.data)) setResults(r.data);
    },
  });

  // 更改下注金额
  const changeBetAmount = useCallback(
    (value: number, index: number) => {
      let amount = value.toFixed(4);
      if (value > balance) {
        amount = balance + "";
      }
      if (isNaN(value) || value <= 0) {
        amount = "0.0001"; // 如果输入无效或小于等于 0，重置为最小值
      }

      setBetAmount((prev) => Object.assign([...prev], { [index]: amount }));
    },
    [balance]
  );

  return (
    <div className="relative flex justify-center mt-4 p-3 lg:px-20 rounded-xl w-full">
      <div className="w-full max-w-[650px]">
        <div className="relative">
          {/* jackpot */}
          {/* <div className="top-[50px] sm:top-[20px] left-1/2 sm:left-[20px] z-10 absolute scale-[.7] sm:scale-100 -translate-x-2/4 -translate-y-2/4 sm:-translate-x-0">
            <img src="/circle/jackpot.png" className="mb-[8px] w-[146px]" />
            <div className="font-bold text-[#ffc51c] text-sm leading-3">
              0.00679498 BTC
            </div>
          </div> */}

          {/* 历史结果 */}
          <div className="top-1/2 sm:right-2 left-0 sm:left-auto z-[4] absolute flex flex-col items-start sm:items-end w-[28px] sm:w-[50px] -translate-y-2/4">
            {results?.map((item, index) => (
              <div
                key={index}
                className="relative py-[4px] cursor-pointer"
                style={{
                  width: len[item - 1],
                }}
              >
                <span
                  className="block h-[2px]"
                  style={{
                    background: lenColors[item - 1],
                  }}
                />
              </div>
            ))}
          </div>

          {/* 转盘 */}
          <div className="relative flex justify-between items-center h-[264px] sm:h-[375px] scale-75 sm:scale-100">
            <img
              src="/circle/leftside.png"
              className="hidden sm:block h-[376px]"
            />
            <div
              className="left-1/2 absolute flex justify-center items-center rounded-full w-[372px] -translate-x-1/2 will-change-transform"
              style={{
                border: `4px solid ${borderColor}`,
                transition: "border 1.5s",
              }}
            >
              <img
                src="circle/circle.svg"
                className="origin-center will-change-transform"
                style={{
                  transformOrigin: "50% 50%",
                  transform: `scale(1.1) rotate(${
                    start ? rollDeg % 360 : rollDeg
                  }deg)`,
                }}
              />
              <div className="bottom-24 left-1/2 absolute font-bold text-[#5b6773] text-xs text-center uppercase -translate-x-2/4">
                {label}
              </div>

              {Number(countDown) > 0 ? (
                // 倒计时
                <span
                  className="left-1/2 absolute min-w-[120px] max-w-[120px] font-bold text-[48px] text-white text-left -translate-x-2/4"
                  style={{
                    letterSpacing: "2px",
                    fontFamily: `"Roboto", sans-serif`,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {countDown.toFixed(2)}
                </span>
              ) : (
                //loading spin
                <div
                  className="top-1/2 left-1/2 z-[1] absolute w-[81px] h-[81px] translate-[translate(-50%,-50px)]"
                  style={{
                    transform: "translate(-50%,-50px)",
                  }}
                >
                  <div
                    className="relative w-full h-full"
                    style={{
                      transform: "translateZ(0) scale(.81)",

                      transformOrigin: "0 0",
                    }}
                  >
                    <div className="box-content absolute border-[#fa305c] border-5 rounded-full animate-[ldio_2s_cubic-bezier(0,.2,.8,1)_infinite]" />
                    <div
                      className="box-content absolute border-[#1bb83d] border-5 rounded-full animate-[ldio2_2s_cubic-bezier(0,.2,.8,1)_infinite]"
                      style={{ animationDelay: "-1s" }}
                    />
                  </div>
                </div>
              )}
              {/* 箭头 */}
              <span
                className="arrow-down"
                style={{
                  borderColor: `${arrowColor} transparent transparent`,
                }}
              ></span>
            </div>
            <img
              src="/circle/rightside.png"
              className="hidden sm:block h-[376px]"
            />
          </div>
        </div>

        {/* 下注区 */}
        <div
          className={clsx(
            "relative flex flex-wrap justify-between w-auto h-auto",
            countDown <= 0 &&
              "opacity-60 cursor-not-allowed disabled pointer-events-none"
          )}
        >
          {odds.map((item, index) => (
            <div
              key={index}
              className={clsx(
                "flex flex-col gap-1 mt-5 w-[49%] sm:w-[24%]",
                betLoading &&
                  currIndex === index &&
                  "opacity-60 cursor-not-allowed disabled pointer-events-none"
              )}
            >
              <div
                className={clsx(
                  "flex-col flex-1 bg-[#19212c] border border-[#4b5b74] rounded-md font-[600] text-[#55657e] text-[12px] bet-btn"
                )}
              >
                <div className="flex justify-between p-1">
                  <div className="flex flex-col justify-center items-center w-full">
                    <div className="flex items-center gap-1">
                      <span className="font-thin text-[#319470] text-[22px]">
                        {SYMBOL}
                      </span>
                      <Input
                        className="flex-1 bg-transparent border-none outline-none w-[120px] text-[18px] text-white"
                        value={betAmount[index]}
                        style={{
                          width: betAmount[index].length + 1 + "ch",
                        }}
                        onBlur={(e) => {
                          const value = parseFloat(
                            (e.target as HTMLInputElement).value
                          );
                          changeBetAmount(value, index);
                        }}
                        onInput={(e) => {
                          const input = e.target as HTMLInputElement;
                          // 只允许输入数字和小数点
                          let value = input.value.replace(/[^0-9.]/g, "");
                          // 确保小数点只出现一次
                          if ((value.match(/\./g) || []).length > 1) {
                            value = value.slice(0, -1);
                          }
                          // 限制小数点后最多四位
                          if (value.includes(".")) {
                            const [integerPart, decimalPart] = value.split(".");
                            value =
                              decimalPart.length > 4
                                ? `${integerPart}.${decimalPart.slice(0, 4)}`
                                : value;
                          }
                          setBetAmount((prev) =>
                            Object.assign([...prev], { [index]: value })
                          );
                        }}
                      />
                    </div>
                    <div className="text-[14px]">
                      {SYMBOL}
                      {Number(betAmount[index]).toFixed(4)}
                    </div>
                  </div>
                </div>
              </div>
              {/* 快捷加注按钮 */}
              <div className="flex justify-between gap-1">
                <button
                  className="bg-[#283343] px-2 py-1.5 rounded-md w-1/3 font-bold text-[#6e7c8a] text-2xs"
                  onClick={() => {
                    const v = Number(betAmount[index]) / 2;
                    changeBetAmount(v, index);
                  }}
                >
                  /2
                </button>
                <button
                  className="bg-[#283343] px-2 py-1.5 rounded-md w-1/3 font-bold text-[#6e7c8a] text-2xs"
                  onClick={() => {
                    const v = Number(betAmount[index]) * 2;
                    changeBetAmount(v, index);
                  }}
                >
                  2x
                </button>
                <button
                  className="bg-[#283343] rounded-md w-1/3 font-bold text-[#6e7c8a] text-2xs"
                  onClick={() =>
                    setBetAmount((prev) =>
                      Object.assign([...prev], { [index]: balance.toFixed(4) })
                    )
                  }
                >
                  Max
                </button>
              </div>
              <button
                className="relative bg-red-400 mt-2 rounded-md min-h-[50px] font-bold text-white text-lg"
                style={{
                  background: lenColors[index],
                }}
                onClick={() => {
                  console.log("点击下注");
                  setCurrIndex(index);
                  betSubmit(index);
                }}
                disabled={countDown <= 0 || (betLoading && currIndex === index)}
              >
                {countDown <= 0 || (betLoading && currIndex === index) ? (
                  <div className="spinner_md spinner">
                    <span className="spinner__bounce"></span>
                    <span className="spinner__bounce"></span>
                    <span className="spinner__bounce"></span>
                  </div>
                ) : (
                  item + "X"
                )}
              </button>
            </div>
          ))}
        </div>
        {/* ----下注按钮结束---- */}
      </div>
    </div>
  );
}
