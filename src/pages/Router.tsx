import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MazeGamePage from "../pages/MazeGamePage/MazeGamePage";
import PageLayout, { AuthType } from "../layout/PageLayout";
import MazeLevelsPage from "../pages/MazeGamePage/MazeLevelsPage";
import DashboardPage from "../pages/DashboardPage/DashboardPage";
import Login from "./Login";
import Profile from "./Profile";
import Stats from "./Stats";
import { GAME_IDS } from "../constants/common";
import { ToastContainer } from "react-toastify";
import { useLocalStorage } from "usehooks-ts";
import AlertPopupModal from "../components/AlertPopup";
import "react-toastify/dist/ReactToastify.css";
import TurtleLevelsPage from "./TurtleGamePage/TurtleLevelsPage";
import TurtleGamePage from "./TurtleGamePage/TurtleGamePage";
import { WebviewLayout } from "../layout/WebviewLayout";
import BirdGamePage from "./BirdGamePage/BirdGamePage";
import BirdLevelsPage from "./BirdGamePage/BirdLevelsPage";
import StandaloneDelete from "./StandaloneDelete";
import Invitation from "./Invitation";

const router = createBrowserRouter([
  {
    path: `/games/${GAME_IDS.MAZE}/levels/:level`,
    element: (
      <PageLayout
        authType={AuthType.ONLY_AUTHENTICATED}
        showHeader={false}
        className="p-0"
      >
        <MazeGamePage />
      </PageLayout>
    ),
  },
  {
    path: `/games/${GAME_IDS.MAZE}/levels`,
    element: (
      <PageLayout authType={AuthType.ONLY_AUTHENTICATED} backLink="/">
        <MazeLevelsPage />
      </PageLayout>
    ),
  },
  //webview pages
  {
    path: `/games/webview/${GAME_IDS.TURTLE}/levels/:level`,
    element: (
      <WebviewLayout showHeader={false} className="p-0">
        <TurtleGamePage showHeader={false} />
      </WebviewLayout>
    ),
  },
  {
    path: `/games/webview/${GAME_IDS.BIRD}/levels/:level`,
    element: (
      <WebviewLayout showHeader={false} className="p-0">
        <BirdGamePage showHeader={false} />
      </WebviewLayout>
    ),
  },
  {
    path: `/games/webview/${GAME_IDS.MAZE}/levels/:level`,
    element: (
      <WebviewLayout showHeader={false} className="p-0">
        <MazeGamePage showHeader={false} />
      </WebviewLayout>
    ),
  },
  {
    path: `/games/${GAME_IDS.TURTLE}/levels/:level`,
    element: (
      <PageLayout
        authType={AuthType.ONLY_AUTHENTICATED}
        showHeader={false}
        className="p-0"
      >
        <TurtleGamePage />
      </PageLayout>
    ),
  },
  {
    path: `/games/${GAME_IDS.BIRD}/levels/:level`,
    element: (
      <PageLayout
        authType={AuthType.ONLY_AUTHENTICATED}
        showHeader={false}
        className="p-0"
      >
        <BirdGamePage />
      </PageLayout>
    ),
  },
  {
    path: `/games/${GAME_IDS.TURTLE}/levels`,
    element: (
      <PageLayout authType={AuthType.ONLY_AUTHENTICATED} backLink="/">
        <TurtleLevelsPage />
      </PageLayout>
    ),
  },
  {
    path: `/games/${GAME_IDS.BIRD}/levels`,
    element: (
      <PageLayout authType={AuthType.ONLY_AUTHENTICATED} backLink="/">
        <BirdLevelsPage />
      </PageLayout>
    ),
  },
  {
    path: "/login",
    element: (
      <PageLayout authType={AuthType.ONLY_UNAUTHENTICATED} backLink>
        <Login />
      </PageLayout>
    ),
  },
  {
    path: "/my-stats",
    element: (
      <PageLayout authType={AuthType.ONLY_AUTHENTICATED} backLink>
        <Stats />
      </PageLayout>
    ),
  },
  {
    path: "/my-profile",
    element: (
      <PageLayout authType={AuthType.ONLY_AUTHENTICATED} backLink>
        <Profile />
      </PageLayout>
    ),
  },
  {
    path: "/invitation",
    element: (
      <PageLayout authType={AuthType.ONLY_AUTHENTICATED}>
        <Invitation />
      </PageLayout>
    ),
  },
  {
    path: "/delete-account",
    element: (
      <PageLayout authType={AuthType.NONE}>
        <StandaloneDelete />
      </PageLayout>
    ),
  },

  {
    path: "/",
    element: (
      <PageLayout authType={AuthType.NONE}>
        <DashboardPage />
      </PageLayout>
    ),
  },
]);

const Router = () => {
  const [darkMode] = useLocalStorage<boolean | undefined>(
    "dark-mode",
    undefined
  );

  return (
    <div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />
      <AlertPopupModal />
      <RouterProvider router={router} />
    </div>
  );
};

export default Router;
