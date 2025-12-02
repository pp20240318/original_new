import IconBalanceWallet from "../assets/balance_wallet.png";
import { UxIcon as Icon } from "@/components/UxIcon";
import { useRequest } from "ahooks";
import { getBalance } from "@/fetchers/user";
import { useEffect } from "react";
import clsx from "clsx";
import { useAppConfig } from "@/appconfig";

export default function BalanceBox({
  isbalanceState,
  openDate,
}: {
  isbalanceState: boolean;
  openDate: string;
}) {
  const { SYMBOL } = useAppConfig();
  const {
    run: getBalanceData,
    data,
    loading,
  } = useRequest(getBalance, {
    manual: true,
  });

  useEffect(() => {
    getBalanceData();
  }, []);
  useEffect(() => {
    getBalanceData();
  }, [isbalanceState, openDate]);

  return (
    <div className="flex flex-col justify-center items-center bg-base-900 mb-4 rounded-lg w-full h-full">
      <div className="flex justify-center items-center mt-2 mb-1">
        <img src={IconBalanceWallet} alt="balance" className="w-6 h-6" />
        <div className="ml-2 font-bold text-white text-base">
          Wallet balance
        </div>
      </div>
      <div className="flex justify-center items-center pb-2 font-bold text-white text-base">
        {SYMBOL}
        {data?.data.balance || 0}
        <div
          className="cursor-pointer"
          onClick={() => {
            getBalanceData();
          }}
        >
          <Icon
            className={clsx(
              "ml-2",
              "icon-comm",
              loading ? "icon-comm_rotate" : "icon-comm_close "
            )}
            color="#ECF24F"
            name="icon-comm"
          />
        </div>
      </div>
    </div>
  );
}
