import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function PageTransitionWrapper({ children }) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    setTransitionStage("fadeOut");
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setTransitionStage("fadeIn");
    }, 80);
    return () => clearTimeout(timer);
  }, [location.pathname, children]);

  return (
    <div className={`page-transition-container ${transitionStage}`}>
      {displayChildren}
    </div>
  );
}
