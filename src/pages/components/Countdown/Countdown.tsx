import { formatCountdown } from "@/utils/formatCountdown";
import clsx from "clsx";
import { Fragment, useMemo } from "react";

export const Countdown = ({
    seconds,
}: {
    seconds?: number;
}) => {
    const countdown = useMemo(() => {
        if (typeof seconds !== "number") return ["-", "-", ":", "-", "-"];
        const { m1, m2, s1, s2 } = formatCountdown(seconds);
        return [m1, m2, ":", s1, s2];
    }, [seconds]);
    return (
        <Fragment>
            {countdown.map((n, i) => (
                <span
                    key={i}
                    className={clsx(
                        "flex justify-center items-center text-[#f85050] font-bold text-lg bg-[#f2f2f2]",
                        i === 2
                            ? "w-3 h-7"
                            : "w-4 h-7",
                        i === 0 && "rounded-tl-lg",
                        i === 4 && "rounded-br-lg"
                    )}
                >
                    {n}
                </span>
            ))}
        </Fragment>
    );
};