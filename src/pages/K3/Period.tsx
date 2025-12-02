import React, { Dispatch, SetStateAction } from "react";
import { DocumentTextIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import { Countdown } from "../components/Countdown/Countdown";
import { tr } from "date-fns/locale";

export default function Period({
    seconds,
    currOpendate,
    setOpen,
    // drawing,
    // drawResult,
    // gameCode,
    // onOpenRule,
}: {
    seconds?: number;
    currOpendate: string | undefined;
    setOpen: Dispatch<SetStateAction<boolean>>;
    // drawing: boolean;
    // drawResult?: WinGoLatestResultData | null;
    // gameCode: WinGoGameCodeEnum;
    // onOpenRule: () => void;
}) {
    const { t } = useTranslation();
    const onOpenRule = () => {
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
    };
    return (
        <Fragment>
            <div className="my-3 h-6">
                <div className="flex float-left">
                    <span className="font-semibold text-3xs leading-6 pr-2">Period</span>
                    <button
                        className="flex justify-center items-center text-white border border-white rounded-full py-1 px-2"
                        onClick={() => setOpen(true)}
                    >
                        <DocumentTextIcon className="w-3 h-3 " />
                        <span className="ml-1 font-medium text-3xs ">{t`wingo1_how_to_play`}</span>
                    </button>
                </div>
                <span className="text-white font-semibold text-3xs float-right leading-6">{t`wingo1_time_remaining`}</span>
            </div>
            <div className="flex justify-between pb-2">
                <span className="text-xs">{currOpendate}</span>
                <div className="flex gap-1 text-3xs">
                    <Countdown seconds={seconds}></Countdown>
                </div>
            </div>
        </Fragment>
    );
}