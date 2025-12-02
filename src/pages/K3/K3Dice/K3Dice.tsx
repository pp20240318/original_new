import React, { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import K3DiceSvg from "./K3DiceSvg";
import K3DiceSvgB from "./K3DiceSvgB";
import { el } from "date-fns/locale";

function generateRandomGroups(): number[][] {
  const result: number[][] = [];
  const choices = [1, 2, 3, 4, 5, 6];

  for (let i = 0; i < 10; i++) {
    const group: number[] = [];
    for (let j = 0; j < 3; j++) {
      const randomIndex = Math.floor(Math.random() * choices.length);
      group.push(choices[randomIndex]);
    }
    result.push(group);
  }

  return result;
}

export default function K3Dice({
  lastResultNo,
  currOpendate,
}: {
  lastResultNo: number[] | undefined;
  currOpendate: string | undefined;
}) {
  const [realResultNo, setRealResultNo] = useState<number[] | undefined>(
    undefined
  );
  const [realResultNo2, setRealResultNo2] = useState<number[] | undefined>(
    undefined
  );
  const arr: number[] = [1, 2, 3];
  useEffect(() => {
    if (currOpendate) {
      console.log("lastResultNo", lastResultNo, currOpendate);
      // console.log(generateRandomGroups());
      setRealResultNo(lastResultNo);
      const groups = generateRandomGroups();
      let index = 0;

      const interval = setInterval(() => {
        setRealResultNo2(groups[index]);
        index++;
        if (index >= groups.length) {
          clearInterval(interval);
          setRealResultNo2(lastResultNo);
          // 循环结束后，realResultNo 已经是最后一组
          // console.log("最终值:", realResultNo);
        }
      }, 100);
    }
    else {
        setRealResultNo2([1,1,1]);
    }
  }, [currOpendate, lastResultNo]);

  return (
    <Fragment>
      <div className="relative bg-[#00b977] mx-2 p-2 rounded-lg">
        <div className="top-1/2 z-10 absolute -ml-4 -translate-y-1/2 transform">
          <K3DiceSvg />
        </div>
        <div className="top-1/2 z-10 absolute -ml-4 -translate-y-1/2 transform">
          <K3DiceSvgB />
        </div>
        <div className="top-1/2 right-0 z-10 absolute -mr-2 scale-x-[-1] -translate-y-1/2 transform">
          <K3DiceSvg />
        </div>
        <div className="top-1/2 right-0 z-10 absolute -mr-2 scale-x-[-1] -translate-y-1/2 transform">
          <K3DiceSvgB />
        </div>

        <div className="relative bg-[#003c26] p-2 rounded-md">
          <div className="flex justify-center items-center bg-[#002718] h-full">
            {realResultNo2 &&
              realResultNo2.map((num, index) => (
                <div
                  key={index}
                  className={`flex-grow rounded-md bg-[#727272] shadow-inner bg-cover bg-center bg-no-repeat m-1`}
                  style={{
                    aspectRatio: "1",
                    boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.3)",
                    backgroundImage: `url('/k3/num${num}.png')`,
                    backgroundSize: "70%",
                  }}
                ></div>
              ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
