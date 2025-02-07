import { useAtom } from "jotai";
import { profileAtom } from "../../atoms/profile";
import { clsMerge } from "../../utils/styleUtils";
import { GAME_IDS } from "../../constants/common";
import { useMemo } from "react";
import CircularProgressBar from "../CircularProgressBar";
interface GameCardProps {
  onClick?: (e: React.MouseEvent) => void;
  img: string;
  name: string;
  description?: string;
  enabled?: boolean;
  gameId: GAME_IDS;
}

function index({ onClick, img, name, description, enabled, gameId }: GameCardProps) {
  const [profile] = useAtom(profileAtom);
  const gameData = useMemo(() => profile?.game_info.find((info) => info.game_id === gameId), [profile, gameId]);

  const completionPercentage = useMemo(
    () =>
      gameData?.levels_completed &&
      (gameData.levels_completed.filter((level) => level === true).length / gameData.levels_completed.length) * 100,
    [gameData]
  );

  return (
    <div
      onClick={enabled ? onClick : undefined}
      className={clsMerge(
        `relative flex flex-col gap-3 items-center justify-center p-4 rounded-md shadow-md shadow-primary border-primary border-double border-4`,
        !enabled ? "opacity-50" : "cursor-pointer"
      )}
    >
      {enabled && profile ? (
        <div className="absolute top-3 right-3 w-16">
          <CircularProgressBar valueStart={0} valueEnd={completionPercentage || 0} duration={1.5} repeat={false} />
        </div>
      ) : null}
      <img src={img} alt="game" className="w-[100px] h-[100px]" />
      <h2 className="text-2xl font-heading text-primary">{name}</h2>
      <h4 className="text-center text-sm text-text">{description}</h4>
    </div>
  );
}

export default index;
