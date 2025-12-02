import { useState } from "react";
import PeriodContent from "./PeriodContent";
import "./index.css";
import BalanceBox from "./BalanceBox";
import HistoryPage from "./HistoryPage";
import { emitLogined, useSocketBalance } from "@/events";
import { useSocketEmit } from "@/socket";
import { EEmit } from "@/socket/enums";

export default function Racing() {
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");

  // emitLogined(true);
  useSocketEmit<EmitLogin>({
    defaultParams: [EEmit.LOGIN, { token: token ? token : "", userId: "" }],
    onSuccess: (res) => {
      // if (res.code !== 200) return UxMessage.error("data error");
      emitLogined(true);
    },
  });
  const [start, setStart] = useState<boolean>(false);

  // 获取余额
  const balanceObj = useSocketBalance();

  return (
    <div className="relative bg-back-100 w-full custom-scroll">
      <BalanceBox balance={balanceObj?.balance} />
      <PeriodContent
        balance={balanceObj?.balance}
        setStart={setStart}
        start={start}
      />
      <HistoryPage current={5} />
    </div>
  );
}
