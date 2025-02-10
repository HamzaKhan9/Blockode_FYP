import RenderLevelsScreen from "../../components/LevelsScreen/LevelsScreen";
import { DASHBOARD_GAMES, GAME_IDS } from "../../constants/common";

function TurtleLevelsPage() {
  return (
    <RenderLevelsScreen
      gameId={GAME_IDS.TURTLE}
      totalLevels={
        DASHBOARD_GAMES.find((game) => game.id === GAME_IDS.TURTLE)
          ?.totalLevels || 0
      }
    />
  );
}

export default TurtleLevelsPage;
