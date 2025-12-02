import { UxModal } from "../../../ui";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useRacingRealOpendate } from "@/hooks/useRacingData";
import { useRequest } from "ahooks";
import { get5dResult } from "@/fetchers/game";
import { useEffect } from "react";

export default function PrizeModal({
  open,
  current,
  onClose,
}: {
  open: boolean;
  current: number;
  onClose: () => void;
}) {
  const backgroundColorCell: string[] = [
    "#e6dc30",
    "#1794da",
    "#4b4b4b",
    "#fd7622",
    "#2ddbdd",
    "#523ff8",
    "#bcbcbc",
    "#fc2a1c",
    "#760d07",
    "#1fba1f",
  ];
  const [racingRealOpendate] = useRacingRealOpendate();
  const { run: getData, data } = useRequest(
    () => get5dResult({ opendate: racingRealOpendate }),
    {
      manual: true,
    }
  );
  useEffect(() => {
    if (open) getData();
  }, [open]);

  if (!data?.data) return null;
  return (
    <UxModal
      className="bg-transparent max-w-80"
      open={open}
      showCloseButton={false}
    >
      <div className="relative m-auto max-w-80 text-white">
        <img
          className="top-1/2 left-1/2 absolute max-w-80 -translate-x-1/2 -translate-y-1/2 transform"
          src={
            data?.data?.winAmount > 0
              ? "/Racing/win_prize.png"
              : "/Racing/lose_prize.png"
          }
        />
        <div className="-top-20 left-1/2 absolute font-bold text-white text-2xl text-center -translate-x-1/2 transform">
          Congratulations
        </div>
        <div className="top-1/2 left-1/2 absolute font-bold text-white text-2xl text-center -translate-x-1/2 -translate-y-1/2 transform">
          {data?.data?.winAmount > 0
            ? `Win Bonus:${data.data?.winAmount}`
            : " Lose"}
        </div>
        <div className="top-16 -left-32 absolute">
          <span>Lottery</span>
          <span className="pl-2">results:</span>
          <span className="flex justify-center items-center" title={"result"}>
            {data.data?.results?.split(",").map((res, index) => {
              return (
                <div
                  className="flex justify-center items-center mr-1 w-4 h-4 font-normal"
                  style={{
                    backgroundColor: backgroundColorCell[parseInt(res) - 1],
                  }}
                  key={index}
                >
                  {res}
                </div>
              );
            })}
          </span>
        </div>
        <div className="top-40 -left-32 absolute">
          <span className="text-ellipsis whitespace-nowrap">
            Preiod:5D {current}Min
          </span>
        </div>
        <div
          className="top-56 left-1/2 absolute -translate-x-1/2 transform"
          onClick={onClose}
        >
          <XCircleIcon className="w-8 h-8 text-white" onClick={onClose} />
        </div>
      </div>
    </UxModal>
  );
}
