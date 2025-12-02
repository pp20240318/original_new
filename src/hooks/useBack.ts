import { useCallback, useEffect, useState } from "react";
import type { Location } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

export function useBack() {
  const location = useLocation();
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<Location[]>([]);

  useEffect(() => {
    setRoutes((prev) => {
      const newRoutes = [...prev, location];
      return newRoutes;
    });
  }, [location]);

  const back = useCallback(
    (delta: number = 1) => {
      if (routes.length > delta) {
        navigate(routes[routes.length - delta]?.state?.from || "/");
        setRoutes((prev) => prev.slice(-delta));
      } else {
        navigate("/");
      }
    },
    [navigate, routes]
  );

  return { back, routes };
}
