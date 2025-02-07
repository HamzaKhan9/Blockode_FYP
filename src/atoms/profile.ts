import { atom } from "jotai";
import { TableRow } from "../types/common";
import { GameInfo } from "../services/gameInfo";

type GamesInfo = {
  game_info: GameInfo[];
};

export const profileAtom = atom<(TableRow<"profiles"> & GamesInfo) | undefined>(
  undefined
);
