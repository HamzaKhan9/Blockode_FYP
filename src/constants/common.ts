import mazeImg from "../assets/images/dashboardImages/maze.png";
// import puzzleImg from "../assets/images/dashboardImages/puzzle.png";
import planeImg from "../assets/images/dashboardImages/plane.png";
import turtleImg from "../assets/images/dashboardImages/turtle.png";
import movieImg from "../assets/images/dashboardImages/movie.png";
import musicImg from "../assets/images/dashboardImages/music.png";
import pondTutorImg from "../assets/images/dashboardImages/pond-tutor.png";
import pondDuckImg from "../assets/images/dashboardImages/pond-duck.png";

export enum GAME_IDS {
  MAZE = "maze",
  PUZZLE = "puzzle",
  BIRD = "plane",
  TURTLE = "turtle",
  MOVIE = "movie",
  MUSIC = "music",
  POND_TUTOR = "pond-tutor",
  POND = "pond",
}
export const DASHBOARD_GAMES = [
  {
    name: "Maze",
    img: mazeImg,
    description:
      "Try your hand at this puzzle. Stack the purple blocks together to move robot on green space to the red location bubble.",
    enabled: true,
    id: GAME_IDS.MAZE,
    totalLevels: 10,
  },
  {
    name: "Plane",
    img: planeImg,
    description:
      "Soar through the skies and drop passengers to the target destination by coding your plane's flight path using the intuitive drag-and-drop interface.",
    enabled: false,
    id: GAME_IDS.BIRD,
    totalLevels: 10,
  },
  {
    name: "Turtle",
    img: turtleImg,
    description:
      "Dive into a creative coding adventure as you guide a virtual turtle through challenges, drawing colorful patterns and mastering programming concepts along the way.",
    enabled: false,
    id: GAME_IDS.TURTLE,
    totalLevels: 10,
  },
  {
    name: "Movie",
    img: movieImg,
    description:
      "Direct your own digital blockbuster by coding characters, animations, and scenes in this interactive storytelling game powered by drag-and-drop programming.",
    enabled: false,
    id: GAME_IDS.MOVIE,
  },
  {
    name: "Music",
    img: musicImg,
    description:
      "Create melodic masterpieces and explore the world of music composition through coding, using drag-and-drop blocks to compose rhythms, melodies, and harmonies",
    enabled: false,
    id: GAME_IDS.MUSIC,
  },
  {
    name: "Pond Tutor",
    img: pondTutorImg,
    description:
      "Dive into a fun educational adventure as you learn programming concepts by helping adorable virtual creatures navigate challenges in a tranquil pond environment.",
    enabled: false,
    id: GAME_IDS.POND_TUTOR,
  },
  {
    name: "Pond",
    img: pondDuckImg,
    description:
      "Immerse yourself in a serene digital pond where you guide charming creatures through puzzles and obstacles, using coding blocks to unlock a world of aquatic wonders.",
    enabled: false,
    id: GAME_IDS.POND,
  },
];

export const EMPLOYMENT_STATUS = [
  "Student K-12",
  "Employed Adult 18+",
  "Unemployed",
];
