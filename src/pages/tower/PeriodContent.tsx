import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import clsx from "clsx";
import { Input } from "@headlessui/react";
import { useAppConfig } from "@/appconfig";
import { UxMessage } from "../../../ui";
import { useSocketEmit } from "@/socket";
import { EEmit, EGame } from "@/socket/enums";
import { useLogined } from "@/events";

const windowArr = [
  {
    top: "156px",
    left: "8%",
    delay: "1s",
  },
  {
    top: "158px",
    left: "17.5%",
    delay: "2s",
  },
  {
    top: "168px",
    left: "14.5%",
    delay: ".5s",
  },
  {
    top: "182px",
    left: "13.8%",
  },
  {
    top: "202px",
    left: "10%",
    delay: ".5s",
  },
  {
    top: "224px",
    left: "18%",
    delay: "2s",
  },
];

const odds = [
  [
    9.1456, 7.3165, 5.8532, 4.6826, 3.7461, 2.9969, 2.3975, 1.918, 1.5344,
    1.2275,
  ],
  [
    162.405, 97.443, 58.466, 35.08, 21.048, 12.6286, 7.5772, 4.5463, 2.7278,
    1.6367,
  ],
  [
    9365.1, 3746.05, 1498.41, 599.37, 239.745, 95.898, 38.3595, 15.3437, 6.1375,
    2.455,
  ],
  [
    9589800, 1917960, 383595, 76719, 15343.7, 3068.76, 613.75, 122.75, 24.55,
    4.91,
  ],
];

const audio = new Audio();

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

  const [active, setActive] = useState(9);
  const [win, setWin] = useState(null);
  const [betAmount, setBetAmount] = useState<string>("1.0000");
  const [bombNum, setBombNum] = useState(2);
  const [payout, setPayout] = useState(0);
  const [resultShow, setResultShow] = useState<{
    payout: number;
    mul: number;
  } | null>(null);

  useEffect(() => {
    if (start) return;
    if (balance && balance < Number(betAmount)) {
      setBetAmount(balance.toFixed(4));
    }
  }, [balance]);

  const logined = useLogined();
  // 获取状态
  useSocketEmit<StateTower>({
    defaultParams: [EEmit.STATE, EGame.TOWER, {}],
    ready: logined,
    onSuccess: (res) => {
      console.log("获取游戏状态:", res);
      if (res.data.positions) {
        setStart(true);
        setBetAmount(res.data.money);
        setPayout(res.data.payout);
        setUserBombs(res.data.positions);
        setGameBombs(res.data.bombs);
        setActive(9 - res.data.positions.length);
        setBombNum(res.data.bombNum);
      }
    },
  });

  // 结算
  const { run: CashoutRun } = useSocketEmit<CashoutTower>({
    onSuccess: (r) => {
      console.log("结算返回:", r);
      if (r.code !== 200) return UxMessage.error("data error");
      setResultShow({ payout: r.data.payout, mul: r.data.multiplier });
      setStart(false);
      setPayout(0);
      setGameBombs(r.data.bombs);
      setUserBombs(r.data.positions);
      setTimeout(() => setResultShow(null), 3000);
    },
  });

  // 下注
  const { run: betRun } = useSocketEmit<BetTower>({
    onSuccess: (r) => {
      console.log("下注返回:", r);
      if (r.code !== 200) return UxMessage.error("data error");
      setStart(true);
    },
  });

  // Play
  const { runAsync: playRun } = useSocketEmit<PlayTower>();

  const betSubmit = () => {
    if (start) {
      // 结算
      CashoutRun(EEmit.CASHOUT, EGame.TOWER, {}); // settlement();
      return;
    }
    if (!balance)
      return UxMessage.warning("Insufficient balance, please recharge");
    // 初始化游戏
    setActive(9);
    setUserBombs([]);
    setGameBombs([]);

    if (Number(betAmount) > balance) {
      setBetAmount(balance.toFixed(4));
    } else if (Number(betAmount) < 0.0001) setBetAmount("0.0001");

    audio.src = "/tower/bet.mp3";
    audio.play();
    betRun(EEmit.BET, EGame.TOWER, {
      bet_amount: Number(betAmount),
      bomb: bombNum,
    });
  };

  // 结算金额弹窗展示
  useEffect(() => {
    // 播放音频
    if (!resultShow) return;
    audio.src =
      userBombs.length > 9 ? "/tower/stairs-win.mp3" : "/tower/win.mp3";
    audio.play();
  }, [resultShow]);

  const [userBombs, setUserBombs] = useState<any[]>([]);
  const [gameBombs, setGameBombs] = useState<any[]>([]);

  // 游戏点击格子
  const play = useCallback((index: number, i: number) => {
    audio.src = "/tower/click.mp3";
    audio.play();

    playRun(EEmit.PLAY, EGame.TOWER, {
      hit: 9 - index + 1,
      position: i + 1,
    }).then((r) => {
      console.log("点击格子返回：", r);
      if (r.code !== 200) return UxMessage.error("data error");
      setWin(r.data.win);
      setUserBombs(r.data.positions);
      setGameBombs(r.data.bombs);
      if (r.data.win) {
        setActive(index - 1);
        setPayout(r.data.payout);
        if (r.data.positions.length > 9)
          CashoutRun(EEmit.CASHOUT, EGame.TOWER, {}); // 通关结算
      } else {
        audio.src = "/tower/losing.mp3";
        audio.play();
        setStart(false);
        setPayout(0);
      }
    });
  }, []);

  return (
    <div className="relative flex justify-center mt-4 p-3 lg:px-20 rounded-xl w-full">
      <div className="w-full md:max-w-[650px]">
        {/* ---- 游戏背景 ---- */}
        <div className="relative bg-[url('/tower/bg-mobile.jpg')] sm:bg-[url('/tower/bg.webp')] bg-cover bg-no-repeat -ml-[16px] sm:ml-0 sm:p-[20px] px-[12px] py-[16px] sm:pl-[220px] rounded-xl w-[110%] sm:w-full">
          {windowArr.map((item, index) => (
            <img
              key={index}
              src="/tower/window-active.webp"
              className="hidden sm:block absolute animate-[show-window_ease_infinite] delay-1000"
              style={{
                top: item.top,
                left: item.left,
                filter: "blur(1px)",
                animationDuration: item.delay && "5s",
                animationDelay: item.delay,
              }}
            />
          ))}

          {/* ---- 游戏内容 ---- */}
          <div>
            {odds[bombNum - 1].map((item, index) => (
              <div
                key={index}
                className={clsx(
                  "relative flex items-center",
                  index < odds[bombNum - 1].length - 1 && "mb-2",
                  (start || gameBombs.length > 9) &&
                    active === index &&
                    "before:border-[#4c47be] before:border-2 before:rounded-md before:absolute before:-inset-1",
                  active === -1 &&
                    index === 0 &&
                    "before:border-[#ffb835]  before:border-2 before:rounded-md before:absolute before:-inset-1"
                )}
              >
                <div
                  className={clsx(
                    "flex justify-center items-center mr-0.5 sm:mr-1.5 rounded-sm w-[71px] min-w-[70px] h-[32px] font-[600] text-3xs leading-[16px]",
                    active === index
                      ? "bg-[#3a1f85] text-white"
                      : active < index
                      ? "bg-[#c92eff] text-white"
                      : "text-[#ffffff80] bg-[#4b2d9f]"
                  )}
                >
                  x{item}
                </div>
                {/* ---- 格子按钮 ---- */}
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className={clsx(
                      "relative flex justify-center items-center bg-[#4c47be] ml-2 rounded-sm w-full max-w-[20%] h-[32px] overflow-hidden font-[600] text-[#ffffff80] text-2xs leading-[16px]",
                      (start || win) &&
                        active === index &&
                        "active:scale-[.85] bg-[#c92eff] cursor-pointer hover:bg-[radial-gradient(40%_80%_at_50%_50%,#ff99f5_0,#c92eff)]",
                      userBombs[9 - index] === i + 1
                        ? gameBombs[9 - index].includes(userBombs[9 - index])
                          ? "bg-[radial-gradient(47.5%_95%_at_50%_50%,#ff8ea9_0,#da384e)]"
                          : "bg-[#c92eff]"
                        : "bg-[#4c47be]",
                      active === -1 &&
                        index === 0 &&
                        userBombs[9 - index] === i + 1 &&
                        "bg-[radial-gradient(50.83%_101.67%_at_50%_50%,#ffe608_0,#ffb636)]" // 已通关
                    )}
                    onClick={
                      active === index
                        ? () => {
                            if (!start) return;
                            play(index, i);
                          }
                        : undefined
                    }
                  >
                    {9 - index + 1 <= userBombs.length ||
                    gameBombs.length > 9 ? (
                      <>
                        {gameBombs[9 - index].includes(i + 1) ? (
                          <img
                            src="tower/devil.webp"
                            className="z-[2] w-[29px] h-[29px] animate-[animation-expectation-active_1s_ease-in-out_forwards]"
                          />
                        ) : (
                          <>
                            {userBombs[9 - index] === i + 1 && (
                              <img
                                src="tower/line-bg.webp"
                                className="z-[1] absolute opacity-50 animate-spin"
                                style={{
                                  animationDuration: "8s",
                                }}
                              />
                            )}
                            <img
                              src="tower/dude.webp"
                              className="z-[2] w-[29px] h-[29px] animate-[animation-expectation-active_1s_ease-in-out_forwards]"
                            />
                          </>
                        )}
                      </>
                    ) : (
                      <img
                        src="/tower/hide-card.webp"
                        className={clsx(
                          "w-[28px] h-[25px]",
                          start && active === index && "animate-spin"
                        )}
                        style={{
                          animationDuration: "3s",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
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
                      setBetAmount("0.0001");
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
                  if (v < 0.0001) return setBetAmount("0.0001");
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

        {/* 恶魔数量 */}
        <div className={clsx("mt-2", start && "pointer-events-none")}>
          <p className="text-[#55657e] text-[15px]">恶魔数量:</p>
          <div className="flex justify-between gap-2 mt-1 w-[100%] md:w-[50%] font-bold text-[16px]">
            {Array.from({ length: 4 }, (_, i) => (
              <button
                key={i}
                onClick={() => setBombNum(i + 1)}
                className={clsx(
                  "flex-1 py-2 border border-[#55657e47] rounded-md text-white",
                  bombNum === i + 1 ? "bg-[#2283f6]" : "bg-[#19212c]"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        {/* ----End---- */}

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
    </div>
  );
}
