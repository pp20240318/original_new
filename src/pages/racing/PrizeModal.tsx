import { UxModal } from "../../../ui";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useRacingRealOpendate } from "@/hooks/useRacingData";
import { useRequest } from "ahooks";
import { getRacingResult } from "@/fetchers/game";
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
    () => getRacingResult({ opendate: racingRealOpendate }),
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
      className="max-w-80 bg-transparent "
      open={open}
      showCloseButton={false}
    >
      <div className="relative max-w-80  m-auto text-white">
        <img
          className="max-w-80  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          src={
            data?.data?.winAmount > 0
              ? "/Racing/win_prize.png"
              : "/Racing/lose_prize.png"
          }
        />

        <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 text-white text-center font-bold text-xl">
          {data?.data?.winAmount > 0 ? (
            <>
              Congratulations
              <div className="pt-1 text-xl">Period:{data?.data.opendate}</div>
            </>
          ) : (
            <div className="absolute top-4  -translate-x-1/2">Sorry</div>
          )}
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center font-bold text-xl ">
          {data?.data?.winAmount > 0
            ? `Bonus:${data?.data?.winAmount}`
            : " Lose"}
        </div>
        <div className="absolute -left-32 top-16 ">
          <span>Lottery</span>
          <span className="pl-2">results:</span>
          <span
            className="flex items-center justify-center   "
            title={"result"}
          >
            {data?.data?.results?.split(",").map((res) => {
              return (
                <div
                  className="flex items-center justify-center w-4 h-4 mr-1 font-normal"
                  style={{
                    backgroundColor: backgroundColorCell[parseInt(res) - 1],
                  }}
                  key={res}
                >
                  {res}
                </div>
              );
            })}
          </span>
        </div>
        <div className="absolute -left-32 top-40 ">
          <span className="whitespace-nowrap text-ellipsis">
            {"Preiod:RoyalRacing " + current + " Min"}
          </span>
        </div>
        <div
          className="absolute  top-56 left-1/2 transform -translate-x-1/2 "
          onClick={onClose}
        >
          <XCircleIcon className="w-8 h-8 text-white" onClick={onClose} />
        </div>
      </div>
    </UxModal>
  );
}
