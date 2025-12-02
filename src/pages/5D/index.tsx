import { useEffect, useState } from "react";
import Header from "../components/Header";
import PeriodContent from "./PeriodContent";
import IconRacingActiveTime from "../../assets/racing_active_time.png";
import IconRacingTime from "../../assets/racing_time.png";
import TabContentBox from "./TabContentBox";
import HistoryPage from "./HistoryPage";
import "./index.css";
import { useRefreshHistory } from "@/hooks/useRefreshHistory";
import { useRacingCloseModal } from "@/hooks/useRacingCloseModal";
import PrizeModal from "./PrizeModal";
import BalanceBox from "./BalanceBox";

export default function Racing() {
  const [value, setValue] = useState(["1 Min", "3 Min", "5 Min", "10 Min"]);
  const [active, setactive] = useState(value[0]);
  const [open, setOpen] = useState(false);
  const [dataFromChild, setDataFromChild] = useState<RacingBetItem[]>([]);

  const [isbalanceState, setIsbalanceState] = useState(false);
  const [openDate, setOpenDate] = useState<string>("");

  const handleDataChange = (data: DRacingData) => {
    setDataFromChild(data.items);
    setOpenDate(data.opendate);
  };
  const [updateHistory] = useRefreshHistory();
  const [start, setStart] = useState<boolean>(false);
  const [racingCloseModal] = useRacingCloseModal();
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
    <div className="relative bg-back-100 w-full custom-scroll">
      <BalanceBox isbalanceState={isbalanceState} opendate={openDate} />
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
      />
      <TabContentBox
        dataFromChild={dataFromChild}
        start={start}
        active={Number(active.split(" ")[0])}
      />
      <HistoryPage openDate={openDate} current={Number(active.split(" ")[0])} />
      <PrizeModal
        current={Number(active.split(" ")[0])}
        open={open}
        onClose={onClose}
      />
    </div>
  );
}
