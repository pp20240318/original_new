import { useEffect } from "react";
import { useViewport } from "@/hooks/useViewport";
import { useLocation } from "react-router-dom";

const scalePaths = ["/wingo", "/racing", "/k3", "/5d"];

export function ViewportObserver() {
  const { pathname } = useLocation();

  const viewport = useViewport();

  useEffect(() => {
    const { width, height } = viewport;
    if (scalePaths.includes(pathname) && width / height > 3 / 4) {
      document.body.style.maxWidth = height * 0.6625 + "px";
      document.body.style.marginLeft = "auto";
      document.body.style.marginRight = "auto";
      document.body.style.overflow = "hidden";
      document.documentElement.style.fontSize = (height * 16) / 667 + "px";
    } else {
      document.body.style.maxWidth = "";
      document.body.style.marginLeft = "";
      document.body.style.marginRight = "";
      document.body.style.overflow = "";
      document.documentElement.style.fontSize = scalePaths.includes(pathname)
        ? (width * 16) / 375 + "px"
        : "";
    }
  }, [pathname, viewport]);

  return null;
}
