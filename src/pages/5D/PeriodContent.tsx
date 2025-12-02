import { UxIcon as Icon } from "@/components/UxIcon";
import ViewModal from "@/components/ViewModal";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useRequest } from "ahooks";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { get5dData, get5dResult } from "@/fetchers/game";
import { useRacingRealOpendate } from "@/hooks/useRacingData";
import clsx from "clsx";
import { useRacingCloseModal } from "@/hooks/useRacingCloseModal";

// 加载duration插件
dayjs.extend(duration);
// let timer: NodeJS.Timeout | null = null;

export default function PeriodContent({
  current,
  setStart,
  onDataChange,
}: {
  current: number;
  setStart: Dispatch<SetStateAction<boolean>>;
  onDataChange: (data: DRacingData) => void;
}) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<string[]>(["0", "0", "0", "0", "0"]);
  const [scroll, setScroll] = useState(false);
  const [, setRacingRealOpendate] = useRacingRealOpendate();
  const [racingCloseModal, setRacingCloseModal] = useRacingCloseModal();
  const { run: getData, data } = useRequest(
    () => get5dData({ minute: current }),
    {
      manual: true,
      onSuccess: (r) => {
        setCountDown(r.data?.seconds);
        onDataChange(r.data);
        setRacingRealOpendate(r.data.opendate);
        // const t = r.data.seconds > current * 55 ? 5 : 0;
        if (r.data.openResult) {
          setResult(r.data.openResult.results.split(","));
        }
      },
    }
  );

  const { runAsync: getResult } = useRequest(get5dResult, { manual: true });

  const [countDown, setCountDown] = useState(0);

  // 监听页面是否可见，可见要重新请求倒计时时间
  const [isPageVisible, setIsPageVisible] = useState(
    document.visibilityState === "visible"
  );
  const onClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState === "visible");
    };
    // 监听页面可见性变化事件
    document.addEventListener("visibilitychange", handleVisibilityChange);
    // 组件卸载时移除事件监听器
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // 页面可见时就重新请求时间
  useEffect(() => {
    if (isPageVisible) getData();
  }, [isPageVisible, getData, current]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (countDown > 0) {
        // console.log("secound", countDown);
        if (countDown === 6) {
          setRacingCloseModal(!racingCloseModal);
          setStart(true);
        }
        setCountDown(countDown - 1);
        if (countDown === 1)
          // 获取开奖结果
          getResult({ minute: current }).then((r) => {
            if (r.code == 200) {
              setResult(r.data.results.split(","));
            }
          });
      } else {
        setScroll(true);

        setTimeout(() => {
          setScroll(false);
        }, 4000);
        getData();
        setStart(false);
        clearInterval(timer);
        setCountDown(0);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [countDown]);

  const formatTime = useCallback((seconds: number) => {
    // 将秒数转换为持续时间
    const durationObj = dayjs.duration(seconds, "seconds");
    // 获取分钟和秒数
    const m = String(durationObj.minutes()).padStart(2, "0");
    const s = String(durationObj.seconds()).padStart(2, "0");
    return `${m}:${s}`;
  }, []);

  return (
    <div className="relative bg-base-900 mt-4 p-3 rounded-xl">
      <div className="flex flex-col items-center mt-3 w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-1">
            <div className="mr-3 text-white">Poriod</div>
            <button className="border border-[#ECF24F] rounded-3xl w-full h-8 text-[#ECF24F] text-sm">
              <div
                className="flex justify-center items-center"
                onClick={() => setOpen(true)}
              >
                <Icon name="icon-vector" />
                <div className="flex items-center ml-2"> How to play</div>
              </div>
            </button>
          </div>
          <div className="flex flex-1 justify-end text-white">Count Down</div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-3">
        <div className="flex-1 font-bold text-white text-2xl">
          {data?.data.opendate}
        </div>
        <div className="flex flex-1 justify-end items-center font-bold text-[#ECF24F] text-2xl">
          {formatTime(countDown)}
          {/* <div>00</div>
          <div>:</div>
          <div>00</div> */}
        </div>
      </div>

      <div className="relative mt-2">
        {/* game body */}
        <div className="bg-[#00B977] p-3 rounded-md h-32 d5-body">
          <div className="flex justify-between items-center gap-[0.3rem] bg-[#003c26] p-[0.3rem] rounded-md w-full h-full d5-box">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#727272] rounded-md w-1/5 h-full overflow-hidden text-center"
              >
                <div
                  className={clsx(
                    "slot-transform",
                    "transform" + i,
                    scroll ? "slot-scroll" : ""
                  )}
                >
                  <div className="slot-num">
                    {!parseInt(result[i]) ? 9 : parseInt(result[i]) - 1}
                  </div>
                  <div className="slot-num">{result[i]}</div>
                  <div className="slot-num">
                    {parseInt(result[i]) > 8 ? 0 : parseInt(result[i]) + 1}
                  </div>
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div className="slot-num" key={i}>
                      {i > 9 ? i - parseInt(i / 10 + "") * 10 : i}
                    </div>
                  ))}
                  <div className="slot-num">
                    {!parseInt(result[i]) ? 9 : parseInt(result[i]) - 1}
                  </div>
                  <div className="slot-num">{result[i]}</div>
                  <div className="slot-num">
                    {parseInt(result[i]) > 8 ? 0 : parseInt(result[i]) + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ViewModal
        open={open}
        onClose={onClose}
        title="How to play"
        children={
          <div className="m-2 -mt-[0.1rem] max-h-[40vh] overflow-auto text-4xs text-base-white break-all custom-scroll">
            <p>5D lottery game rules</p>
            <p>Draw instructions</p>
            <p>
              5-digit number (00000-99999) will be drawn randomly in each period
            </p>
            <p>for example：</p>
            <p>The draw number for this Period is 12345</p>
            <p>A=1</p>
            <p>B=2</p>
            <p>C=3</p>
            <p>D=4</p>
            <p>E=5</p>
            <p>
              SUM=A+B+C+D+E=15
              <br />
              <br />
            </p>
            <p>How to play</p>
            <p>
              Players can specify six outcomes of betting A, B, C, D, E and the
              sum
            </p>
            <p>A, B, C, D, E can be purchased</p>
            <p>Number (0 1 2 3 4 5 6 7 8 9)</p>
            <p>Low (0 1 2 3 4)</p>
            <p>High (5 6 7 8 9)</p>
            <p>Odd (1 3 5 7 9)</p>
            <p>Even (0 2 4 6 8)</p>
            <p>
              Sum = A+B+C+D+E can be purchased
              <br />
            </p>
            <p>Low (0-22)</p>
            <p>High (23-45)</p>
            <p>Odd (1 3 ···43 45)</p>
            <p>Even (0 2 ···42 44)</p>
          </div>
        }
      />
    </div>
  );
}
