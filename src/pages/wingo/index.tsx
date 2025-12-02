import { Fragment } from "react/jsx-runtime";
import {
  addUserGuess,
  getGuesses,
  getMyGuess,
  getMyGuessResult,
  getNextPeriodInfo,
} from "@/fetchers/win";
import { UxMessage } from "../../../ui";
import { useFetch } from "@/fetchers/fetch";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";
import { GameInfo } from "./GameInfo";
import { useAccountInfo, useOwnGames } from "@/fetchers";
import { useSearchParams } from "react-router-dom";
import clsx from "clsx";
import { getLocal, setLocal } from "@/utils/localStorage";
import { useTranslation } from "react-i18next";
import {
  WinGoBetHistoryData,
  WinGoGameCodeEnum,
  WinGoGameHistoryData,
  WinGoLatestResultData,
  WinGoOddsData,
} from "./types";
import { GamePicker } from "./GamePicker";
import { GameHistory } from "./GameHistory";
import { TrendChart } from "./TrendChart";
import { BetHistory } from "./BetHistory";
import { GameBet } from "./GameBet";
import { DialogGuessRule } from "./DialogGuessRule";
import { DialogWinOrLose } from "./DialogWinOrLose";
import { DialogPresaleRule } from "./DialogPresaleRule";
import { el, fr } from "date-fns/locale";
import { useCountDown } from "ahooks";
import { use } from "i18next";
import { useAppConfig } from "@/appconfig";
import { initParams } from "@/initparams";

const multiples = [1, 5, 10, 20, 50, 100];
// let countdownTimer: number | null = null;

export default function WinGo() {
  const pageSize = 10;
  const { t } = useTranslation();
  const { run: accountInfoRun, data: accountData } = useAccountInfo();
  const { run: ownGamesRun, data: ownGamesData } = useOwnGames();
  useEffect(() => {
    console.log("accountData", accountData);
  }, []);

  const { type } = initParams;
  const [gameCode, setGameCode] = useState(type as WinGoGameCodeEnum);

  const [opening, setOpening] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [mute, setMute] = useState(!!getLocal("wingo1Mute"));
  const [multiple, setMultiple] = useState(multiples[0]);
  const [historyType, setHistoryType] = useState(0);
  const [pick, setPick] = useState<WinGoOddsData>();
  const [openBet, setOpenBet] = useState(false);
  const [openPresaleRule, setOpenPresaleRule] = useState(false);
  const [openGuessRule, setOpenGuessRule] = useState(false);
  const [openWinOrLose, setOpenWinOrLose] = useState(false);
  const [userProfit, setUserProfit] = useState(0);
  const [drawResult, setDrawResult] = useState<WinGoLatestResultData>();
  const [openedWinOrLose, setOpenedWinOrLose] = useState(
    {} as Record<WinGoGameCodeEnum, string>
  );
  const { SYMBOL } = useAppConfig();
  const audioDi1Ref = useRef<HTMLAudioElement>(null);
  const audioDi2Ref = useRef<HTMLAudioElement>(null);
  /**
   * 开奖历史记录
   */
  const [gameHistoryPageIndex, setGameHistoryPageIndex] = useState(1);
  const [gameHistoryPage, setGameHistoryPage] = useState(1);
  const [gameHistoryIsEnd, setGameHistoryIsEnd] = useState(false);
  const [gameHistoryData, setGameHistoryData] = useState<
    WinGoGameHistoryData[]
  >([]);
  const _minType = useMemo(() => {
    switch (gameCode) {
      case WinGoGameCodeEnum.ONE:
        return 1;
      case WinGoGameCodeEnum.THREE:
        return 3;
      case WinGoGameCodeEnum.FIVE:
        return 5;
      default:
        return 1;
    }
  }, [gameCode]);

  // 最新一期开奖结果
  const { runAsync: nextPeriodInfoDataRun, data: NextPeriodInfoData } =
    useFetch(
      () =>
        getNextPeriodInfo({
          min_type: _minType,
        }),
      { refreshDeps: [_minType] }
    );
  //开奖弹窗用，显示用户本期投注输赢明细
  const { runAsync: myGuessResultRun, data: myGuessResultData } = useFetch(
    () =>
      getMyGuessResult({
        min_type: _minType,
        period: NextPeriodInfoData ? NextPeriodInfoData.next_period : "0",
      }),
    { refreshDeps: [_minType] }
  );
  useEffect(() => {
    if (myGuessResultData && myGuessResultData.queryset.length > 0) {
      //if (myGuessResultData) {
      let profit = 0;
      myGuessResultData.queryset.map((item) => {
        profit = profit + Number(item.amount);
      });
      setUserProfit(profit);
      setOpenWinOrLose(true);
      setDrawResult(
        (prevResult) =>
          ({
            ...prevResult, // 保留其他属性
            DropDate: myGuessResultData.queryset[0].period + "",
          } as WinGoLatestResultData)
      );
      // setOpenedWinOrLose({
      //   [WinGoGameCodeEnum.THREE]: myGuessResultData.win_lose_info,
      // });
    }
  }, [myGuessResultData]);
  // const [seconds, setSeconds] = useState<number>(0);
  const [targetDate, setTargetDate] = useState<number>();
  const [countdown] = useCountDown({
    targetDate,
    onEnd: () => {
      // alert('End of the time');
    },
  });
  const countdownCal = useMemo(() => {
    if (countdown) {
      return Math.round(countdown / 1000);
    }
    return 0;
  }, [countdown]);
  useEffect(() => {
    setTargetDate(Date.now() + 45000);
  }, []);

  useEffect(() => {
    if (NextPeriodInfoData) {
      if (NextPeriodInfoData.count_down_sec > 10) {
        setDrawing(false);
        setOpening(false);
        setDrawResult(
          (prevResult) =>
            ({
              ...prevResult, // 保留其他属性
              num1: NextPeriodInfoData.latest_open_numbers[0] + "",
              num2: NextPeriodInfoData.latest_open_numbers[1] + "",
              num3: NextPeriodInfoData.latest_open_numbers[2] + "",
              num4: NextPeriodInfoData.latest_open_numbers[3] + "",
              num5: NextPeriodInfoData.latest_open_numbers[4] + "",
            } as WinGoLatestResultData)
        );
        myGuessRun();
      }
    }
  }, [NextPeriodInfoData]);

  useEffect(() => {
    if (typeof countdownCal !== "number") return;
    if (countdownCal === 10) {
      if (!mute) {
        audioDi1Ref.current?.play();
      }
      setOpenBet(false);
      setOpening(false);
      setDrawing(true);
    } else if (countdownCal === 0) {
      if (!mute) {
        audioDi1Ref.current?.play();
      }
      //stopCountdown();
      myGuessResultRun();
      nextPeriodInfoDataRun();
    } else if (countdownCal < 10) {
      if (!mute) {
        audioDi1Ref.current?.play();
      }
    }
  }, [countdownCal, _minType]);

  const [openInfo, setOpenInfo] = useState({
    GameType: "ffssc",
    DropDate: "20241112-0966",
    IsOpen: true,
    CloseTime: "2024-11-12 16:06:00",
    CloseSecond: 50,
    BetDropDate: "0966",
    GameIcon: "ffssc.png",
  });
  useEffect(() => {
    if (NextPeriodInfoData) {
      setOpenInfo({
        GameType: "ffssc",
        DropDate: NextPeriodInfoData.next_period,
        IsOpen: true,
        CloseTime: "2024-11-12 16:06:00",
        CloseSecond: NextPeriodInfoData.count_down_sec,
        BetDropDate: "0966",
        GameIcon: "ffssc.png",
      });
      if (NextPeriodInfoData.count_down_sec > 10) {
        setDrawing(true);
        setOpening(true);
      }
      // setSeconds(NextPeriodInfoData.count_down_sec);
      setTargetDate(Date.now() + NextPeriodInfoData.count_down_sec * 1000);
    }
  }, [NextPeriodInfoData]);

  /**
   * 开奖历史记录(走势图)
   */
  const [trendChartPageIndex, setTrendChartPageIndex] = useState(1);
  const [trendChartPage, setTrendChartPage] = useState(1);
  const [trendChartIsEnd, setTrendChartIsEnd] = useState(false);
  const [trendChartData, setTrendChartData] = useState<WinGoGameHistoryData[]>(
    []
  );

  const { data: guessesData } = useFetch(
    () =>
      getGuesses({
        p: gameHistoryPageIndex,
        p_size: pageSize,
        category: "P",
        min_type: _minType,
      }),
    {
      refreshDeps: [gameHistoryPageIndex, _minType, NextPeriodInfoData],
    }
  );
  // useEffect(() => {
  //   console.log("gameHistoryPageIndex", gameHistoryPageIndex);
  //   guessesRun();
  // }, [gameHistoryPageIndex,gameCode]);
  //历史
  useEffect(() => {
    if (guessesData) {
      const formattedData = guessesData.queryset.map((item) => {
        return {
          lotteryType: WinGoGameCodeEnum.THREE, // 假设 item 中含有 lotteryType 字段
          stage: item.period, // 假设 item 中含有 stage 字段
          formatStage: null, // 根据需要设置格式化后的阶段
          result: item.last_num + "", // 假设 item 中含有 result 字段
          sxResult: item.last_num + "", // 假设 item 中含有 sxResult 字段
          openDate: item.create_time, // 假设 item 中含有 openDate 字段
          drop_time: null, // 根据需要设置 drop_time
        } as WinGoGameHistoryData; // 强制转换为 WinGoGameHistoryData 类型
      });
      setTrendChartData(formattedData);
      setGameHistoryData(formattedData);
      setGameHistoryPage(guessesData.page.num_pages);
      setGameHistoryIsEnd(formattedData.length < pageSize);
    }
  }, [guessesData]);

  /**
   * 下注历史记录
   */
  const [betHistoryPageIndex, setBetHistoryPageIndex] = useState(1);
  const [betHistoryPage, setBetHistoryPage] = useState(1);
  const [betHistoryIsEnd, setBetHistoryIsEnd] = useState(false);
  const [betHistoryData, setBetHistoryData] = useState<WinGoBetHistoryData[]>(
    []
  );
  const [lastBetTime, setLastBetTime] = useState<number>();
  const { data: myGuessData, run: myGuessRun } = useFetch(
    () =>
      getMyGuess({
        p: betHistoryPageIndex,
        p_size: pageSize,
        category: "P",
        min_type: _minType,
      } as IMyGuess),
    {
      refreshDeps: [betHistoryPageIndex, _minType, lastBetTime],
    }
  );
  useEffect(() => {
    if (myGuessData) {
      const formattedData = myGuessData.queryset.map((item, index) => {
        const content =
          item.type === "G"
            ? "green"
            : item.type === "R"
            ? "red"
            : item.type === "V"
            ? "violet"
            : item.type === "B"
            ? "大"
            : item.type === "S"
            ? "小"
            : item.type === "N"
            ? item.number
            : item.type;
        const _status =
          item.status === "S"
            ? "已中奖"
            : item.status === "F"
            ? "未中奖"
            : "待开将";
        if (item.period == 202412090793) {
          console.log("开奖号码", item.result);
        }

        return {
          drop_time: item.create_time,
          drop_content: content,
          drop_money: item.contract_money ? Number(item.contract_money) : 0,
          drop_type: "第五球",
          num_id: "00000000" + index,
          ID: 0,
          fee: item.fee,
          // max_agent: null,
          // drop_max_agent_cut: null,
          // drop_date: "",
          // open_date: "",
          // drop_tm: null,
          drop_rate: "",
          // drop_cut: 0,
          // drop_plate: "",
          // cut_sign: null,
          drop_details: null,
          sign: null,
          num_sign: null,
          status: _status,
          lotteryType: "",
          stage: item.period + "",
          amount: item.amount,
          num1: item.result, //开奖结果
        } as WinGoBetHistoryData; // 强制转换为 WinGoGameHistoryData 类型
      });
      setBetHistoryData(formattedData);
      console.log("betHistoryData", betHistoryData);
    }
  }, [myGuessData]);
  /**
   * 选择下注内容
   */
  const wingoInfo = useMemo(() => {
    if (ownGamesData && ownGamesData.queryset.length > 0) {
      const it = ownGamesData.queryset.filter((item) => item.type === "WINGO");
      return it[0];
    } else return undefined;
  }, [ownGamesData]);
  const onPick = (pick: WinGoOddsData) => {
    if (wingoInfo) {
      const _pick = { ...pick, low_limit: wingoInfo.min_bet };

      setPick(_pick);
      // console.log("_pick", _pick);
      // console.log("pick", pick);
    } else {
      setPick(pick);
      // console.log("pick", pick);
    }

    setOpenBet(true);
  };
  /**
   * 提交注单
   */

  const onConfirm = async (amount: number) => {
    if (!pick) return;
    let tp3Number = Number(pick.tp3);
    // 检查 tp3Number 是否为 NaN
    if (isNaN(tp3Number)) {
      tp3Number = -1;
    }

    const guessType = tp3Number !== -1 ? "N" : pick.tp3;
    const response = await addUserGuess({
      category: "P",
      contract_count: 1,
      contract_money: amount,
      guess_type: guessType,
      number: tp3Number,
      period: NextPeriodInfoData ? NextPeriodInfoData.next_period : 0,
      min_type: _minType,
    } as IAddUserGuess);
    if (response.code == 200) {
      UxMessage.success(t`wingo1_successful_bet`);
      accountInfoRun();
      setOpenBet(false);
      setLastBetTime(Date.now());
      return;
    } else {
      UxMessage.error(response.msg);
      return;
    }
  };
  console.log(Object.values(WinGoGameCodeEnum));
  return (
    <Fragment>
      <div className="relative w-full h-full">
        <div className="h-full overflow-auto scrollbar">
          <div className="bg-back-100 mx-auto px-2 py-4 lg:max-w-[480px] max-lg:max-w-[540px] min-h-full">
            <div className="relative flex items-center text-white">
              <div className="top-0 right-0 bottom-0 left-0 absolute -mx-2 -mt-4 -mb-12 rounded-b-3xl"></div>
              <h2 className="relative mr-auto ml-2 font-bold text-base">
                WinGo
              </h2>
              <span className="relative ml-4 font-medium text-sm">
                {accountData
                  ? (
                      accountData.balance + accountData.rescue_values[0]?.value
                    ).toFixed(3)
                  : 0}
              </span>
              <button
                className="relative mr-2 ml-4"
                onClick={() => {
                  setLocal("wingo1Mute", !mute);
                  setMute(!!getLocal("wingo1Mute"));
                }}
              >
                {/* <SpeakerXMarkIcon className="w-6 h-6" /> */}
                {mute ? (
                  <SpeakerXMarkIcon className="2xs:w-8 max-2xs:w-6 2xs:h-8 max-2xs:h-6" />
                ) : (
                  <SpeakerWaveIcon className="2xs:w-8 max-2xs:w-6 2xs:h-8 max-2xs:h-6" />
                )}
              </button>
              <div className="hidden">
                <audio
                  ref={audioDi1Ref}
                  preload="auto"
                  src="/wingo/audio/di1.mp3"
                ></audio>
                <audio
                  ref={audioDi2Ref}
                  preload="auto"
                  src="/wingo/audio/di2.mp3"
                ></audio>
              </div>
            </div>

            <div className="relative flex bg-base-900 mt-4 rounded-xl">
              {Object.values(WinGoGameCodeEnum).map((item) => (
                <span
                  key={item}
                  className={clsx(
                    "flex justify-center items-center px-1 py-4 rounded-lg w-1/3 font-semibold text-xs cursor-pointer",
                    item === gameCode
                      ? "text-white shadow-[inset_0_0_8px_#fd565c] bg-gradient-to-b from-[#fd565c] to-[#fd565c]/50"
                      : "text-base-400"
                  )}
                  onClick={() => {
                    setGameCode(item);
                    setGameHistoryPageIndex(1);
                    setBetHistoryPageIndex(1);
                    setTrendChartPageIndex(1);
                  }}
                >
                  {t(`wingo1_${item}`)}
                </span>
              ))}
            </div>

            <GameInfo
              openInfo={openInfo}
              seconds={countdownCal}
              drawing={false}
              drawResult={drawResult}
              gameCode={gameCode}
              onOpenRule={() => setOpenGuessRule(true)}
            />

            <GamePicker
              opening={opening}
              seconds={countdownCal}
              multiples={multiples}
              multiple={multiple}
              setMultiple={setMultiple}
              onPick={onPick}
            />

            <ul className="flex gap-1.5 mt-4 h-8">
              {[
                t`wingo1_game_history`,
                t`wingo1_chart`,
                t`wingo1_my_history`,
              ].map((item, index) => (
                <li
                  key={index}
                  className={clsx(
                    "flex justify-center items-center rounded-lg font-semibold text-2xs cursor-pointer grow",
                    historyType === index
                      ? "text-white bg-gradient-to-b from-[#ff7777] to-[#f74d4d]"
                      : "text-base-200 bg-base-600"
                  )}
                  onClick={() => setHistoryType(index)}
                >
                  {item}
                </li>
              ))}
            </ul>
            <GameHistory
              show={historyType === 0}
              page={gameHistoryPageIndex}
              isEnd={gameHistoryIsEnd}
              data={gameHistoryData}
              onChange={setGameHistoryPageIndex}
            />
            <TrendChart
              show={historyType === 1}
              page={trendChartPage}
              isEnd={trendChartIsEnd}
              data={trendChartData}
              onChange={setTrendChartPageIndex}
            />
            <BetHistory
              show={historyType === 2}
              page={betHistoryPage}
              isEnd={betHistoryIsEnd}
              data={betHistoryData}
              onChange={setBetHistoryPageIndex}
            />

            <GameBet
              amountOptions={[1, 10, 100, 500, 1000]}
              open={openBet}
              gameCode={gameCode}
              pick={pick}
              multiples={multiples}
              multiple={multiple}
              setMultiple={setMultiple}
              onCancel={() => setOpenBet(false)}
              onConfirm={onConfirm}
              onOpenRule={() => setOpenPresaleRule(true)}
              onClosed={() => setPick(undefined)}
            />

            <DialogWinOrLose
              open={openWinOrLose}
              drawResult={drawResult}
              userProfit={userProfit}
              currencySymbol={SYMBOL}
              onClose={() => setOpenWinOrLose(false)}
            />

            <DialogGuessRule
              gameCode={gameCode}
              open={openGuessRule}
              onClose={() => setOpenGuessRule(false)}
            />

            <DialogPresaleRule
              open={openPresaleRule}
              onClose={() => setOpenPresaleRule(false)}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
