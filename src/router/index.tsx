import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/home";
import { lazy } from "react";
import Layout from "@/Layout";

const WinGo = lazy(() => import("../pages/wingo"));
const Racing = lazy(() => import("../pages/racing"));
const FiveDPage = lazy(() => import("../pages/5D"));
const TowerDPage = lazy(() => import("../pages/tower"));
const RingPage = lazy(() => import("../pages/ring"));
const CirclePage = lazy(() => import("../pages/circle"));
const StairsPage = lazy(() => import("../pages/stairs/StairsPage"));
const K3Page = lazy(() => import("../pages/K3/K3Page"));
const HiloPage = lazy(() => import("../pages/hilo/HiloPage"));
const CoinRecordHolderPage = lazy(() => import("../pages/CoinRecordHolder"));
// const Aviator = lazy(() => import("../pages/aviator/index.html"));

const SpacedicePage = lazy(() => import("../pages/spacedice/SpacedicePage"));

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/wingo" element={<WinGo />} />
          <Route path="/racing" element={<Racing />} />
          <Route path="/k3" element={<K3Page />} />
          <Route path="/5d" element={<FiveDPage />} />
          <Route path="/tower" element={<TowerDPage />} />
          <Route path="/ring" element={<RingPage />} />
          <Route path="/circle" element={<CirclePage />} />
          <Route path="/stairs" element={<StairsPage />} />
          <Route path="/spacedice" element={<SpacedicePage />} />
          <Route path="/hilo" element={<HiloPage />} />
          <Route path="/coinrecordholder" element={<CoinRecordHolderPage />} />
          {/* <Route path="/aviator" element={<Aviator />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
