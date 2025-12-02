import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
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
    balance = 0,
}: {
    balance?: number;
}) {
    const { SYMBOL } = useAppConfig();

    const [active, setActive] = useState(9);
    const [win, setWin] = useState(null);
    const [betAmount, setBetAmount] = useState<string>("1.0000");


    const [start, setStart] = useState<boolean>(false);
    //抛掷状态
    const [isFlipping, setFlipState] = useState(false);
    const [hit, setHit] = useState(0);
    const [payout, setPayout] = useState(0);
    const [resultShow, setResultShow] = useState<{
        payout: number;
        mul: number;
    } | null>(null);
    const [failShow, setFailShow] = useState(false);
    const [notName, setNotName] = useState(false);
    const [nickName, setNickName] = useState<string>("");

    useEffect(() => {
        if (start) return;
        if (balance && balance < Number(betAmount)) {
            setBetAmount(balance.toFixed(4));
        }
    }, [balance]);

    const logined = useLogined();
    // 获取状态
    useSocketEmit<StateCoinRecordHolder>({
        defaultParams: [EEmit.STATE, EGame.COINRECORDHOLDER, {}],
        ready: logined,
        onSuccess: (res) => {
            console.log("获取游戏状态:", res);
            setStart(res.data.hasStart);
            setBetAmount(res.data.money);
            setPayout(res.data.payout);
            //nickName 这里要处理去填写昵称的逻辑
            if (res.data.nickName == "") {
                setNotName(true);
            } else {
                setNickName(res.data.nickName);
            }
        },
    });

    // 结算
    const { run: CashoutRun } = useSocketEmit<CashoutCoinRecordHolder>({
        onSuccess: (r) => {
            console.log("结算返回:", r);
            if (r.code !== 200) return UxMessage.error("data error");
            setResultShow({ payout: r.data.payout, mul: r.data.multiplier });
            setStart(false);
            setPayout(0);
            setTimeout(() => setResultShow(null), 3000);
        },
    });

    // 下注
    const { run: betRun } = useSocketEmit<BetCoinRecordHolder>({
        onSuccess: (r) => {
            console.log("下注返回:", r);
            if (r.code !== 200) return UxMessage.error("data error");
            setStart(true);
            setHit(1);
        },
    });

    // Play
    const { runAsync: playRun } = useSocketEmit<PlayCoinRecordHolder>();

    const { runAsync: setNickNameRun } = useSocketEmit<EmitSetNickName>();

    const okClick = () => {
        if (nickName == "") { return; }
        setNickNameRun(EEmit.SETNICKNAME, { nickName: nickName }).then((res) => {
            if (res.code == 200) {
                setNotName(false);
            }
        })
    }

    const betClick = () => {
        if (start) {
            // 结算
            //CashoutRun(EEmit.CASHOUT, EGame.COINRECORDHOLDER, {}); // settlement();
            return;
        }
        if (!balance)
            return UxMessage.warning("Insufficient balance, please recharge");

        // if (Number(betAmount) > balance) {
        //     setBetAmount(balance.toFixed(4));
        // } else if (Number(betAmount) < 10) setBetAmount("10");
        setBetAmount("10");
        setFailShow(false);
        // audio.src = "/tower/bet.mp3";
        // audio.play();
        betRun(EEmit.BET, EGame.COINRECORDHOLDER, {
            bet_amount: Number(betAmount),
        });
    };

    const cashoutClick = () => {
        CashoutRun(EEmit.CASHOUT, EGame.COINRECORDHOLDER, {}); // settlement();
    }

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

    const playClick = () => {
        // audio.src = "/tower/click.mp3";
        // audio.play();
        if (isFlipping) return;
        setFlipState(true);
        playRun(EEmit.PLAY, EGame.COINRECORDHOLDER, {
            hit: hit,
        }).then((r) => {
            console.log(r);
            setTimeout(() => {
                setFlipState(false);
                if (r.code !== 200) return UxMessage.error("data error");
                setWin(r.data.win);
                if (r.data.win) {
                    setHit(r.data.hit + 1);
                    setPayout(r.data.payout);
                } else {
                    // audio.src = "/tower/losing.mp3";
                    // audio.play();
                    setStart(false);
                    setPayout(0);
                    setFailShow(true);
                    setTimeout(() => { setFailShow(false) }, 3000);
                }
            }, 1000)
        });
    }

    return (
        <div className="relative flex justify-center mt-4 p-3 lg:px-20 rounded-xl w-full">
            <div className="w-full md:max-w-[650px]">
                {/* ---- 游戏背景 ---- */}
                <div className="relative bg-[url('/tower/bg-mobile.jpg')] sm:bg-[url('/tower/bg.webp')] bg-cover bg-no-repeat -ml-[16px] sm:ml-0 sm:p-[20px] px-[12px] py-[16px] sm:pl-[220px] rounded-xl w-[110%] sm:w-full">

                    {/* ---- 昵称 ---- */}
                    <div className="w-[120px] text-[18px] text-white">
                        {nickName}
                    </div>

                    {/* ---- 个人最高连击数 ---- */}

                    {/* ---- 排行榜 ---- */}
                    <div className="w-[120px] text-[18px] text-white">
                        <div>top1:xxxa</div>
                        <div>top2:xxxb</div>
                        <div>top3:xxxc</div>
                    </div>


                    {/* ---- 游戏内容 ---- */}
                    <div className="coin-container" id="coin-container">
                        <div className="coin-edge"></div>
                        <div className={clsx("coin", isFlipping && "flipping")} id="coin">
                            <div className="coin-face heads">
                                <div className="heads-content">
                                    <div className="heads-icon"><i className="fas fa-dragon"></i></div>
                                    <div className="heads-text">Head</div>
                                </div>
                            </div>
                            <div className="coin-face tails">
                                <div className="tails-content">
                                    <div className="tails-icon"><i className="fas fa-yin-yang"></i></div>
                                    <div className="tails-text">Tail</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ---- 按钮 ---- */}
                    {start && (
                        <div className="controls">
                            <button className="btn" id="flip-btn" onClick={cashoutClick}>
                                <div>CASHOUT</div>
                                <div>{payout}</div>
                            </button>
                            <button className="btn" id="auto-btn" onClick={playClick}>
                                <div>PLAY</div>
                            </button>
                        </div>
                    )}
                    {!start && (
                        <div className="controls">
                            <button className="btn" id="flip-btn" onClick={betClick}>
                                <div>BET</div>
                            </button>
                        </div>
                    )}

                    {/* ---- 取名字 ---- */}
                    {notName && (
                        <div className="top-[25%] left-[50%] z-10 absolute flex flex-col justify-center items-center bg-[linear-gradient(180deg,#0051cb_16.13%,#489cff_83.87%)] px-[10px] py-[15px] rounded-lg w-[200px] h-[100px] overflow-hidden font-bold">
                            <div>
                                <Input
                                    className="flex-1 bg-transparent border-none outline-none w-[120px] text-[18px] text-white"
                                    value={nickName}
                                    onInput={(e) => {
                                        const input = e.target as HTMLInputElement;
                                        let value = input.value
                                        setNickName(value);
                                    }}
                                    placeholder="please input your name"
                                />
                            </div>
                            <button className="btn" id="flip-btn" onClick={okClick}>
                                <div>OK</div>
                            </button>
                        </div>
                    )
                    }
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

                    {/*-----失败-----*/}
                    {failShow && (
                        <div className="top-[25%] left-[50%] z-10 absolute flex flex-col justify-center items-center bg-[linear-gradient(180deg,#0051cb_16.13%,#489cff_83.87%)] px-[10px] py-[15px] rounded-lg w-[200px] h-[100px] overflow-hidden font-bold">
                            sorry,you fail
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
