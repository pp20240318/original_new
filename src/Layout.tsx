import { Outlet } from "react-router-dom";
import { useFavicon, useTitle } from "ahooks";
import { useAppConfig } from "./appconfig";
import { ViewportObserver } from "./components/ViewportObserver";
import SocketDemo from "./socket/SocketDemo";

export default function Layout() {
  const { TITLE, ASSETS_URL, FAVICON } = useAppConfig();

  useTitle(TITLE);

  useFavicon(ASSETS_URL + FAVICON);

  return (
    <>
      <ViewportObserver />
      <Outlet />
    </>
  );
}
