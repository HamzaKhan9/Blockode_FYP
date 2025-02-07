import { useAtom } from "jotai";
import FunkyHeading from "../../components/FunkyHeading/FunkyHeading";
import CircularProgress from "../../components/CircularProgressBar";
import GameStats from "../../components/GameStats/";
import { profileAtom } from "../../atoms/profile";
import { useMemo } from "react";
import { DASHBOARD_GAMES } from "../../constants/common";

const index = () => {
  const [profile] = useAtom(profileAtom);
  const totalLevelsCompleted = useMemo(() => {
    return profile?.game_info.reduce((acc, info) => {
      if (!info?.levels_completed) return acc;
      return (
        acc + info.levels_completed.filter((level) => level === true).length
      );
    }, 0);
  }, [profile]);

  // const totalLevels = useMemo(() => {
  //   return profile?.game_info.reduce((acc, info) => {
  //     if (!info?.levels_completed) return acc;
  //     return acc + info.levels_completed.length;
  //   }, 0);
  // }, [profile]);

  // This need to be considered and changed later

  const totalLevels = useMemo(() => {
    return DASHBOARD_GAMES.reduce((acc, game) => {
      if (!game.enabled || !game.totalLevels) return acc;
      return acc + game.totalLevels;
    }, 0);
  }, []);

  const totalLevelsCompletedPercentage = useMemo(() => {
    if (!totalLevelsCompleted || !totalLevels) return 0;
    return (totalLevelsCompleted / totalLevels) * 100;
  }, [totalLevelsCompleted, totalLevels]);

  return (
    <div>
      <FunkyHeading className="pt-0 mt-4">My Stats</FunkyHeading>
      <div className="flex flex-col items-center p-4 my-8 w-full rounded-md shadow-md shadow-primary border-primary border-double border-4">
        <div className="w-60 font-heading">
          <CircularProgress
            valueEnd={totalLevelsCompletedPercentage || 0}
            duration={1.5}
            repeat={false}
            valueStart={0}
            strokeWidth={7}
            customText={`${totalLevelsCompleted || 0}/${totalLevels || 0} `}
          />
        </div>
        <h4 className="text-3xl font-heading text-primary">Total Score</h4>
      </div>
      <div className="flex flex-col gap-6">
        {DASHBOARD_GAMES.filter((game) => game.enabled).map((game) => {
          const gameData = useMemo(
            () => profile?.game_info.find((info) => info.game_id === game.id),
            [profile, game.id]
          );
          const levelsCompleted = useMemo(
            () =>
              gameData?.levels_completed?.filter((level) => level === true)
                .length || 0,
            [gameData]
          );

          return (
            <GameStats
              gameImage={game.img}
              gameName={game.name}
              gameProgress={
                (gameData?.levels_completed &&
                  (levelsCompleted / gameData.levels_completed.length) * 100) ||
                0
              }
              totalLevels={game.totalLevels || 0}
              totalLevelsCompleted={levelsCompleted}
            />
          );
        })}
      </div>
    </div>
  );
};

export default index;
