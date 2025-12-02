import { CSSProperties, useEffect, useMemo, useState } from "react";

export function useViewport() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const ratio = useMemo(() => {
    return width / height > 3 / 4 ? (height * 0.5625) / 375 : width / 375;
  }, [width, height]);

  const rootStyle = useMemo<CSSProperties>(() => {
    return width / height > 3 / 4
      ? {
          maxWidth: height * 0.5625 + "px",
          marginLeft: "auto",
          marginRight: "auto",
          overflow: "hidden",
        }
      : {
          maxWidth: "",
          marginLeft: "",
          marginRight: "",
          overflow: "",
        };
  }, [width, height]);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { width, height, ratio, rootStyle };
}
