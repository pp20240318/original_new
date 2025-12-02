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
import { getRacingData, getRacingResult } from "@/fetchers/game";
import { useRacingRealOpendate } from "@/hooks/useRacingData";
import { useRacingCloseModal } from "@/hooks/useRacingCloseModal";

// 加载duration插件
dayjs.extend(duration);
// let timer: NodeJS.Timeout | null = null;

export default function PeriodContent({
  current,
  onDataChange,
  setStart,
  onChange,
}: {
  current: number;
  onDataChange: (data: DRacingData) => void;
  setStart: Dispatch<SetStateAction<boolean>>;
  onChange: (loading: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [, setRacingRealOpendate] = useRacingRealOpendate();
  const [racingCloseModal, setRacingCloseModal] = useRacingCloseModal();

  const {
    run: getData,
    data,
    loading,
  } = useRequest(() => getRacingData({ minute: current }), {
    manual: true,
    onSuccess: (r) => {
      setRacingRealOpendate(r.data.realOpendate);
      setCountDown(r.data?.seconds);
      setGameResult({} as DRacingResult);
      const t = r.data.seconds > current * 55 ? 5 : 0;

      setTimeout(() => {
        onDataChange(r.data);
        const iframe = document.getElementById("gameBox") as HTMLIFrameElement;
        if (!iframer) setIframer(iframe);
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            ["info", { ...r.data.openResult, count_down: r.data.seconds - t }],
            "*"
          );
        }
      }, t * 1000);
    },
  });

  const { runAsync: getResult } = useRequest(getRacingResult, { manual: true });

  const [countDown, setCountDown] = useState(0);
  const [iframer, setIframer] = useState<HTMLIFrameElement | null>(null);
  const [gameResult, setGameResult] = useState<DRacingResult>();

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
          setStart(true);
          setRacingCloseModal(!racingCloseModal);
        }
        setCountDown(countDown - 1);
        // 获取开奖
        if (countDown === 4 && !gameResult?.opendate) {
          getResult({ minute: current }).then((r) => {
            if (r.code == 200) {
              setGameResult(r.data);
              iframer?.contentWindow?.postMessage(["award", r.data], "*");
            }
          });
        }
      } else {
        setStart(false);
        getData();
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
  useEffect(() => {
    onChange(loading);
  }, [loading]);

  return (
    <div className="relative  mt-4 rounded-xl bg-base-900 p-3">
      <div className="flex flex-col items-center mt-3 w-full">
        <div className="w-full flex justify-between items-center">
          <div className="flex-1 flex ">
            <div className="mr-3 text-white">Poriod</div>
            <button className="border border-[#ECF24F] rounded-3xl  text-sm text-[#ECF24F] h-8 w-full">
              <div
                className="flex items-center justify-center "
                onClick={() => setOpen(true)}
              >
                <Icon name="icon-vector" />
                <div className="ml-2 flex items-center"> How to play</div>
              </div>
            </button>
          </div>
          <div className="flex-1 flex justify-end text-white">Count Down</div>
        </div>
      </div>
      <div className="flex  justify-between items-center mt-3">
        <div className="flex-1 text-2xl font-bold text-white">
          {data?.data.opendate}
        </div>
        <div className="flex-1 items-center flex justify-end  text-2xl font-bold text-[#ECF24F]">
          {formatTime(countDown)}
          {/* <div>00</div>
          <div>:</div>
          <div>00</div> */}
        </div>
      </div>
      <div className="relative" style={{ paddingTop: "65%" }}>
        <iframe
          scrolling="no"
          id="gameBox"
          className="absolute top-0 left-0 w-full h-full"
          src="/Racing/index.html?api_url=https://h5.cc-bet.com/Racing?id=1092"
        />
      </div>
      <ViewModal
        open={open}
        onClose={onClose}
        title="How to play"
        children={
          <div className="custom-scroll  text-base-white text-xs m-2 overflow-auto max-h-[40vh] break-all">
            <p>
              <strong>Each race has 10 cars numbered 1-10.</strong>
            </p>
            <br />
            <p>
              <strong>
                In the Champion runner-up betting interface, we calculate the
                sum of the first and second place car numbers.
              </strong>
            </p>
            <br />
            <p>
              <strong>
                The sum of the first and second place numbers is 3-19, a total
                of 17 numbers.
              </strong>
            </p>
            <br />
            <p>
              <strong>
                The sum of the first and second place numbers 3-19 has more odd
                numbers and fewer even numbers.
              </strong>
            </p>
            <br />
            <p>
              <strong>
                So the odds for odd numbers are 1.782. Even numbers are 2.227.
              </strong>
            </p>
            <br />
            <p>
              <strong>
                The sum of the first and second place numbers 3-11 is small.
                12-19 is big.
              </strong>
            </p>
            <br />
            <p>
              <br />
              <strong>The odds are also different.</strong>
            </p>
            <p>
              <strong>
                You can also predict what the sum of the first and second place
                numbers is. The odds are higher.
              </strong>
            </p>
            <p>
              <br />
              <strong>
                Calculate the odds based on the numbers under each number from
                3-19.
              </strong>
            </p>
            <p>
              <br />
              <strong>
                For example, you bet 100rs on 3, and the odds of 3 are 43.1: the
                first and second place car numbers are 1 and 2, then you can get
                98*43.1=4223.8rs.
              </strong>
            </p>
          </div>
        }
      />
    </div>
  );
}
