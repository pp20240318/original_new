import { useAccountInfo } from "@/fetchers";
import { getLocal, setLocal } from "@/utils/localStorage";
import { RefObject, useState } from "react";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";
export default function Head({audioDi1Ref, audioDi2Ref}:{
    audioDi1Ref: RefObject<HTMLAudioElement>,
    audioDi2Ref: RefObject<HTMLAudioElement>
}) {
    const [mute, setMute] = useState(!!getLocal("wingo1Mute"));
    const { run: accountInfoRun, data: accountData } = useAccountInfo();
    return (
        <div className="relative flex items-center text-white">
            <div className="absolute top-0 left-0 right-0 bottom-0 -mx-2 -mt-4 -mb-12 rounded-b-3xl"></div>
            <h2 className="relative font-bold ml-2 mr-auto text-base">
                WinGo
            </h2>
            <span className="relative font-medium ml-4 text-sm">
                {accountData
                    ? (
                        accountData.balance + accountData.rescue_values[0]?.value
                    ).toFixed(3)
                    : 0}
            </span>
            <button
                className="relative ml-4 mr-2"
                onClick={() => {
                    setLocal("wingo1Mute", !mute);
                    setMute(!!getLocal("wingo1Mute"));
                }}
            >
                {/* <SpeakerXMarkIcon className="w-6 h-6 " /> */}
                {mute ? (
                    <SpeakerXMarkIcon className="max-2xs:w-6 max-2xs:h-6 2xs:w-8 2xs:h-8" />
                ) : (
                    <SpeakerWaveIcon className="max-2xs:w-6 max-2xs:h-6 2xs:w-8 2xs:h-8" />
                )}
            </button>
            <div className="hidden">
                <audio
                    ref={audioDi1Ref}
                    preload="auto"
                    src="/wingo/audio/di1.mp3"
                ></audio>
                <audio
                    ref={audioDi2Ref}
                    preload="auto"
                    src="/wingo/audio/di2.mp3"
                ></audio>
            </div>
        </div>
    );
}