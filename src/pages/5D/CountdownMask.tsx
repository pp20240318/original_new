import { useRefreshHistory } from "@/hooks/useRefreshHistory";
import { useEffect, useRef, useState } from "react";

export default function CountdownMask({ start }: { start: boolean }) {
  const [countDown, setCountDown] = useState(5);
  const [, setUpdateHistory] = useRefreshHistory();
  useEffect(() => {
    if (!start) {
      setCountDown(5);
      return;
    }
    audioDi1Ref.current?.play();
    const timer = setInterval(() => {
      if (countDown > 0) {
        setCountDown(countDown - 1);
      } else {
        clearInterval(timer);
        setCountDown(5);
        setUpdateHistory({ status: false });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [start, countDown]);

  const audioDi1Ref = useRef<HTMLAudioElement>(null);

  return start ? (
    <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full flex justify-center items-center bg-[#00000080] z-[99]">
      <div className="hidden">
        <audio
          ref={audioDi1Ref}
          preload="auto"
          src="/wingo/audio/di1.mp3"
        ></audio>
      </div>
      <div>
        <span className=" inline justify-center items-center text-[7rem] bg-[linear-gradient(to_top,#319470_20%,#22674b)] text-[#184b38] px-4 rounded-[10%] mr-8">
          0
        </span>
        <span className=" inline justify-center items-center text-[7rem] bg-[linear-gradient(to_top,#319470_20%,#22674b)] text-[#184b38] px-4 rounded-[10%]">
          {countDown}
        </span>
      </div>
    </div>
  ) : null;
}
