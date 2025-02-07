import FunkyHeading from "../FunkyHeading/FunkyHeading";
import { Link } from "react-router-dom";
import { clsMerge } from "../../utils/styleUtils";
import { GAME_IDS } from "../../constants/common";
import { profileAtom } from "../../atoms/profile";
import { useAtom } from "jotai";

interface LevelsScreenProps {
  totalLevels: number;
  gameId: GAME_IDS;
}

function LevelsScreen({ totalLevels, gameId }: LevelsScreenProps) {
  const [profile] = useAtom(profileAtom);
  const gameData = profile?.game_info.find((info) => info.game_id === gameId);
  const levels = Array.from({ length: totalLevels }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center w-full mt-4">
        <FunkyHeading className="p-0">Select Level</FunkyHeading>
      </div>
      <div className="grid grid-cols-2 gap-7 mt-10 max-w-[300px] w-[60%]">
        {levels.map((level, index) => (
          <Link to={`/games/${gameId}/levels/${level}`} key={index}>
            <div
              className={clsMerge(
                `bg-gradient-to-r border-8 border-double border-white p-4 rounded-xl text-center text-2xl font-heading`,
                gameData?.levels_completed?.[level - 1] // change this logic to see profile data with optional chaining
                  ? "from-success to-successDark"
                  : "from-primary to-primaryDark from-secondary to-secondaryDark dark:from-primary dark:to-primaryDark"
              )}
            >
              {level}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default LevelsScreen;
