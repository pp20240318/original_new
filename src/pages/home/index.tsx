import { createToken } from "@/fetchers/k3";
import { useRequest } from "ahooks";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [K3Url, setK3Url] = useState<string>("");
  const { runAsync: createTokenRun } = useRequest(createToken, {
    manual: true,
  });
  const handelGoK3 = () => {
    createTokenRun({ agentId: "yyy", account: "yyy" }).then((res) => {
      const searchParams = new URLSearchParams(window.location.search);
      const site = searchParams.get("site");
      const type = searchParams.get("type");
      // window.location.origin
      const newUrl = `${window.location.origin}/k3?site=${site}&type=1&token=${res}`;

      // console.log("newUrl", newUrl);
      setK3Url(newUrl);
      //location.href = `https://www.k3cloud.com/game/k3/index.html?token=${res}`;

      // window.open(newUrl, "_blank");
    });
  };
  return (
    <div className="px-8 py-16">
      <h1 className="font-bold text-4xl text-center">Home</h1>

      <h2 className="mt-8 font-bold text-2xl text-center">Games List</h2>

      <ul className="space-y-4 mx-auto mt-8 max-w-2xl">
        <li className="text-center">
          <Link className="text-blue-500 hover:text-blue-700" to="/wingo">
            WinGo
          </Link>
        </li>
        <li className="text-center">
          <Link className="text-blue-500 hover:text-blue-700" to="/racing">
            Racing
          </Link>
        </li>
        <li className="text-center">
          <span
            className="text-blue-500 hover:text-blue-700"
            onClick={handelGoK3}
          >
            K3
          </span>
          <Link
            className="text-blue-500 hover:text-blue-700"
            to={K3Url}
            target="_blank"
          >
            K3
          </Link>
        </li>
        <li className="text-center">
          <Link className="text-blue-500 hover:text-blue-700" to="/5d">
            5D
          </Link>
        </li>
        <li className="text-center">
          <Link className="text-blue-500 hover:text-blue-700" to="/tower">
            Tower
          </Link>
        </li>
        <li className="text-center">
          <Link className="text-blue-500 hover:text-blue-700" to="/ring">
            Ring
          </Link>
        </li>
      </ul>
    </div>
  );
}
