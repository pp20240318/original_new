import { useMemo } from "react";
import { Dispatch, SetStateAction, useState } from "react";
import K3Picker1 from "./K3Picker1";
import { K3Gameplay, K3OddsData } from "../types";
import K3Picker2 from "./K3Picker2";
import K3Picker3 from "./K3Picker3";
import K3Picker4 from "./K3Picker4";
import clsx from "clsx";

export default function K3Picker({
    opening,
    currentThreeKingData,
    seconds,
    //   multiples,
    //   multiple,
    //   setMultiple,
    onPick,
    onChangeSecondTabs,
}: {
    opening: boolean;
    currentThreeKingData?: DCurrentThreeKingData;
    seconds?: number;
    //   multiples: number[];
    //   multiple: number;
    //   setMultiple: Dispatch<SetStateAction<number>>;
    onPick: (value: K3OddsData) => void;
    onChangeSecondTabs: (tabindex: K3Gameplay,newTabindex: K3Gameplay) => void;
}) {
    const secondsLayout = useMemo(() => {
        if (typeof seconds !== "number") return ["-", "-"];
        return [Math.floor(seconds / 10) % 10, seconds % 10];
    }, [seconds]);

    const [activeTab, setActiveTab] = useState(K3Gameplay.total);
    return (
        <div className="relative mt-4 p-1.5 rounded-lg bg-base-900">
            {opening}
            <div className="w-full grid grid-cols-4 gap-px">
                {Object.entries(K3Gameplay).map(([key, value]) => (
                    <button key={key}
                        className={clsx(
                            "rounded-t text-xs w-full text-center py-2",
                            activeTab === value && "bg-[#f95959] text-white",
                            !(activeTab === value) && "bg-[#314259] text-gray-500",
                        )}
                        onClick={() => {
                            if (activeTab !== value) {
                                onChangeSecondTabs(activeTab,value);
                            }
                            setActiveTab(value);

                        }}>
                        {value}
                    </button>

                ))}
            </div>
            <div className="grid grid-cols-5 rounded-lg bg-base-600 gap-x-2.5 gap-y-1 p-2.5 mt-2" style={{ display: activeTab === "total" ? 'block' : 'none' }}>
                <K3Picker1
                    currentThreeKingData={currentThreeKingData}
                    onPick={onPick}
                />
            </div>
            <div className="grid grid-cols-5 rounded-lg bg-base-600 gap-x-2.5 gap-y-1 p-2.5 mt-2" style={{ display: activeTab === "same2" ? 'block' : 'none' }}>
                <K3Picker2
                    onPick={onPick}
                    activeTab={activeTab}
                />
            </div>
            <div className="grid grid-cols-5 rounded-lg bg-base-600 gap-x-2.5 gap-y-1 p-2.5 mt-2" style={{ display: activeTab === "same3" ? 'block' : 'none' }}>
                <K3Picker3
                    onPick={onPick}
                    activeTab={activeTab}
                />
            </div>
            <div className="grid grid-cols-5 rounded-lg bg-base-600 gap-x-2.5 gap-y-1 p-2.5 mt-2" style={{ display: activeTab === "different" ? 'block' : 'none' }}>
                <K3Picker4
                    onPick={onPick}
                    activeTab={activeTab}
                />
            </div>
            <div
                className={clsx(
                    "absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center gap-8 bg-black/60",
                    opening && "hidden"
                )}
            >
                <span className="text-white text-center font-semibold leading-[1.2] rounded-xl bg-[#fd565c] text-[7.5rem] w-28 ">
                    {secondsLayout[0]}
                </span>
                <span className="text-white text-center font-semibold leading-[1.2] rounded-xl bg-[#fd565c] text-[7.5rem] w-28">
                    {secondsLayout[1]}
                </span>
            </div>
        </div>
    );
}