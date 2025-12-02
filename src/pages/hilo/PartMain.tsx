import clsx from "clsx";
import { useSocketEmit } from "@/socket";
import { EEmit, EGame } from "@/socket/enums";
import { useMemo, useState } from "react";
import { UxMessage } from "../../../ui";
import { useAppConfig } from "@/appconfig";
import { Input } from "@headlessui/react";
import { tr } from "date-fns/locale";
import HistoryPage from "./HistoryPage";
import { use } from "i18next";

function design2String(design: number): string {
  switch (design) {
    case 0:
      return "♠"; // 黑桃
    case 1:
      return "♥"; // 红桃
    case 2:
      return "♣"; // 梅花
    default:
      return "♦"; // 方块
  }
}
function design2Pic(design: number): string {
  switch (design) {
    case 0:
      return "card-back_spades"; // 黑桃
    case 1:
      return "card-back_hearts"; // 红桃
    case 2:
      return "card-back_clubs"; // 梅花
    default:
      return "card-back_diamonds"; // 方块
  }
}
function design2Pic2(design: number): string {
  switch (design) {
    case 0:
      return "spades"; // 黑桃
    case 1:
      return "hearts"; // 红桃
    case 2:
      return "clubs"; // 梅花
    default:
      return "diamonds"; // 方块
  }
}
function num2Card(num: number): string {
  if (num === 1) return "A";
  if (num <= 10) return num.toString();
  switch (num) {
    case 11:
      return "J"; // 黑桃
    case 12:
      return "Q"; // 红桃
    default:
      return "K"; // 方块
  }
}

function generateRandomCard() {
  const suits = ["♠", "♥", "♦", "♣"];
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const id = Math.floor(Math.random() * 13) + 1; // 1~13
  return { id, flipped: false, removed: false, suit };
}

export default function PartMain({ balance }: { balance: number }) {
  const [start, setStart] = useState(false); // 是否开始游戏
  const { SYMBOL } = useAppConfig();
  const [payout, setPayout] = useState(0);
  const [betAmount, setBetAmount] = useState<string>("1.0000");
  const [isLost, setIsLost]=useState(false);//是否输了,新的一轮开始时会置为false
  const [removeIndex, setRemoveIndex] = useState(0);
  const [isResultShow, setIsResultShow] = useState(false);
  const [resultShow, setResultShow] = useState<{
    payout: number;
    mul: number;
  } | null>(null);
  const [resulCards, setResulCards] = useState<CardInfo[]>([]);
  const [skipCount, setSkipCount] = useState(20); //还有多少张能跳过
  const [hightText1, setHightText1] = useState("");
  const [hightText2, setHightText2] = useState("");
  const [lowerText1, setLowerText1] = useState("");
  const [lowerText2, setLowerText2] = useState("");
  const [actionNameHight, setActionNameHight] = useState("");
  const [actionNameLower, setActionNameLower] = useState("");
  //子组件需要
  const [initialCards, setInitialCards] = useState<CardDetail[]>([]);

  function pushCard(card: CardInfo) {
    setInitialCards((prevCards) => [
      {
        id: card.num,
        flipped: false,
        removed: false,
        suit: design2String(card.design),
      },
      ...prevCards,
    ]);
  }
  const [cards, setCards] = useState([
    { id: 1, flipped: false, removed: false, suit: "" },
  ]);

  // 找到第一张未移出的牌
  const getFirstIndex = (
    arr: typeof cards,
    predicate: (c: (typeof cards)[0]) => boolean
  ) => {
    for (let i = 0; i < arr.length; i++) {
      if (predicate(arr[i])) return i;
    }
    return -1;
  };
  // 当前最前面的未移出的牌
  const topIndex = useMemo(() => {
    return getFirstIndex(cards, (c) => !c.removed);
  }, [cards]);

  // const handleClick = () => {
  //   // fanPaiHandeler();
  // };

  //翻拍
  function fanPaiHandeler(_card: any) {
    setCards((prev) => {
      const newCards = [...prev];
      if ([...prev].length === 1) {
        newCards[0].id = _card.num;
        newCards[0].suit = _card.design; //design2Pic2(_card.design);
      }

      console.log("newCards", JSON.stringify(newCards));
      // 1️⃣ 顶牌没翻开 → 翻开
      if (topIndex !== -1 && !newCards[topIndex].flipped) {
        newCards[topIndex].flipped = true;
        return newCards;
      }

      // 2️⃣ 顶牌翻开 → 移出它
      if (topIndex !== -1) {
        newCards[topIndex].removed = true;
      }

      // 3️⃣ 永远可以发一张新的牌（直接翻开）
      newCards.push({
        ...{
          id: _card.num,
          flipped: false,
          removed: false,
          suit: _card.design, //design2Pic2(),
        },
        flipped: true,
      });

      return newCards;
    });
  }
  // 点击高低按钮
  //   const playHandeler = async (actionName: string) => {
  //   await playRunAsync(EEmit.PLAY, EGame.HILO, {
  //     actionName,
  //   }, {
  //     onSuccess(r) {
  //       // 这里能访问到 actionName，因为闭包作用域
  //       console.log("actionName:", actionName);

  //       fanPaiHandeler(r.data.card);
  //       setResulCards(r.data.cards);
  //       if (r.code !== 200) return UxMessage.error("data error");
  //       pushCard(r.data.card);
  //       if (r.data.win) {
  //         setPayout(r.data.payout);
  //       } else {
  //         console.log("失败2");
  //         setStart(false);
  //         setPayout(0);
  //         setInitialCards([]);
  //       }
  //     },
  //   });
  // };
  const playHandeler = async (actionName: string) => {
    await playRunAsync(EEmit.PLAY, EGame.HILO, {
      actionName: actionName,
    });
  };
  const setInfo = (r: any) => {
    setSkipCount(r.data.skip);
    setHightText1(r.data.card.actions[0].rate);
    setHightText2(r.data.card.actions[0].multiplier.toFixed(4));

    setLowerText1(r.data.card.actions[1].rate);
    setLowerText2(r.data.card.actions[1].multiplier.toFixed(4));
    fanPaiHandeler(r.data.card);
    setResulCards(r.data.cards);
    setActionNameHight(r.data.card.actions[0].name);
    setActionNameLower(r.data.card.actions[1].name);

  };
  const { runAsync: playRunAsync } = useSocketEmit<PlayHilo>({
    onSuccess(r, params) {
      console.log("11111111", r, params[2].actionName);
      setInfo(r);

      if (r.code !== 200) return UxMessage.error("data error");
      pushCard(r.data.card);
      if (r.data.win) {
        setPayout(r.data.payout);
      } else {
        console.log("失败2");
        setStart(false);
        setIsLost(true);
        setPayout(0);
        setInitialCards([]);
        // setTimeout(() => {
        // manDie();}, 700); // 小人死亡
      }
    },
  });
  // 下注
  const { run: betRun } = useSocketEmit<BetHilo>({
    onSuccess: (r) => {
      console.log("下注返回", JSON.stringify(r, null, 2));
      setInfo(r);
      if (r.code !== 200) return UxMessage.error("data error");
      pushCard(r.data.card);
      setStart(true);
    },
  });
  const betSubmit = () => {
    if (start) {
      CashoutRun(EEmit.CASHOUT, EGame.HILO, {}); // 结算
      return;
    }
    setIsLost(false);
    betRun(EEmit.BET, EGame.HILO, {
      bet_amount: Number(betAmount),
      // bomb: stoneCount,
    });
  };
  const { run: CashoutRun } = useSocketEmit<CashoutHilo>({
    onSuccess: (r) => {
      console.log("结算返回:", r);
      setIsResultShow(true);
      setTimeout(() => {
        setIsResultShow(false);
      }, 1000);
      setResultShow({ payout: r.data.payout, mul: r.data.multiplier });
      setStart(false);
      setPayout(0);
      setInitialCards([]);
      setTimeout(() => setResultShow(null), 3000);
    },
  });
  // 判断花色是否为红色
  const isRedSuit = (suit: string) => suit === "♥" || suit === "♦";
  const isRedSuit2 = (suit: string) => suit === "♥" || suit === "♦";
  return (
    <>
      <div className="flex justify-between items-center px-4 hilo__center">
        {/* 左 */}
        <div className="deck">
          <button
            className="deck__btn-skip"
            disabled={start ? false : true}
            onClick={() => {
              playHandeler("skip");
            }}
          >
            <span className="ins-btn-skip">
              <span className="">Skip</span>({skipCount})
            </span>
            <svg viewBox="0 0 117 36" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.43 7.48A10 10 0 0115.11 0h86.78a10 10 0 019.68 7.48l4.17 16A10 10 0 01106.06 36H10.94a10 10 0 01-9.68-12.52l4.17-16z"></path>
            </svg>
          </button>
          <div className="deck__inner mounted">
            <div className="table">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className={`card 
            ${card.flipped ? "flipped" : ""} 
            ${card.removed ? "removed" : ""}
            `}
                  style={{ zIndex: index }}
                >
                  <div
                    className={`card-inner ${
                      isLost
                        ? "border-[5px] border-solid border-[#f00] rounded-[12px]"
                        : ""
                    } `}
                  >
                    <div
                      className="card-front"
                      style={{
                        color:
                          card.suit == "1" || card.suit == "3"
                            ? "red"
                            : "black",
                      }}
                    >
                      <span className="card-number">{num2Card(card.id)}</span>
                      <span className="card-suit">
                        <img
                          src={`/hilo/${design2Pic2(Number(card.suit))}.svg`}
                        ></img>
                      </span>
                    </div>
                    <div className="card-back"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 右 */}
        <div className="small-buttons">
          <button
            className="flex justify-center items-center btn_mobile up inactive"
            disabled={start ? false : true}
            onClick={() => {
              playHandeler("higher");
            }}
          >
            {start ? (
              <div className="-top-[0.8rem] z-40 absolute btn_mobile__inner">
                <span>
                  {actionNameHight} <br />
                  {hightText1}
                </span>
                <br />
                <span>
                  <svg className="icon icon_arrow">
                    <use xlinkHref="/hilo/svg-sprite.svg#hilo-icon-arrow-up"></use>
                  </svg>
                  {hightText2}x
                </span>
              </div>
            ) : (
              <div className="bottom-2 z-20 absolute">
                <span>Higher or equal</span>
              </div>
            )}
            <svg className="bg-mobile">
              <use xlinkHref="/hilo/svg-sprite.svg#hilo-btn-up"></use>
            </svg>
          </button>
          <button
            className="flex justify-center items-center btn_mobile down inactive"
            disabled={start ? false : true}
            onClick={() => {
              playHandeler("lower");
            }}
          >
            {start ? (
              <div className="top-[0.1rem] z-40 absolute btn_mobile__inner">
                <span>
                  {lowerText1}
                  <br />
                  {actionNameLower}
                </span>
                <span>
                  <svg className="icon icon_arrow">
                    <use xlinkHref="/hilo/svg-sprite.svg#hilo-icon-arrow-down"></use>
                  </svg>
                  {lowerText2}x
                </span>
              </div>
            ) : (
              <div className="top-[0.625rem] z-20 absolute">
                <span>Lower or equal</span>
              </div>
            )}

            <svg className="z-10 bg-mobile">
              <use xlinkHref="/hilo/svg-sprite.svg#hilo-btn-down"></use>
            </svg>
          </button>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
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
      {/* PartCards */}
      <div className="mt-4 cards small">
        <div className="cards__outer">
          <div className="cards__inner">
            {resulCards.length === 0 && (
              <div className="card isFlipped card_type-0 animation">
                <div className="card-inner card-empty">
                  <div className="card-back card-back_spades card-back_small">
                    <span>8</span>
                  </div>
                </div>
              </div>
            )}
            {resulCards.length > 0 &&
              resulCards.map((card, index) => (
                <div
                  key={index}
                  className="card isFlipped card_type-0 animation"
                >
                  {index > 0 && (
                    <i
                      className={`icon icon_${
                        resulCards[index - 1].type == "skip"
                          ? "3"
                          : resulCards[index - 1].num > card.num
                          ? "2"
                          : "1"
                      } animation`}
                    ></i>
                  )}
                  <div className="card-inner">
                    <div
                      className={
                        `card-back  card-back_small ` + design2Pic(card.design)
                      }
                      style={{
                        color: isRedSuit(design2String(card.design))
                          ? "red"
                          : "black",
                      }}
                    >
                      <span>{num2Card(card.num)}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      {/* <div>
        <button
          className="bg-blue-900 mt-4 px-4 py-2 border-2 border-white border-solid rounded-md text-white"
          onClick={() => {
            setIsResultShow(!isResultShow);
          }}
        >
          aaaa
        </button>
      </div> */}
      <div
        className={`text-[#fff] result ${isResultShow ? "result--show" : ""}`}
      >
        <p className="result__coeficient">{resultShow?.mul.toFixed(4)}x</p>
        <span className="currency">
          {SYMBOL} {resultShow?.payout}
        </span>
      </div>

      <HistoryPage />
    </>
  );
}
