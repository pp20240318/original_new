import clsx from "clsx";
import { bigOrSmallTypes, oddOrEvenTypes, K3BetType, K3OddsData, K3Gameplay } from "../types";

export default function K3Picker1(
    {
        currentThreeKingData,
        onPick,
    }: {
        currentThreeKingData?: DCurrentThreeKingData;
        onPick: (value: K3OddsData) => void;
    }
) {
    const balls: number[] = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
    return (
        <>
            <div className="w-full grid grid-cols-4 gap-px">
                {balls.map((tab, index) => {
                    const isOdd = index % 2 === 1; // 判断当前索引是否为奇数
                    return (
                        <div key={index} className="text-center my-2 cursor-pointer"
                            onClick={() => onPick({
                                type: K3BetType.Total.toString(),
                                value: [tab.toString()],
                            } as K3OddsData)}
                        >
                            <div
                                className={clsx(
                                    "bg-contain bg-center bg-no-repeat  font-bold justify-center content-center text-2xl mx-auto",
                                    isOdd &&
                                    "text-[#18b660]",
                                    !isOdd &&
                                    "text-[#eb3a39]"
                                )}

                                style={{
                                    backgroundImage: isOdd ? 'url(/k3/greenBall.png)' : 'url(/k3/redBall.png)',
                                    width: '70%', // 设置宽度为 80%
                                    aspectRatio: '1 / 1', // 确保元素是正方形
                                }}
                            >{tab}
                            </div>
                            <span className="text-xs text-center">
                                {currentThreeKingData && currentThreeKingData.items.filter((item) => item.type === "Total" && item.value === tab.toString())[0]?.rate}
                            </span>
                        </div>
                    )
                })}
            </div>
            <div className="w-full grid grid-cols-4 gap-1">
                {Object.entries(bigOrSmallTypes).map(([key, value], index) => (
                    <button key={key}
                        className={clsx(
                            "rounded-sm text-white font-bold-medium text-xs text-center w-full py-1",
                            index === 0 && "bg-[#feaa57]",
                            index === 1 && "bg-[#6ea8f4]",
                        )}
                        onClick={() => onPick({
                            type: K3BetType.BigOrSmall.toString(),
                            value: [value.toString()],
                        } as K3OddsData)}
                    >
                        {value}
                        <br />
                        {currentThreeKingData && currentThreeKingData.items.filter((item) => item.value.toLowerCase() === key.toLowerCase())[0]?.rate}
                    </button>
                ))}
                {Object.entries(oddOrEvenTypes).map(([key, value], index) => (
                    <button key={key}
                        className={clsx(
                            "rounded-sm text-white font-bold-medium text-xs text-center w-full py-1",
                            index === 0 && "bg-[#fb5b5b]",
                            index === 1 && "bg-[#18b660]",
                        )}
                        onClick={() => onPick({
                            type: K3BetType.OddOrEven.toString(),
                            value: [value.toString()],
                        } as K3OddsData)}
                    >
                        {value}
                        <br />
                        {currentThreeKingData && currentThreeKingData.items.filter((item) => item.value.toLowerCase() === key.toLowerCase())[0]?.rate}
                    </button>
                ))}
            </div>
        </>
    );
}