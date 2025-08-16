import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const GA_MEASUREMENT_ID = "G-WGQ6C6VVQ1"; // <-- Replace with your GA4 ID

const Analytics = () => {
  const location = useLocation();
  const firstLoad = useRef(true);

  useEffect(() => {
    if (typeof window.gtag === "function") {
      if (firstLoad.current) {
        // On first load, send initial page_view
        window.gtag("config", GA_MEASUREMENT_ID, {
          page_path: location.pathname + location.search,
        });
        firstLoad.current = false;
      } else {
        // On route change, send page_view
        window.gtag("event", "page_view", {
          page_path: location.pathname + location.search,
        });
      }
    }
  }, [location]);

  return null;
};

export default Analytics;


