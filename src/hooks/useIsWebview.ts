import { useLocation } from "react-router-dom";

export const useIsWebview = () => {
  let webview = false;
  const location = useLocation();
  if (location.pathname.includes("webview")) webview = true;
  return [webview];
};
