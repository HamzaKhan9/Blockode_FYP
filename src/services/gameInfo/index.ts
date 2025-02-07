import { MAZE_LEVELS } from "../../constants/maze";
import { TableRow } from "../../types/common";
import { supabase } from "../supabase";

export type GameInfo = TableRow<"game_info">;

const upsert = (
  record: Partial<GameInfo> & {
    profile_id: GameInfo["profile_id"];
    game_id: GameInfo["game_id"];
  }
) => {
  const { id } = record;
  const data = id
    ? record
    : {
        levels_completed: MAZE_LEVELS.map(() => false),
        durations: MAZE_LEVELS.map(() => 0),
        onboarding_completed: false,
        ...record,
      };

  const ref = supabase.from("game_info");

  const promise = id ? ref.upsert(data) : ref.insert(data);
  return promise.select().then(({ data }) => data![0]);
};

const GameInfoService = {
  upsert,
};

export default GameInfoService;
