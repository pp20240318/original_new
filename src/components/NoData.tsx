import { CubeTransparentIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useTranslation } from "react-i18next";

export default function NoData({ title = "No Data" }: { title?: string }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center w-full p-8">
      <CubeTransparentIcon className="text-base-600 w-24 h-24" />
      <span className="text-base text-base-500 font-medium mt-4">{title}</span>
    </div>
  );
}
