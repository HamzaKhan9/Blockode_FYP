import { useState } from "react";
import { useEventListener, useIsomorphicLayoutEffect } from "usehooks-ts";

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  });

  const handleSize = () => {
    setWindowSize({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    });
  };

  useEventListener("resize", handleSize);
  useIsomorphicLayoutEffect(() => {
    handleSize();
  }, []);
  return windowSize;
}
export default useWindowSize;
