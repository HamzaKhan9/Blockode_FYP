import RenderLevelsScreen from "../../components/LevelsScreen/LevelsScreen";
import { GAME_IDS } from "../../constants/common";
import { config } from "../../constants/config";

function MazeLevelsPage() {
  return (
    <RenderLevelsScreen
      gameId={GAME_IDS.MAZE}
      totalLevels={config.maze.levels.length}
    />
  );
}

export default MazeLevelsPage;
