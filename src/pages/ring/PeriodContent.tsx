import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import clsx from "clsx";
import { Input } from "@headlessui/react";
import { useAppConfig } from "@/appconfig";
import { UxMessage } from "../../../ui";
import { useSocketEmit } from "@/socket";
import { EEmit, EGame } from "@/socket/enums";
import { useLogined } from "@/events";
import { wait } from "@/utils/wait";
import { Description, Field, Label, Select } from "@headlessui/react";

const odds: Record<string, { mul: number; color: string; value: string }[]> = {
  low10: [
    { mul: 0.0, color: "#4f6da8", value: "blue" },
    { mul: 1.2, color: "#c8cfe2", value: "gray" },
    { mul: 1.5, color: "#1bdb3a", value: "green" },
  ],
  low20: [
    { mul: 0.0, color: "#4f6da8", value: "blue" },
    { mul: 1.2, color: "#c8cfe2", value: "gray" },
    { mul: 1.5, color: "#1bdb3a", value: "green" },
  ],
  low30: [
    { mul: 0.0, color: "#4f6da8", value: "blue" },
    { mul: 1.2, color: "#c8cfe2", value: "gray" },
    { mul: 1.5, color: "#1bdb3a", value: "green" },
  ],
  low40: [
    { mul: 0.0, color: "#4f6da8", value: "blue" },
    { mul: 1.2, color: "#c8cfe2", value: "gray" },
    { mul: 1.5, color: "#1bdb3a", value: "green" },
  ],
  low50: [
    { mul: 0.0, color: "#4f6da8", value: "blue" },
    { mul: 1.2, color: "#c8cfe2", value: "gray" },
    { mul: 1.5, color: "#1bdb3a", value: "green" },
  ],
  medium10: [
    { mul: 0.0, color: "#4f6da8", value: "blue" },
    { mul: 1.5, color: "#1bdb3a", value: "green" },
    { mul: 1.9, color: "#c8cfe2", value: "gray" },
    { mul: 2.0, color: "#ffda19", value: "yellow" },
    { mul: 3.0, color: "#c625ff", value: "purple" },
  ],
  medium20: [
    { mul: 0.0, color: "#4f6da8", value: "blue" },
    { mul: 1.5, color: "#1bdb3a", value: "green" },
    { mul: 1.8, color: "#c8cfe2", value: "gray" },
    { mul: 2.0, color: "#ffda19", value: "yellow" },
    { mul: 3.0, color: "#c625ff", value: "purple" },
  ],
  medium30: [
    { mul: 0.0, color: "#4f6da8", value: "blue" },
    { mul: 1.5, color: "#1bdb3a", value: "green" },
    { mul: 1.7, color: "#c8cfe2", value: "gray" },
    { mul: 2.0, color: "#ffda19", value: "yellow" },
    { mul: 3.0, color: "#c625ff", value: "purple" },
    { mul: 4.0, color: "#ff881b", value: "orange" },
  ],
  medium40: [
    { mul: 0.0, color: "#4f6da8", value: "blue" },
    { mul: 1.5, color: "#1bdb3a", value: "green" },
    { mul: 1.6, color: "#c8cfe2", value: "gray" },
    { mul: 2.0, color: "#ffda19", value: "yellow" },
    { mul: 3.0, color: "#c625ff", value: "purple" },
  ],
  medium50: [
    { mul: 0.0, color: "#4f6da8", value: "blue" },
    { mul: 1.5, color: "#1bdb3a", value: "green" },
    { mul: 2.0, color: "#ffda19", value: "yellow" },
    { mul: 3.0, color: "#c625ff", value: "purple" },
    { mul: 5.0, color: "#ed1d49", value: "red" },
  ],
  "medium-high10": [
    { mul: 0.0, color: "#4f6da8", value: "blue" },
    { mul: 2.45, color: "#ffda19", value: "yellow" },
    { mul: 5.0, color: "#c625ff", value: "purple" },
  ],
  "medium-high20": [
    { mul: 0.0, color: "#4f6da8", value: "blue" },
    { mul: 2.45, color: "#ffda19", value: "yellow" },
    { mul: 5.0, color: "#c625ff", value: "purple" },
  ],
  "medium-high30": [
    { mul: 0.0, color: "#4f6da8", value: "blue" },
    { mul: 1.38, color: "#1bdb3a", value: "green" },
    { mul: 10.02, color: "#ff881b", value: "orange" },
  ],
  "medium-high40": [
    { mul: 0.0, color: "#4f6da8", value: "blue" },
    { mul: 1.94, color: "#1bdb3a", value: "green" },
    { mul: 10.1, color: "#ff881b", value: "orange" },
  ],
  "medium-high50": [
    { mul: 0.0, color: "#4f6da8", value: "blue" },
    { mul: 2.46, color: "#ffda19", value: "yellow" },
    { mul: 15.06, color: "#ed1d49", value: "red" },
  ],
  high10: [
    { mul: 0.0, color: "#4f6da8", value: "blue" },
    { mul: 9.9, color: "#ed1d49", value: "red" },
  ],
  high20: [
    { mul: 0.0, color: "#4f6da8", value: "blue" },
    { mul: 19.8, color: "#ed1d49", value: "red" },
  ],
  high30: [
    { mul: 0.0, color: "#4f6da8", value: "blue" },
    { mul: 29.7, color: "#ed1d49", value: "red" },
  ],
  high40: [
    { mul: 0.0, color: "#4f6da8", value: "blue" },
    { mul: 39.6, color: "#ed1d49", value: "red" },
  ],
  high50: [
    { mul: 0.0, color: "#4f6da8", value: "blue" },
    { mul: 49.5, color: "#ed1d49", value: "red" },
  ],
};
const deg: Record<string, number> = {
  d10: 18,
  d20: 9,
  d30: 6,
  d40: 4.5,
  d50: 3.6,
};

const audio = new Audio();
const scrollAudio = new Audio("/ring/ring_scrol.mp3");
const winAudio = new Audio("/ring/ring_win.mp3");
const lossAudio = new Audio("/ring/ring_loss.mp3");
const bgmAudio = new Audio();
bgmAudio.src = "/ring/ring_bg.mp3";
bgmAudio.loop = true;
bgmAudio.play();

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

  const [betAmount, setBetAmount] = useState<string>("1.0000");
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const [rolePos, setRolePos] = useState(50); // 角色位置，初始在中间
  const [rollDeg, setRollDeg] = useState(0); // 转盘旋转角度
  const [init, setInit] = useState(true);
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

  // 熊猫输赢动作
  const rolePosChange = useCallback(async (win: boolean) => {
    if (win) {
      // 如果赢了，角色位置向右移动
      const arr = [37.47, 24.95, 12.41, -0.1, 12.41, 24.95, 37.47];
      for (let i = 0; i < arr.length; i++) {
        setRolePos(arr[i]);
        await wait(arr[i] < 0 ? 1000 : 100);
      }
    } else {
      // 如果输了，角色位置向左移动
      const arr = [63.82, 74.84, 86.94, 100.75, 86.94, 74.84, 63.82];
      for (let i = 0; i < arr.length; i++) {
        setRolePos(arr[i]);
        await wait(arr[i] > 100 ? 1000 : 100);
      }
    }
    setTimeout(
      () => setRolePos(50), // 重置角色位置
      1200
    );
  }, []);

  // 下注请求
  const { run: betRun } = useSocketEmit<BetRing>({
    onSuccess: async (r) => {
      console.log("下注返回:", r.data);
      setStart(false);
      scrollAudio.pause(); // 暂停滚动声音
      scrollAudio.currentTime = 0; // 将播放进度重置为开始
      scrollAudio.play().catch((e) => console.log("音频播放失败:", e)); // 重新播放

      if (r.code !== 200) return UxMessage.error("data error");
      const d = deg[`d${segments}`];
      setRollDeg(d + r.data.roll_number * d * 2 + 720);

      await wait(1000);
      rolePosChange(r.data.winAmount > 0);
      setShowAnimation(true);
      setResultShow({ payout: r.data.winAmount, mul: r.data.multiplier });
    },
  });

  // 下注
  const betSubmit = async () => {
    if (!balance)
      return UxMessage.warning("Insufficient balance, please recharge");

    // 初始化游戏
    setShowAnimation(false);

    if (Number(betAmount) > balance) {
      setBetAmount(balance.toFixed(4));
    } else if (Number(betAmount) < 0.0001) setBetAmount("0.0001");

    audio.src = "/ring/ring_bet.mp3";
    audio.play();
    await wait(500);
    if (init) setInit(false);

    setStart(true);

    setResultShow(null);
    betRun(EEmit.BET, EGame.RING, {
      amount: Number(betAmount),
      risk: risk, // 风险等级
      segments: segments, // 分段数
    });
  };

  // 播放结算音频
  useEffect(() => {
    if (start || !resultShow) return;
    if (resultShow.payout > 0) winAudio.play();
    else lossAudio.play();
  }, [resultShow]);

  // 风险等级选择
  const [risk, setRisk] = useState("medium");
  const [segments, setSegments] = useState(50);
  const currItem = useMemo(() => odds[`${risk}${segments}`], [risk, segments]); // 当前转盘

  const selectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setInit(true);
    setResultShow(null);
    if (isNaN(Number(value))) setRisk(value);
    else setSegments(Number(value));
  };

  return (
    <div className="relative flex justify-center mt-4 p-3 lg:px-20 rounded-xl w-full">
      <div className="w-full max-w-[650px]">
        {/* ---- 游戏背景 ---- */}
        <div className="relative rounded-xl w-full overflow-hidden">
          <div className="animate-[move-bg_5s_linear_infinite]">
            <picture>
              <source
                srcSet="/ring/ring_bg_sm.webp"
                media="(max-width: 460px)"
                width="672"
                height="644"
              />
              <img src="/ring/ring_bg_big.webp" width="1312" height="872" />
              <img
                src="/ring/ring_light_big.webp"
                className="top-0 absolute animate-[light-bg_2s_linear_infinite]"
              />
            </picture>
          </div>
          {/* ---- 转盘 ---- */}
          <div className="-bottom-[3%] sm:-bottom-[12%] left-[2%] absolute h-[100%] sm:h-[104%] aspect-square">
            <img
              src={`/ring/${risk}${segments}.png`}
              className="top-0 absolute animate-spin"
              width="460"
              height="460"
              style={{
                animationDuration: "60s",
                opacity: 1,
              }}
            />
            <img
              src={`/ring/${risk}${segments}.png`}
              className="top-0 absolute"
              width="460"
              height="460"
              style={{
                transform: start
                  ? `rotate(-${rollDeg % 360}deg)`
                  : `rotate(-${rollDeg}deg)`,
                transition: start
                  ? ""
                  : "transform 1s cubic-bezier(.19,-.11,.03,1.04)",
                opacity: !init ? 1 : 0,
              }}
            />

            {/* 上方剪头 */}
            <div
              className="left-[50%] absolute w-[27.3%]"
              style={{
                transform: "translate(-50%, -50%) scale(1)",
              }}
            >
              <img
                src="/ring/target.webp"
                className="top-2 left-[40%] absolut"
              />
              <img
                src={`/ring/st_${
                  currItem.find((item) => item.mul == resultShow?.mul)?.value ||
                  "red"
                }.webp`}
                className="top-0 absolute"
              />
            </div>
            {/* ---- 结算金额 ---- */}
            {start || !resultShow ? (
              <img
                src="/ring/rText.webp"
                className="absolute w-full h-full animate-[scaletext_2s_cubic-bezier(0,.28,1,.76)_infinite]"
                width="905"
                height="905"
              />
            ) : (
              <div
                className="top-[50%] left-[50%] absolute flex flex-col items-center bg-[#323e8e] p-1 rounded-2xl animate-[ring-result_0.3s_linear_1] justyfy-center"
                style={{
                  transform: "translate(-50%,-50%) scale(1)",
                }}
              >
                <div
                  className="bg-[#232d6d] py-2.5 rounded-2xl w-[151px] font-[900] text-[#ffda19] text-3xl text-center"
                  style={{
                    color:
                      currItem.find((item) => item.mul == resultShow.mul)
                        ?.color || "#ffffff", // Default color if undefined
                  }}
                >
                  {resultShow.mul}x
                </div>
                {resultShow.payout > 0 && (
                  <span className="font-bold text-white text-lg">
                    {SYMBOL}
                    {resultShow.payout.toFixed(2)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 动画角色  */}
          {showAnimation && !start && rolePos > 50 && (
            <img
              src="/ring/flash.webp"
              className="hidden sm:block top-[2%] absolute opacity-40 w-auto h-[25%]"
              style={{
                right: 0,
                transform: "scale(.4)",
                transformOrigin: "50% 100%",
                animation: "fx-flash 1.5s linear 1",
              }}
            />
          )}

          {showAnimation && rolePos < 50 && (
            <img
              src="/ring/stars.webp"
              className="hidden sm:block top-[2%] absolute opacity-40 w-auto h-[25%]"
              style={{
                right: 0,
                transform: "scale(.4)",
                transformOrigin: "50% 100%",
                animation: "fx-stars 1.5s linear 1",
              }}
            />
          )}
          <img
            src="/ring/left-wing.png"
            className="hidden sm:block top-[34%] right-[80px] absolute overflow-hidden"
            style={{
              animation: "char-tail 3s cubic-bezier(.6,.02,.35,.99) infinite",
            }}
            width="150"
          />
          <img
            src="/ring/right-wing.png"
            className="hidden sm:block top-[35.5%] -right-[32px] absolute overflow-hidden"
            style={{
              animation: "char-tail2 3s cubic-bezier(.6,.02,.35,.99) infinite",
            }}
            width="150"
          />
          <div
            className="hidden sm:block -right-[33%] -bottom-[15%] absolute bg-[url(/ring/char_atlas.png)] bg-cover bg-no-repeat w-[79%] h-[111%]"
            style={{
              backgroundPosition: `${rolePos}% 0`, // 动态设置角色位置实现动画
            }}
          />

          {/* 当前转盘倍数展示 */}
          <div
            className="bottom-0 left-0 absolute flex justify-center items-end gap-1.5 px-2 w-full h-[125px]"
            style={{
              background:
                "linear-gradient(180deg,#00255d00,#001855b8 54.12%,#000c4e)",
            }}
          >
            {currItem.map((item, index) => (
              <div
                key={index}
                className="flex justify-center items-center rounded-tl-md rounded-tr-md h-[35px] font-bold text-xs text-center"
                style={{
                  width:
                    currItem.length > 5
                      ? "14%"
                      : currItem.length < 4
                      ? "17%"
                      : "15%",
                  borderBottom: "5px solid " + item.color,
                  background:
                    resultShow?.mul === item.mul ? item.color : "#55657e",
                  color:
                    resultShow?.mul && resultShow?.mul === item.mul
                      ? "#0d131c"
                      : "#fff",
                }}
              >
                {item.mul.toFixed(2)}x
              </div>
            ))}
          </div>
        </div>

        {/* 风险 */}
        <div
          className={clsx(
            "flex gap-3 mt-5",
            (start || (!init && !resultShow)) &&
              "opacity-60 cursor-not-allowed disabled pointer-events-none"
          )}
        >
          <div className="flex-1">
            <p className="text-[#55657e] text-[15px] uppercase">Risk:</p>
            <div className="flex justify-between gap-2 mt-1 w-[100%] font-bold text-[16px] select">
              <select
                className="select-css"
                onChange={selectChange}
                value={risk}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="medium-high">High</option>
                <option value="high">Extreme</option>
              </select>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-[#55657e] text-[15px] uppercase">Segments:</p>
            <div className="mt-1 select">
              <select
                className="select-css"
                onChange={selectChange}
                value={segments}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>

        {/* ---- 下注按钮 ---- */}
        <div className="flex gap-3 mt-3">
          <div
            className={clsx(
              "flex-1 bg-[#19212c] border border-[#4b5b74] rounded-md font-[600] text-[#55657e] text-[12px] bet-btn",
              (start || (!init && !resultShow)) &&
                "opacity-60 cursor-not-allowed disabled"
            )}
          >
            <div className="flex justify-between p-2">
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
          </div>
          <button
            className="flex-1 bg-[#2283f6] disabled:bg-[#2283f6b0] border border-[#2283f6] disabled:border-[#2283f64d] rounded-md font-bold text-white"
            disabled={start || (!init && !resultShow)}
            onClick={betSubmit}
          >
            BET
          </button>
        </div>
        {/* ----下注按钮结束---- */}
      </div>
    </div>
  );
}
