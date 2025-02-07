import ReactDOM from "react-dom/client";
import "./index.css";
import Router from "./pages/Router.tsx";
import Analytics from "./analytics.ts";

Analytics.init();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Router />
);
