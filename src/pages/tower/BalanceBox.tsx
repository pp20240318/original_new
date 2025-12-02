import IconBalanceWallet from "../../assets/balance_wallet.png";
import { useState } from "react";
import { useAppConfig } from "@/appconfig";
import { useSocket } from "@/hooks/useSocket";

export default function BalanceBox({ balance = 0 }: { balance?: number }) {
  const { SYMBOL } = useAppConfig();

  return (
    <div className="flex flex-col justify-center items-center bg-base-900 mb-4 rounded-lg w-full">
      <div className="flex justify-center items-center mt-2 mb-1">
        <img src={IconBalanceWallet} alt="balance" className="w-6 h-6" />
        <div className="ml-2 font-bold text-white text-base">
          Wallet balance
        </div>
      </div>
      <div className="flex justify-center items-center pb-2 font-bold text-white text-base">
        {SYMBOL} {balance?.toFixed(2)}
        <div className="cursor-pointer">
          {/* <Icon
            className={clsx(
              "ml-2",
              "icon-comm",
              loading ? "icon-comm_rotate" : "icon-comm_close "
            )}
            color="#ECF24F"
            name="icon-comm"
          /> */}
        </div>
      </div>
    </div>
  );
}
