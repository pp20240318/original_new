"use client";

import { WinGoGameCodeEnum } from "@/pages/wingo/types";
import clsx from "clsx";
import { useTranslation } from "react-i18next";



export function GameCodeSelection({
    gameCodes, 
    gameCodeSelectHandler,
    currentGameCode,
    translationPrefix,
}: {
    gameCodes: string[],
    gameCodeSelectHandler: (gameCode: string) => void,
    currentGameCode: string,
    translationPrefix: string,
}) {
    const { t } = useTranslation();
    return (
        <div className="relative flex mt-4 rounded-xl bg-base-900">
            {gameCodes.map((item) => (
                <span
                    key={item}
                    className={clsx(
                        "cursor-pointer flex justify-center items-center font-semibold w-1/3 px-1 py-4 rounded-lg text-xs",
                        item === currentGameCode
                            ? "text-white shadow-[inset_0_0_8px_#fd565c] bg-gradient-to-b from-[#fd565c] to-[#fd565c]/50"
                            : "text-base-400"
                    )}
                    onClick={() => gameCodeSelectHandler(item)}
                >
                    {t(`${translationPrefix}${item}`)}
                </span>
            ))}
        </div>
    )
}