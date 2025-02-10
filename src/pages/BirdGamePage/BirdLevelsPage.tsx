import LevelsScreen from "../../components/LevelsScreen/LevelsScreen";
import { DASHBOARD_GAMES, GAME_IDS } from "../../constants/common";

function BirdLevelsPage() {
  return (
    <LevelsScreen
      gameId={GAME_IDS.BIRD}
      totalLevels={
        DASHBOARD_GAMES.find((game) => game.id === GAME_IDS.BIRD)
          ?.totalLevels || 0
      }
    />
  );
}

export default BirdLevelsPage;
