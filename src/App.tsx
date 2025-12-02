import "@/locale/i18n";

import { Suspense } from "react";
import { useRequest } from "ahooks";
import { initParams } from "@/initparams";
import { AppConfigContext } from "@/appconfig";
import { getAppConfig } from "@/utils/getAppConfig";
import Router from "@/router";

function App() {
  const { data: appConfig } = useRequest(getAppConfig, {
    ready: !!initParams.site,
    defaultParams: [initParams.site!],
  });

  if (!appConfig) return null;
console.log("appConfig", appConfig);
  return (
    <AppConfigContext.Provider value={appConfig}>
      <Suspense fallback={<div>loading...</div>}>
        <Router />
      </Suspense>
    </AppConfigContext.Provider>
  );
}

export default App;
