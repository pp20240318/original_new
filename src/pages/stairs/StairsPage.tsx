import {
  AnimationEventHandler,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./Board.css";
import "./index.css";
// import { useSocket, emitSocketEvent, emitSocketGameEvent } from "@/hooks/useSocket";
import { use } from "i18next";
import clsx from "clsx";
import { Input } from "@headlessui/react";
import { useAppConfig } from "@/appconfig";
import { UxMessage } from "../../../ui";
import BalanceBox from "../tower/BalanceBox";
import { useSocketEmit } from "@/socket";
import { EEmit, EGame } from "@/socket/enums";
import { wait } from "@/utils/wait";
import { emitLogined, useLogined, useSocketBalance } from "@/events";
// import { emitSocketEvent, useSocket } from "@/hooks/useSocket";
import HistoryPage from "./HistoryPage";

const shape = [
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const rtpList = [
  [
    2.8056, 2.455, 2.1822, 1.964, 1.7854, 1.6366, 1.5107, 1.4028, 1.3093,
    1.2275, 1.1553, 1.0911, 1.0337,
  ],
  [
    8.885, 6.6634, 5.183, 4.1461, 3.3922, 2.827, 2.392, 2.0503, 1.777, 1.5548,
    1.3719, 1.2195, 1.0911,
  ],
  [
    31.985, 19.99, 13.327, 9.329, 6.785, 5.0887, 3.9141, 3.0754, 2.4605, 1.999,
    1.6463, 1.3719, 1.1553,
  ],
  [
    135.94, 67.97, 37.76, 22.656, 14.417, 9.612, 6.654, 4.753, 3.4856, 2.6141,
    1.999, 1.5548, 1.2275,
  ],
  [
    725, 271.88, 120.83, 60.414, 32.954, 19.223, 11.83, 7.605, 5.07, 3.4855,
    2.4605, 1.777, 1.3092,
  ],
  [
    5437.5, 1359.4, 453.1, 181.24, 82.39, 41.191, 22.18, 12.675, 7.605, 4.753,
    3.0755, 2.0504, 1.4028,
  ],
  [
    76125, 9516, 2114.5, 634.4, 230.67, 96.12, 44.36, 22.18, 11.83, 6.654,
    3.9143, 2.392, 1.5107,
  ],
];

export default function StairsPage() {
  const { SYMBOL } = useAppConfig();
  // const gameName = "stairs"; // 游戏名称
  // const [rtp, setRtp] = useState(98.2)//rtp显示值
  const [stoneCount, setStoneCount] = useState(1); //石头数量
  const [manLeft, setManLeft] = useState(0); //小人横向的位置 坐标
  const [nowLevel, setNowLevel] = useState(13); //当前垂直的层数
  const [isLeft, setIsLeft] = useState(false); //小人是否向左侧移动
  const [manBottom, setManBottom] = useState(0); //小人纵向的位置 坐标
  const [isManAnimating, setIsManAnimating] = useState(false); // man 是否正在动画中
  const [manAct, setManAct] = useState("run"); // 小人的动作 是走还是爬
  const [stairPosition, setStairPosition] = useState(""); // 楼梯坐标
  const [stoneList, setStoneList] = useState<string[]>([]); // 石头列表
  const [start, setStart] = useState(false); // 是否开始游戏
  const [payout, setPayout] = useState(0);

  // const [isConn, setIsConn] = useState(false); // 是否连接成功
  const [betAmount, setBetAmount] = useState<string>("1.0000");
  const [balance, setBalance] = useState(0.0);
  // const [win, setWin] = useState(null);
  const [resultShow, setResultShow] = useState<{
    payout: number;
    mul: number;
  } | null>(null);

  const balanceObj = useSocketBalance();

  const startRef = useRef(start);

  useEffect(() => {
    setBalance(balanceObj?.balance || 0.0);
  }, [balanceObj?.balance]);

  useEffect(() => {
    startRef.current = start;
  }, [start]);


  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");

  useSocketEmit<EmitLogin>({
    defaultParams: [EEmit.LOGIN, { token: token ? token : "", userId: "" }],
    onSuccess: (res) => {
      emitLogined(true);
      // setIsConn(true);
    },
  });

  // const logined = useLogined();

  const manGo = async (row: number, column: number) => {
    await playRunAsync(EEmit.PLAY, EGame.STAIRS, {
      hit: 13 - row,
      position: column + 1,
    });
    setStairPosition(`${row},${column}`);
    setNowLevel(nowLevel - 1);
    setIsManAnimating(true);
    setManAct("run");
    if (manLeft > column * 5 + 2.5) {
      setIsLeft(true);
    } else {
      setIsLeft(false);
    }
    setManLeft(column * 5 + 2.5);
    await wait(450);
    setManAct("climb");
    setManBottom(manBottom + 100 / 13);

    setTimeout(() => {
      console.log("startRef.current", startRef.current);
      if (startRef.current) {
        if (payout > 0 && nowLevel === 1) {
          setManAct("win");
        } else {
          setManAct("run");
        }
        setIsManAnimating(false);
      } else {
        // manDie();
        console.log("die222222");
      }
    }, 700);
  };

  const manDie = () => {
    setIsManAnimating(true);
    setManAct("die");
    console.log("die1111111");
  };

  // 下注
  const { run: betRun } = useSocketEmit<BetStairs>({
    onSuccess: (r) => {
      console.log("下注返回:", r);
      if (r.code !== 200) return UxMessage.error("data error");
      setStart(true);
    },
  });

  // 结算
  const betSubmit = () => {
    if (start) {
      CashoutRun(EEmit.CASHOUT, EGame.STAIRS, {}); // 结算
      return;
    }
    // 初始化游戏
    setManLeft(0);
    setManBottom(0);
    setStoneList([]);
    setStairPosition("");
    setNowLevel(13);
    setIsLeft(false);
    setManAct("run");
    setIsManAnimating(false);
    betRun(EEmit.BET, EGame.STAIRS, {
      bet_amount: Number(betAmount),
      bomb: stoneCount,
    });
  };

  const { runAsync: playRunAsync } = useSocketEmit<PlayStairs>({
    onSuccess(r) {
      // console.log("点击格子返回：", JSON.stringify(r, null, 2));
      if (r.code !== 200) return UxMessage.error("data error");
      // setWin(r.data.win);
      setTimeout(() => {
        setStoneList([]);
        r.data.bombs.forEach((bombArray: any, bombIndex: number) => {
          bombArray.forEach((item: any) => {
            setStoneList((prevStoneList) => [
              ...prevStoneList,
              `${13 - bombIndex - 1},${item - 1}`,
            ]);
          });
        });
      }, 400);
      if (r.data.win) {
        setPayout(r.data.payout);
        console.log("成功111111111");
        if (r.data.positions.length >= 13) {
          CashoutRun(EEmit.CASHOUT, EGame.STAIRS, {}); // 结算
        }
        //settlement(); // 通关结算
      } else {
        console.log("失败2");
        setStart(false);
        setPayout(0);
        setTimeout(() => {
        manDie();}, 700); // 小人死亡
      }
    },
  });

  // 结算
  const { run: CashoutRun } = useSocketEmit<CashoutStairs>({
    onSuccess: (r) => {
      console.log("结算返回:", r);
      setResultShow({ payout: r.data.payout, mul: r.data.multiplier });
      setStart(false);
      setPayout(0);
      setTimeout(() => setResultShow(null), 3000);
    },
  });

  return (
    <div className="bg-[#0d131c] container">
      <BalanceBox balance={balanceObj?.balance} />

      {/* RTP 头部 */}
      <div className="dapps-top flex flex-row justify-between items-center text-white">
        <div className="dapps-top__info">
          <div className="rtp-wrap">
            <div className="rtp-wrap__text">RTP</div>
            <div className="rtp-wrap__value">98.2%</div>
            <div className="rtp">
              <div className="text-[#55657e] tooltip tooltip_empty">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="dapps-top__divider"></div>
          <div className="dapps-top__button text-[#55657e] v-popper--has-tooltip">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </div>
        </div>

        <div className="dapps-top__buttons text-[#55657e]">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 0 1-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584ZM12 18a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
      {/* 台阶主体 */}
      <div className="stairs">
        <div className="text-white stairs__top">
          <div className="board">
            <div className="coefficients">
              <div className="coefficients__outer desktop">
                <div className="coefficients__inner">
                  {rtpList[stoneCount - 1].map((item, index) => {
                    return (
                      <div className="coeficient-item" key={index}>
                        x{item}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="coefficients__outer mobile">
                <div className="coefficients__inner small">
                  {rtpList[stoneCount - 1].map((item, index) => {
                    return (
                      <div
                        className={`coeficient-item${
                          index > 4 ? " hidden" : ""
                        }`}
                        key={index}
                      >
                        x{item}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="stairs-board">
              {shape.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`stairs-board__row ${
                      index === nowLevel - 1 && start ? "" : "disabled"
                    }`}
                    style={{
                      gridTemplateColumns: "repeat(20, minmax(0, 1fr))",
                    }}
                  >
                    {item.map((v, i) => {
                      return (
                        <button
                          key={i}
                          className={`stairs-tile${
                            v !== 1 ? " empty" : ""
                          } cursor-pointer`}
                          onClick={() => {
                            // console.log('Button clicked:', index, i); // 调试信息
                            manGo(index, i);
                            // play(index, i);
                            // console.log(index, i);
                            // alert("aaa");
                          }}
                        >
                          <div className="item"></div>
                          {stairPosition === `${index},${i}` && (
                            <>
                              <div className="stair"></div>
                              <div className="stair2"></div>
                            </>
                          )}
                          {stoneList.includes(`${index},${i}`) && (
                            <>
                              <div className="stone"></div>
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
              <div
                className={`man ${manAct} ${
                  isManAnimating ? "isAnimate" : ""
                } ${isLeft ? "left" : ""}`}
                style={{ left: manLeft + "%", bottom: manBottom + "%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="flex flex-row justify-between gap-1 text-white">
      <div className="bg-[#333333] rounded-lg w-full text-center" onClick={() => {
        console.log(stairPosition);
      }}>
        A
      </div>
      <div className="bg-[#333333] rounded-lg w-full text-center" onClick={() => {
        manDie();
      }}>
        B
      </div>
      <div className="bg-[#333333] rounded-lg w-full text-center" onClick={() => {
        console.log(manAct);
      }}>
        stoneList
      </div>
      <div className="bg-[#333333] rounded-lg w-full text-center" onClick={() => {
        manDie();
      }}>
        die
      </div>

    </div> */}

      {/* 2x2 */}
      <div className="buttons">
        <div className="buttons__row">
          <div className="level-btns">
            {Array.from({ length: 7 }, (_, index) => (
              <label
                key={index}
                onClick={() => {
                  setStoneCount(index + 1);
                  // setRtp(rtpList[index][0]);
                }}
              >
                <input
                  type="radio"
                  id={"aa" + index}
                  checked={stoneCount === index + 1 ? true : false}
                  name="level"
                ></input>
                <div className="check">{index + 1}</div>
              </label>
            ))}
          </div>
          {/* <div className="auto-pick">
                    <button className="btn btn_yellow" disabled><span>Auto Pick</span></button>
                    <span>or</span>
                    <div>选择老虎机</div>
                </div> */}
        </div>

        {/* ---- 下注按钮 ---- */}
        <div className="flex gap-3 mt-5">
          <div
            className={clsx(
              "flex flex-1 justify-between bg-[#19212c] p-2 border border-[#4b5b74] rounded-md font-[600] text-[#55657e] text-[12px] bet-btn",
              start && "opacity-60 cursor-not-allowed disabled"
            )}
          >
            <button
              className="bg-[#283343] mr-2 rounded-md w-[40px]"
              onClick={() => setBetAmount(balance.toFixed(4))}
            >
              Max
            </button>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <span className="font-thin text-[#319470] text-[22px]">
                  {SYMBOL}
                </span>
                <Input
                  className="flex-1 bg-transparent border-none outline-none w-[120px] text-[18px] text-white"
                  value={betAmount}
                  onBlur={(e) => {
                    const value = parseFloat(
                      (e.target as HTMLInputElement).value
                    );
                    if (value > balance) {
                      return setBetAmount(balance + "");
                    }
                    if (isNaN(value) || value <= 0) {
                      // 如果输入无效或小于等于 0，重置为最小值
                      setBetAmount("0.00000001");
                    } else setBetAmount(value.toFixed(4));
                  }}
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    // 只允许输入数字和小数点
                    let value = input.value.replace(/[^0-9.]/g, "");
                    // 确保小数点只出现一次
                    if ((value.match(/\./g) || []).length > 1) {
                      value = value.slice(0, -1);
                    }
                    setBetAmount(value);
                  }}
                />
              </div>
              <div className="text-[14px]">
                {SYMBOL}
                {Number(betAmount).toFixed(4)}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                className="bg-[#283343] px-2 py-0.5 rounded-md"
                onClick={() => {
                  const v = Number(betAmount) / 2;
                  if (v < 0.00000001) return setBetAmount("0.00000001");
                  setBetAmount(v.toFixed(4));
                }}
              >
                1/2
              </button>
              <button
                className="bg-[#283343] px-2 py-0.5 rounded-md"
                onClick={() => {
                  const v = Number(betAmount) * 2;
                  if (v > balance) return setBetAmount(balance.toFixed(4));
                  setBetAmount(v.toFixed(4));
                }}
              >
                2x
              </button>
            </div>
          </div>
          <button
            className="flex-1 bg-[#2283f6] rounded-md font-bold text-white"
            disabled={start && !payout}
            onClick={betSubmit}
          >
            {start ? (
              <div className="flex flex-col">
                <span className="text-[18px]">Cashout</span>
                <span className="text-[12px]">{payout.toFixed(4)}</span>
              </div>
            ) : (
              "BET"
            )}
          </button>
        </div>
        {/* ----下注按钮结束---- */}

        {/* ---- 结算金额 ---- */}
        <div
          style={{
            transform: resultShow ? "translate(-50%)" : "translate(-50%, 10px)",
            transition: "all .3s",
          }}
          className={clsx(
            "top-[25%] left-[50%] z-10 absolute flex flex-col justify-center items-center bg-[linear-gradient(180deg,#0051cb_16.13%,#489cff_83.87%)] px-[10px] py-[15px] rounded-lg w-[200px] h-[100px] overflow-hidden font-bold",
            resultShow
              ? "animate-[show-window_ease_infinite] delay-1000 opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
        >
          <img
            src="tower/lines-bg.webp"
            className="-top-[40px] absolute opacity-90 min-w-[488px] h-[488px] animate-spin"
            style={{
              animationDuration: "24s",
            }}
          />
          <p className="text-white text-3xl">{resultShow?.mul}x</p>
          <span className="text-white text-sm">
            {SYMBOL}
            {resultShow?.payout}
          </span>
        </div>
      </div>
      <HistoryPage current={5} />
    </div>
  );
}
