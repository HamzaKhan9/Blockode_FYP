import { BIRD_LEVELS } from "../bird";
import { MAZE_LEVELS, MAZE_ON_BOARDING_STEPS } from "../maze";
import { TURTLE_LEVELS } from "../turtle";

export const config = {
  maze: {
    name: "Maze",
    levels: MAZE_LEVELS,
    onBoardingSteps: MAZE_ON_BOARDING_STEPS,
  },
  turtle: {
    name: "Turtle",
    levels: TURTLE_LEVELS,
  },
  plane: {
    name: "Plane",
    levels: BIRD_LEVELS,
  },
};

export const authRoutes = ["", "/", "/login"];
