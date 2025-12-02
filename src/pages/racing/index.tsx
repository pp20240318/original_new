import { useEffect, useState } from "react";
import Header from "../components/Header";
import PeriodContent from "./PeriodContent";
import IconRacingActiveTime from "../../assets/racing_active_time.png";
import IconRacingTime from "../../assets/racing_time.png";
import TabContentBox from "./TabContentBox";
import HistoryPage from "./HistoryPage";
import PrizeModal from "./PrizeModal";
import { useRefreshHistory } from "@/hooks/useRefreshHistory";
import { useRacingCloseModal } from "@/hooks/useRacingCloseModal";

import "./index.css";
import BalanceBox from "./BalanceBox";

export default function Racing() {
  const [value, setValue] = useState(["1 Min", "3 Min", "5 Min", "10 Min"]);
  const [active, setactive] = useState(value[0]);
  const [open, setOpen] = useState(false);
  const [dataFromChild, setDataFromChild] = useState<RacingBetItem[]>([]);
  const [updateHistory] = useRefreshHistory();
  const [racingCloseModal] = useRacingCloseModal();
  const [openDate, setOpenDate] = useState<string>("");
  const [isbalanceState, setIsbalanceState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleDataChange = (data: DRacingData) => {
    setDataFromChild(data.items);
    setOpenDate(data.opendate);
  };

  const [start, setStart] = useState<boolean>(false);
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (updateHistory.status && start) {
      setTimeout(() => {
        setOpen(true);
      }, 6000);
    }
  }, [updateHistory.status, start]);

  useEffect(() => {
    if (!racingCloseModal) {
      setOpen(false);
    }
  }, [racingCloseModal]);
  return (
    <div className="relative w-full  bg-back-100">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"></div>
      )}
      <BalanceBox isbalanceState={isbalanceState} openDate={openDate} />
      <Header
        value={value}
        active={active}
        onChange={(index) => setactive(value[index])}
        Icons={[IconRacingActiveTime, IconRacingTime]}
      />
      <PeriodContent
        onDataChange={handleDataChange}
        current={Number(active.split(" ")[0])}
        setStart={setStart}
        onChange={(loading) => {
          setIsLoading(loading);
        }}
      />
      <TabContentBox
        dataFromChild={dataFromChild}
        start={start}
        active={Number(active.split(" ")[0])}
        onChange={() => {
          setIsbalanceState(!isbalanceState);
        }}
      />
      <HistoryPage openDate={openDate} current={Number(active.split(" ")[0])} />
      {open && (
        <PrizeModal
          current={Number(active.split(" ")[0])}
          open={open}
          onClose={() => {
            setIsbalanceState(!isbalanceState);
            onClose();
          }}
        />
      )}
    </div>
  );
}
