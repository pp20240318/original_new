import { emitLogined, useSocketBalance } from "@/events";
import BalanceBox from "../tower/BalanceBox";
import "./only.css";
import PartMain from "./PartMain";
import PartJackPot from "./PartJackPot";
import { useSocketEmit } from "@/socket";
import { EEmit } from "@/socket/enums";
import { useEffect, useState } from "react";

export default function HiloPage() {
   
  const balanceObj = useSocketBalance();
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");
  useSocketEmit<EmitLogin>({
    defaultParams: [EEmit.LOGIN, { token: token ? token : "", userId: "" }],
    onSuccess: (res) => {
      emitLogined(true);
      // setIsConn(true);
    },
  });
  const [balance, setBalance] = useState(0.0);
   useEffect(() => {
      setBalance(balanceObj?.balance || 0.0);
    }, [balanceObj?.balance]);
  return (
    <div className="bg-[#0d131c] max-w-[480px] min-h-full container">
      <BalanceBox balance={balanceObj?.balance}></BalanceBox>
      {/* <PartJackPot></PartJackPot> */}
      <PartMain balance={balanceObj?.balance ?? 0}></PartMain>
    </div>
  );
}
