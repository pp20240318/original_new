import { Fragment } from "react/jsx-runtime";
import Head from "../components/Head/Head";
import { GameCodeSelection } from "../components/GameCodeSelection/GameCodeSelection";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Period from "./Period";
import K3Dice from "./K3Dice/K3Dice";
import K3Picker from "./K3Picker/K3Picker";
import { K3GameBet } from "./K3GameBet";
import {
  K3BetType,
  K3GameCodeEnum,
  K3GameHistoryData,
  K3Gameplay,
  K3OddsData,
} from "./types";
import { K3GameHistory } from "./K3GameHistory";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { useCountDown, useRequest } from "ahooks";
import { useFetch } from "@/fetchers/fetch";
import {
  getCurrentThreeKingData,
  getThreeKingHistory,
  myThreeKingHistory,
  threeKingBet,
  getCurrentThreeKingResult,
} from "@/fetchers/k3";
import { K3GameHistoryB } from "./K3GameHistoryB";
import { UxMessage } from "../../../ui";
import { K3BetHistoryPage } from "./K3BetHistoryPage/K3BetHistoryPage";
import { use } from "i18next";
import { getLocal } from "@/utils/localStorage";
import Header from "../components/Header";
import IconRacingActiveTime from "../../assets/racing_active_time.png";
import IconRacingTime from "../../assets/racing_time.png";
import ViewModal from "@/components/ViewModal";
import { K3DialogWinOrLose } from "./K3DialogWinOrLose";
import { tr } from "date-fns/locale";
import BalanceBox from "@/components/BalanceBox";
import { useAppConfig } from "@/appconfig";
import { initParams } from "@/initparams";

const multiples = [1, 5, 10, 20, 50, 100];
export default function K3Page() {
  const pageSize = 10;
  const { SYMBOL } = useAppConfig();
  const { t } = useTranslation();
  const audioDi1Ref = useRef<HTMLAudioElement>(null);
  const audioDi2Ref = useRef<HTMLAudioElement>(null);
  const [openBet, setOpenBet] = useState(false);
  const [mute, setMute] = useState(!!getLocal("wingo1Mute"));
  const [pick, setPick] = useState<K3OddsData>();
  const [drawing, setDrawing] = useState(false);
  const [multiple, setMultiple] = useState(multiples[0]);
  const [openPresaleRule, setOpenPresaleRule] = useState(false);
  const { type } = initParams;
  const [historyType, setHistoryType] = useState(0);
  const [opening, setOpening] = useState(false);
  const [openHowToPlay, setOpenHowToPlay] = useState(false);
  const [trendChartData, setTrendChartData] = useState<ThreeKingHistoryItem[]>(
    []
  );
  const [targetDate, setTargetDate] = useState<number>();
  const [value, setValue] = useState(["1 Min", "3 Min", "5 Min", "10 Min"]);
  const [active, setactive] = useState(type + " Min");
  const [openWinOrLose, setOpenWinOrLose] = useState(false); //弹出赢输弹窗
  const [drawResult, setDrawResult] = useState<DGetCurrentThreeKingResult>(); //只用在自己有投注开奖时
  const [isbalanceState, setIsbalanceState] = useState(false);
  const [myLastBetOpenDate, setMyLastBetOpenDate] = useState("");
  const [countdown] = useCountDown({
    targetDate,
    onEnd: () => {
      // alert('End of the time');
    },
  });
  const _minType = useMemo(() => {
    switch (active) {
      case "1 Min":
        return 1;
      case "3 Min":
        return 3;
      case "5 Min":
        return 5;
      case "10 Min":
        return 10;
      default:
        return 1;
    }
  }, [active]);

  // 最新一期开奖结果
  const { runAsync: CurrentThreeKingDataRun, data: CurrentThreeKingData } =
    useFetch(
      async () => {
        const currentData = await getCurrentThreeKingData({
          minute: _minType,
        });
        return currentData.data;
      },
      { refreshDeps: [_minType] }
    );

  const countdownCal = useMemo(() => {
    if (countdown) {
      return Math.round(countdown / 1000);
    }
    return 0;
  }, [countdown]);

  useEffect(() => {
    const executeWithRetry = async (retries: number) => {
      for (let i = 0; i < retries; i++) {
        await CurrentThreeKingDataRun();
        if (CurrentThreeKingData?.seconds !== 0) {
          return;
        }
        await new Promise((res) => setTimeout(res, 500));
      }
    };

    if (CurrentThreeKingData?.seconds === 0) {
      executeWithRetry(3);
    }
  }, [CurrentThreeKingData, CurrentThreeKingDataRun]);

  const handel1Play = () => {
    try {
      audioDi1Ref.current?.play();
    } catch (e) {
      console.log(e);
    }
  };
  const { runAsync: MyCurrentThreeKingDataRun } = useRequest(
    getCurrentThreeKingResult,
    { manual: true }
  );

  //倒计时
  useEffect(() => {
    if (typeof countdownCal !== "number") return;
    if (countdownCal === 10) {
      if (!mute) {
        handel1Play();
      }
      setOpenBet(false);
      setOpening(false);
      setDrawing(true);
    } else if (countdownCal === 0) {
      if (!mute) {
        handel1Play();
      }
      CurrentThreeKingDataRun();

      if (currentSecondTab) {
        console.log("currentSecondTab", currentSecondTab);
        //开奖后清空已选号码
        onChangeSecondTabs(currentSecondTab, currentSecondTab);
      }
      //倒计时结束刷新分页
      myGuessResultRun();
      if (CurrentThreeKingData?.opendate === myLastBetOpenDate) {
        if (currOpendate) {
          MyCurrentThreeKingDataRun({ opendate: currOpendate }) // 调用 API 查询
            .then((response) => {
              const res = response as DReust<DGetCurrentThreeKingResult>;
              setDrawResult(res.data);
              setOpenWinOrLose(true);
              myGuessRun();
            })
            .catch((error) => {
              console.error("获取结果时出错:", error);
            });
        }
      }
    } else if (countdownCal < 10) {
      if (!mute) {
        handel1Play();
      }
    }
  }, [countdownCal, _minType]);

  const [currOpendate, setCurrOpendate] = useState<string>();
  useEffect(() => {
    if (CurrentThreeKingData) {
      setCurrOpendate(CurrentThreeKingData.opendate);

      if (CurrentThreeKingData.seconds > 10) {
        setDrawing(true);
        setOpening(true);
      }
      setTargetDate(Date.now() + CurrentThreeKingData.seconds * 1000);
    }
  }, [CurrentThreeKingData, !!targetDate]);

  /**
   * 开奖历史记录
   */
  const [gameHistoryPageIndex, setGameHistoryPageIndex] = useState(1);
  const [gameHistoryPage, setGameHistoryPage] = useState(1);
  const [gameHistoryIsEnd, setGameHistoryIsEnd] = useState(false);

  const [gameHistoryData, setGameHistoryData] = useState<
    ThreeKingHistoryItem[]
  >([]); //开奖历史数据
  // const [lastResultNo, setLastResultNo] = useState<number[]>();
  const lastResultNo = useMemo(() => {
    if (gameHistoryData && gameHistoryData.length > 0) {
      return [
        gameHistoryData[0].num1,
        gameHistoryData[0].num2,
        gameHistoryData[0].num3,
      ];
    } else {
      return [];
    }
  }, [gameHistoryData]);

  const { data: guessesData, runAsync: myGuessResultRun } = useFetch(
    () =>
      getThreeKingHistory({
        pageIndex: gameHistoryPageIndex,
        pageSize: pageSize,
        minute: _minType,
      }),
    {
      refreshDeps: [gameHistoryPageIndex, _minType],
    }
  );
  useEffect(() => {
    if (guessesData && guessesData.data) {
      console.log(
        "guessesData.data.list",
        (guessesData.data as DThreeKingHistory).list
      );
      const list = (guessesData.data as DThreeKingHistory).list;

      setTrendChartData(list);
      setGameHistoryData(list);
      setGameHistoryIsEnd(list.length < pageSize);
    }
  }, [guessesData]);

  const [totalPick, setTotalPick] = useState<K3OddsData>();
  const [bigOrSmallPick, setBigOrSmallPick] = useState<K3OddsData>();
  const [oddOrEvenPick, setOddOrEvenPick] = useState<K3OddsData>();
  const [twoSamePick, setTwoSamePick] = useState<K3OddsData>();
  const [twoSameWithSinglePick, setTwoSameWithSinglePick] =
    useState<K3OddsData>();
  const [twoSameWithSingleBPick, setTwoSameWithSingleBPick] =
    useState<K3OddsData>();
  const [threeSamePick, setThreeSamePick] = useState<K3OddsData>();
  const [anyThreeSamePick, setAnyThreeSamePick] = useState<K3OddsData>();
  const [threeDifferentPick, setThreeDifferentPick] = useState<K3OddsData>();
  const [continuousPick, setContinuousPick] = useState<K3OddsData>();
  const [twoDifferentPick, setTwoDifferentPick] = useState<K3OddsData>();
  const [currentSecondTab, setCurrentSecondTab] = useState<K3Gameplay>(
    K3Gameplay.total
  );
  // const handleAAA=()=>{
  //     console.log("handleAAA",pickArr)
  //     console.log("currentSecondTab",currentSecondTab)
  // }
  const onChangeSecondTabs = (index: K3Gameplay, newIndex: K3Gameplay) => {
    setCurrentSecondTab(newIndex);
    switch (index) {
      case K3Gameplay.total:
        setTotalPick(undefined);
        setBigOrSmallPick(undefined);
        setOddOrEvenPick(undefined);
        break;
      case K3Gameplay.same2:
        setTwoSamePick(undefined);
        setTwoSameWithSinglePick(undefined);
        setTwoSameWithSingleBPick(undefined);
        break;
      case K3Gameplay.same3:
        setThreeSamePick(undefined);
        setAnyThreeSamePick(undefined);
        break;
      case K3Gameplay.different:
        setThreeDifferentPick(undefined);
        setContinuousPick(undefined);
        setTwoDifferentPick(undefined);
        break;
    }
    setOpenBet(false);
  };
  const onPick = (pick: K3OddsData) => {
    const handlePickUpdate = (
      currentPick: K3OddsData | undefined,
      setPick: Dispatch<SetStateAction<K3OddsData | undefined>>,
      newValue: string
    ) => {
      if (currentPick) {
        if (
          currentPick.value.length > 0 &&
          currentPick.value.includes(newValue)
        ) {
          const updatedValue = currentPick.value.filter(
            (item) => item !== newValue
          );
          setPick({ type: currentPick.type, value: updatedValue });
        } else {
          const updatedValue = [...currentPick.value, newValue];
          setPick({ type: currentPick.type, value: updatedValue });
        }
      } else {
        setPick(pick);
      }
    };
    if (pick.type === K3BetType.Total.toString()) {
      handlePickUpdate(totalPick, setTotalPick, pick.value[0]);
    } else if (pick.type === K3BetType.BigOrSmall.toString()) {
      const newValue = pick.value[0];
      if (newValue === "Big" || newValue === "Small") {
        // 如果新增的是 Big，则移除 Small；反之亦然
        const oppositeValue = newValue === "Big" ? "Small" : "Big";
        if (bigOrSmallPick?.value.includes(oppositeValue)) {
          setBigOrSmallPick({
            type: K3BetType.BigOrSmall.toString(),
            value: [newValue], // 只保留当前选择的值
          });
        } else {
          handlePickUpdate(bigOrSmallPick, setBigOrSmallPick, newValue);
        }
      }
    } else if (pick.type === K3BetType.OddOrEven.toString()) {
      const newValue = pick.value[0];
      if (newValue === "Odd" || newValue === "Even") {
        const oppositeValue = newValue === "Odd" ? "Even" : "Odd";
        if (oddOrEvenPick?.value.includes(oppositeValue)) {
          setOddOrEvenPick({
            type: K3BetType.OddOrEven.toString(),
            value: [newValue],
          });
        } else {
          handlePickUpdate(oddOrEvenPick, setOddOrEvenPick, newValue);
        }
      }
    } else if (pick.type === K3BetType.TwoSame.toString()) {
      handlePickUpdate(twoSamePick, setTwoSamePick, pick.value[0]);
    } else if (pick.type === K3BetType.TwoSameWithSingle.toString()) {
      handlePickUpdate(
        twoSameWithSinglePick,
        setTwoSameWithSinglePick,
        pick.value[0]
      );

      // 处理与 TwoSameWithSingleB 的关系
      if (twoSameWithSingleBPick) {
        const relatedValue = (Number(pick.value[0]) / 11).toString();
        if (twoSameWithSingleBPick.value.includes(relatedValue)) {
          setTwoSameWithSingleBPick({
            type: twoSameWithSingleBPick.type,
            value: twoSameWithSingleBPick.value.filter(
              (item) => item !== relatedValue
            ),
          });
        }
      }
    } else if (pick.type === K3BetType.TwoSameWithSingleB.toString()) {
      handlePickUpdate(
        twoSameWithSingleBPick,
        setTwoSameWithSingleBPick,
        pick.value[0]
      );

      // 处理与 TwoSameWithSingle 的关系
      if (twoSameWithSinglePick) {
        const relatedValue = (Number(pick.value[0]) * 11).toString();
        if (twoSameWithSinglePick.value.includes(relatedValue)) {
          setTwoSameWithSinglePick({
            type: twoSameWithSinglePick.type,
            value: twoSameWithSinglePick.value.filter(
              (item) => item !== relatedValue
            ),
          });
        }
      }
    } else if (pick.type === K3BetType.ThreeSame.toString()) {
      handlePickUpdate(threeSamePick, setThreeSamePick, pick.value[0]);
    } else if (pick.type === K3BetType.AnyThreeSame.toString()) {
      handlePickUpdate(anyThreeSamePick, setAnyThreeSamePick, pick.value[0]);
    } else if (pick.type === K3BetType.ThreeDifferent.toString()) {
      handlePickUpdate(
        threeDifferentPick,
        setThreeDifferentPick,
        pick.value[0]
      );
    } else if (pick.type === K3BetType.Continuous.toString()) {
      handlePickUpdate(continuousPick, setContinuousPick, pick.value[0]);
    } else if (pick.type === K3BetType.TwoDifferent.toString()) {
      handlePickUpdate(twoDifferentPick, setTwoDifferentPick, pick.value[0]);
    }
    setOpenBet(true);
  };
  const pickArr: (K3OddsData | undefined)[] = [
    totalPick,
    bigOrSmallPick,
    oddOrEvenPick,
    twoSamePick,
    twoSameWithSinglePick,
    twoSameWithSingleBPick,
    threeSamePick,
    anyThreeSamePick,
    threeDifferentPick,
    continuousPick,
    twoDifferentPick,
  ];

  const pickList = useMemo(() => {
    const K3OddsDataList: K3OddsData[] = [];

    pickArr.forEach((pice) => {
      if (pice && pice.value && pice.value.length > 0) {
        K3OddsDataList.push(pice);
      }
    });
    return K3OddsDataList;
  }, [
    totalPick,
    bigOrSmallPick,
    oddOrEvenPick,
    twoSamePick,
    twoSameWithSinglePick,
    twoSameWithSingleBPick,
    threeSamePick,
    anyThreeSamePick,
    threeDifferentPick,
    continuousPick,
    twoDifferentPick,
    pickArr,
  ]);

  const formatValues = (item: K3OddsData) => {
    if (item.type === K3BetType.TwoSameWithSingle.toString()) {
      const valueString =
        item && item.value && item.value.length > 0 ? item.value.join(",") : "";
      const bList = pickList.find(
        (item) => item.type === K3BetType.TwoSameWithSingleB.toString()
      );
      const value2String = bList ? bList.value.join(",") : "";
      return valueString + "|" + value2String;
    } else {
      return item.value.join(",");
    }
  };
  const betList = useMemo(() => {
    return pickList
      .filter(
        (item) =>
          item.type.toString() !== K3BetType.TwoSameWithSingleB.toString()
      )
      .map((item) => ({
        type: item.type,
        value: formatValues(item), // 将 value 数组用逗号拼接为字符串
      }));
  }, [pickList]);

  //下注
  const onConfirm = async (amount: number) => {
    const response = await threeKingBet({
      minute: _minType,
      content: JSON.stringify(betList),
      money: amount,
    } as IThreeKingBet);
    if (response.code == 200) {
      onChangeSecondTabs(currentSecondTab, currentSecondTab);
      UxMessage.success(t`wingo1_successful_bet`);
      setMyLastBetOpenDate(CurrentThreeKingData?.opendate || "");
      //   accountInfoRun();
      myGuessRun();
      setOpenBet(false);
      setIsbalanceState(!isbalanceState);
      //   setLastBetTime(Date.now());
      return;
    } else {
      UxMessage.error(response.msg);
      return;
    }
  };

  /**
   * 下注历史记录
   */
  const [betHistoryPageIndex, setBetHistoryPageIndex] = useState(1);
  const [betHistoryPage, setBetHistoryPage] = useState(1);
  const [betHistoryIsEnd, setBetHistoryIsEnd] = useState(false);
  const [betHistoryData, setBetHistoryData] = useState<
    MyThreeKingHistoryItem[]
  >([]);
  const [lastBetTime, setLastBetTime] = useState<number>();
  const { data: myGuessData, run: myGuessRun } = useFetch(
    () => {
      const dd = myThreeKingHistory({
        pageIndex: betHistoryPageIndex,
        pageSize: pageSize,
        minute: _minType,
      } as IMyThreeKingHistory);
      // console.log("myGuessData", dd);
      return dd;
    },
    {
      refreshDeps: [betHistoryPageIndex, _minType, lastBetTime],
    }
  );
  useEffect(() => {
    if (myGuessData) {
      setBetHistoryData(myGuessData.data.list);
    }
  }, [myGuessData]);

  return (
    <Fragment>
      <div className="relative w-full h-full aaaabbbb">
        <div className="h-full overflow-auto scrollbar">
          <div className="bg-back-100 mx-auto lg:max-w-[480px] max-lg:max-w-[540px] min-h-full text-white">
            {/* <a onClick={handleAAA}>aaa</a> */}
            <BalanceBox
              isbalanceState={isbalanceState}
              openDate={currOpendate || ""}
            />
            <div className="px-2 pb-4">
              {/* <Head audioDi1Ref={audioDi1Ref} audioDi2Ref={audioDi2Ref}></Head>
                        <Header
                            value={value}
                            active={active}
                            onChange={(index) => setactive(value[index])}
                            Icons={[IconRacingActiveTime, IconRacingTime]}
                        /> */}
              {/* <GameCodeSelection
                            gameCodes={Object.values(K3GameCodeEnum)}
                            gameCodeSelectHandler={gameCodeSelectHandler}
                            currentGameCode={gameCode}
                            translationPrefix="k3_"
                        >
                        </GameCodeSelection> */}
              <Period
                seconds={countdownCal}
                // drawing={drawing}
                setOpen={setOpenHowToPlay}
                currOpendate={currOpendate}
              />
              <K3Dice lastResultNo={lastResultNo} currOpendate={currOpendate} />
              {/* <span>{JSON.stringify(betList)}</span> */}
              <K3Picker
                currentThreeKingData={CurrentThreeKingData}
                opening={opening}
                seconds={countdownCal}
                // multiples={multiples}
                // multiple={multiple}
                // setMultiple={setMultiple}
                onPick={onPick}
                onChangeSecondTabs={onChangeSecondTabs}
              />
              <K3GameBet
                amountOptions={[10, 100, 500, 1000]}
                open={openBet}
                active={active}
                pickList={pickList}
                multiples={multiples}
                multiple={multiple}
                setMultiple={setMultiple}
                onCancel={() => setOpenBet(false)}
                onConfirm={onConfirm}
                onOpenRule={() => setOpenPresaleRule(true)}
                onClosed={() => setPick(undefined)}
                // pickArr={pickArr}
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
              <div className="">
                <K3GameHistory
                  show={historyType === 0}
                  page={gameHistoryPageIndex}
                  isEnd={gameHistoryIsEnd}
                  data={gameHistoryData}
                  onChange={setGameHistoryPageIndex}
                />
                <K3GameHistoryB
                  show={historyType === 1}
                  page={gameHistoryPageIndex}
                  isEnd={gameHistoryIsEnd}
                  data={gameHistoryData}
                  onChange={setGameHistoryPageIndex}
                />
                <K3BetHistoryPage
                  show={historyType === 2}
                  page={betHistoryPage}
                  isEnd={betHistoryIsEnd}
                  data={betHistoryData}
                  onChange={setBetHistoryPageIndex}
                />
              </div>
              <K3DialogWinOrLose
                open={openWinOrLose}
                drawResult={drawResult}
                currencySymbol={SYMBOL}
                onClose={() => setOpenWinOrLose(false)}
              />
            </div>
          </div>
        </div>
      </div>
      <ViewModal
        open={openHowToPlay}
        onClose={() => setOpenHowToPlay(false)}
        title="How to play"
        children={
          <div>
            Fast 3 open with 3 numbers in each period as the opening number，The
            opening numbers are 111 to 666 Natural number，No zeros in the
            array，And the opening numbers are in no particular order，Quick 3
            is to guess all or part of the 3 winning numbers.
            <p>Sum Value</p>
            <p>Place a bet on the sum of three numbers</p>
            <p>Choose 3 same number all</p>
            <p>
              For all the same three numbers（111、222、…、666）Make an
              all-inclusive bet
            </p>
            <p>Choose 3 same number single</p>
            <p>
              From all the same three numbers（111、…、666）Choose a group of
              numbers in any of them to place bets
            </p>
            <p>Choose 2 Same Multiple</p>
            <p>
              Place a bet on two designated same numbers and an arbitrary number
              among the three numbers
            </p>
            <p>Choose 2 Same Single</p>
            <p>
              Place a bet on two designated same numbers and a designated
              different number among the three numbers
            </p>
            <p>3 numbers different</p>
            <p>Place a bet on three different numbers</p>
            <p>2 numbers different</p>
            <p>
              Place a bet on two designated different numbers and an arbitrary
              number among the three numbers
            </p>
            <p>Choose 3 Consecutive number all</p>
            <p>
              For all three consecutive numbers（123、234、345、456）Place a bet
            </p>
            <p>Description of winning and odds:</p>
            <p>Sum Value</p>
            <p>A bet with the same opening number and value is the winning</p>
            <p>Choose 3 same number all</p>
            <p>
              If the opening numbers are any three of the same number, it is the
              winning
            </p>
            <p>Choose 3 same number single</p>
            <p>
              A bet that is exactly the same as the opening number is the
              winning
            </p>
            <p>Choose 2 Same Multiple</p>
            <p>
              The same number as the two same numbers in the opening number
              (except for the three same numbers) is the winning
            </p>
            <p>Choose 2 Same Single</p>
            <p>
              A bet that is exactly the same as the opening number is the
              winning
            </p>
            <p>3 numbers different</p>
            <p>
              A bet that is exactly the same as the opening number is the
              winning
            </p>
            <p>2 numbers different</p>
            <p>
              The same as the two arbitrary numbers in the opening number is the
              winning
            </p>
            <p>Choose 3 Consecutive number all</p>
            <p>
              If the opening numbers are any three consecutive numbers, it is
              the winning
            </p>
            <p>&nbsp;</p>
            <p></p>
          </div>
        }
      />
    </Fragment>
  );
}
