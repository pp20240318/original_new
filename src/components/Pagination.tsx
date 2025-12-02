"use client";

import { useEffect, useMemo, useState } from "react";
import { UxButton, UxOption, UxSelect } from "../../ui";
import { useTranslation } from "react-i18next";

export function Pagination({
  current,
  size = 10,
  total,
  onChange,
}: {
  current?: number;
  size?: number;
  total?: number;
  onChange?: (page: number) => void;
}) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  const pageList = useMemo(() => {
    if (!total) return [];
    const pages = Math.ceil(total / size);
    return new Array(pages).fill(0).map((_, i) => i + 1);
  }, [total, size]);

  useEffect(() => {
    if (typeof current === "undefined") return;
    current =
      current < 1
        ? 1
        : pageList.length && current > pageList.length
        ? pageList.length
        : current;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    current !== currentPage && setCurrentPage(current);
  }, [current, pageList]);

  const onPageStep = (step: number) => {
    const page = currentPage + step;
    setCurrentPage(page);
    onChange?.(page);
  };

  const onPageSelect = (page?: number) => {
    if (typeof page === "undefined") return;
    setCurrentPage(page);
    onChange?.(page);
  };

  return (
    typeof total === "number" &&
    total > 0 && (
      <div className="flex justify-center gap-4 mt-4">
        <UxButton
          type="info"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageStep(-1)}
        >
          {t("common_prev")}{" "}
        </UxButton>
        <UxSelect
          className="w-20"
          textClass="text-center"
          value={currentPage}
          render={currentPage}
          onChange={onPageSelect}
        >
          {pageList.map((page) => (
            <UxOption
              className="text-center !px-2"
              key={page}
              value={page}
              label={page}
            />
          ))}
        </UxSelect>
        <UxButton
          type="info"
          size="sm"
          disabled={currentPage >= pageList.length}
          onClick={() => onPageStep(1)}
        >
          {t("common_next")}{" "}
        </UxButton>
      </div>
    )
  );
}
