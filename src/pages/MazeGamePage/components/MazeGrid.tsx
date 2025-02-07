import { useState, useCallback, useMemo, useEffect } from "react";
import avatarRight from "../../../assets/images/mazeImages/pegman_right.png";
import avatarLeft from "../../../assets/images/mazeImages/pegman_left.png";
import avatarUp from "../../../assets/images/mazeImages/pegman_up.png";
import avatarDown from "../../../assets/images/mazeImages/pegman_down.png";
import marker from "../../../assets/images/mazeImages/marker.png";
import { dispatchMessage, findIndexIn2D } from "../../../utils/miscUtils";
import { useStateCallback } from "../../../hooks/useStateCallback";
import LevelCompletionModal from "../../../components/LevelCompletionModal/index";
import { GAME_IDS } from "../../../constants/common";
import { useParams } from "react-router-dom";
import { FaPlayCircle, FaStopCircle } from "react-icons/fa";
import { AVATAR_TRANISTION_DELAY, MAZE_LEVELS } from "../../../constants/maze";
import useWindowSize from "../../../hooks/useWindowSize";
import { clsMerge } from "../../../utils/styleUtils";
import { useIsWebview } from "../../../hooks/useIsWebview";

type MazeGridProps = {
  code: string;
};

type AvatarLocation = {
  x: number;
  y: number;
};

enum AvatarDirection {
  left = 0,
  up = 1,
  right = 2,
  down = 3,
}

enum MapCellType {
  wall = 0,
  path = 1,
  start = 2,
  end = 3,
}

const avatarImages = [avatarLeft, avatarUp, avatarRight, avatarDown];

export const MazeGrid = ({ code }: MazeGridProps) => {
  const { level = 1 } = useParams();
  const map = MAZE_LEVELS[Number(level) - 1].map;
  const { height, width } = useWindowSize();
  const [isWebView] = useIsWebview();
  const gridSize = Math.min(height * 0.5 - 100, 480, width - 48);
  const cellSize = gridSize / map[0].length;

  const [location, setLocation] = useStateCallback(
    findIndexIn2D(MapCellType.start, map)
  );
  const [direction, setDirection] = useStateCallback<number>(
    AvatarDirection.right
  );
  const [running, setRunning] = useStateCallback<boolean>(false);
  const [showLevelCompletedModal, setShowLevelCompletedModal] = useState(false);

  // functions used by eval to execute code
  const getLocation = useCallback(() => {
    return new Promise((resolve) => {
      setLocation(((location: AvatarLocation) => {
        resolve(location);
        return location;
      }) as any);
    });
  }, []);

  const getDirection = useCallback(() => {
    return new Promise((resolve) => {
      setDirection(((direction: AvatarDirection) => {
        resolve(direction);
        return direction;
      }) as any);
    });
  }, []);

  const isGameOver = useCallback(async () => {
    const currLocation = (await getLocation()) as AvatarLocation;
    return new Promise((resolve) => {
      resolve(map?.[currLocation.x]?.[currLocation.y] === MapCellType.end);
    });
  }, [map, getLocation]);

  const isDone = useCallback(() => {
    return new Promise(async (resolve) => {
      const gameOver = await isGameOver();
      setRunning(((running: boolean) => {
        resolve(gameOver || !running);
        return running;
      }) as any);
    });
  }, [map]);

  const isPathForward = useCallback(() => {
    return new Promise((resolve) => {
      setDirection(((direction: AvatarDirection) => {
        setLocation(((location: AvatarLocation) => {
          let nextCell: MapCellType;
          switch (direction) {
            case AvatarDirection.left:
              nextCell = map?.[location.x]?.[location.y - 1];
              break;
            case AvatarDirection.up:
              nextCell = map?.[location.x - 1]?.[location.y];
              break;
            case AvatarDirection.right:
              nextCell = map?.[location.x]?.[location.y + 1];
              break;
            case AvatarDirection.down:
              nextCell = map?.[location.x + 1]?.[location.y];
              break;
          }
          resolve(!!nextCell); // not undefined or a wall (0)
          return location;
        }) as any);
        return direction;
      }) as any);
    });
  }, [map]);

  const isPathLeft = useCallback(() => {
    return new Promise((resolve) => {
      setDirection(((direction: AvatarDirection) => {
        setLocation(((location: AvatarLocation) => {
          let nextCell: MapCellType;
          switch (direction) {
            case AvatarDirection.left:
              nextCell = map?.[location.x + 1]?.[location.y];
              break;
            case AvatarDirection.up:
              nextCell = map?.[location.x]?.[location.y - 1];
              break;
            case AvatarDirection.right:
              nextCell = map?.[location.x - 1]?.[location.y];
              break;
            case AvatarDirection.down:
              nextCell = map?.[location.x]?.[location.y + 1];
              break;
          }
          resolve(!!nextCell); // not undefined or a wall (0)
          return location;
        }) as any);
        return direction;
      }) as any);
    });
  }, [map]);

  const isPathRight = useCallback(() => {
    return new Promise((resolve) => {
      setDirection(((direction: AvatarDirection) => {
        setLocation(((location: AvatarLocation) => {
          let nextCell: MapCellType;
          switch (direction) {
            case AvatarDirection.left:
              nextCell = map?.[location.x - 1]?.[location.y];
              break;
            case AvatarDirection.up:
              nextCell = map?.[location.x]?.[location.y + 1];
              break;
            case AvatarDirection.right:
              nextCell = map?.[location.x + 1]?.[location.y];
              break;
            case AvatarDirection.down:
              nextCell = map?.[location.x]?.[location.y - 1];
              break;
          }
          resolve(!!nextCell); // not undefined or a wall (0)
          return location;
        }) as any);
        return direction;
      }) as any);
    });
  }, [map]);

  const moveForward = useCallback(() => {
    return new Promise(async (resolve) => {
      const isPath = await isPathForward();
      if (!isPath) {
        //TODO: Add path blocked simulation here
        return resolve("");
      }

      setDirection(((direction: AvatarDirection) => {
        setLocation(
          ((location: AvatarLocation) => {
            switch (direction) {
              case AvatarDirection.left:
                return { x: location.x, y: location.y - 1 };
              case AvatarDirection.up:
                return { x: location.x - 1, y: location.y };
              case AvatarDirection.right:
                return { x: location.x, y: location.y + 1 };
              case AvatarDirection.down:
                return { x: location.x + 1, y: location.y };
            }
          }) as any,
          () => setTimeout(resolve, AVATAR_TRANISTION_DELAY + 200)
        );
        return direction;
      }) as any);
    });
  }, []);

  const turnLeft = useCallback(async () => {
    return new Promise((resolve) => {
      setDirection(
        ((direction: number) => {
          if (direction === AvatarDirection.left) {
            return AvatarDirection.down;
          }

          return direction - 1;
        }) as any,
        () => setTimeout(resolve, AVATAR_TRANISTION_DELAY + 200)
      );
    });
  }, []);

  const turnRight = useCallback(() => {
    return new Promise((resolve) => {
      setDirection(
        ((direction: number) => {
          if (direction === AvatarDirection.down) {
            return AvatarDirection.left;
          }

          return direction + 1;
        }) as any,
        () => setTimeout(resolve, AVATAR_TRANISTION_DELAY + 200)
      );
    });
  }, []);

  const resetGame = useCallback(() => {
    setLocation(findIndexIn2D(MapCellType.start, map));
    setDirection(AvatarDirection.right);
    setRunning(false);
    setShowLevelCompletedModal(false);
  }, [map]);

  const onGameOver = useCallback(() => {
    if (!isWebView) setShowLevelCompletedModal(true);
    else dispatchMessage("game-ended");
  }, [resetGame, isWebView]);

  const handleCodeExecution = useCallback(() => {
    setRunning(true, () => {
      eval(`
      (async () => {
        ${code}
        if (await isGameOver()) onGameOver();
      })()
    `);
    });
  }, [code]);

  // to force typescript have no unused variable error
  useMemo(
    () => [
      isGameOver,
      isDone,
      isPathForward,
      isPathLeft,
      isPathRight,
      moveForward,
      turnLeft,
      turnRight,
      onGameOver,
    ],
    []
  );

  useEffect(() => {
    getDirection();
  }, []);

  return (
    <>
      <div
        style={{ height: 0.5 * height - 54 }}
        className="flex flex-col justify-center items-center w-screen sm:text-[12px]"
      >
        <div className="border-8 border-primary rounded-lg relative mt-1">
          {(map || []).map((row, i) => {
            return (
              <div className="flex justify-center" key={i}>
                {row.map((col, j) => {
                  return (
                    <div
                      className={clsMerge(
                        `border border-bgFirst`,
                        map?.[i]?.[j] === MapCellType.wall
                          ? "bg-secondaryDark"
                          : "bg-primaryLight"
                      )}
                      style={{
                        height: cellSize,
                        width: cellSize,
                      }}
                      key={`${j}${col}`}
                    >
                      {map?.[i]?.[j] === MapCellType.end && (
                        <img
                          id="marker"
                          style={{
                            objectFit: "contain",
                            height: `calc(${cellSize}px - 0.2vh)`,
                            aspectRatio: "1/1",
                            top: "-45%",
                            position: "relative",
                          }}
                          src={marker}
                          alt="marker"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
          {avatarImages.map((img, ix) => (
            <img
              key={ix}
              src={img}
              alt="avatar"
              className={`absolute z-10 transition-all duration-${AVATAR_TRANISTION_DELAY} ease-in`}
              style={{
                left: location.y * cellSize - height * 0.0045,
                top: location.x * cellSize - height * 0.004,
                objectFit: "contain",
                height: `calc(${cellSize}px + 0.8vh)`,
                aspectRatio: "1/1",
                opacity: ix === direction ? 1 : 0,
              }}
            />
          ))}
        </div>
        <div
          className={`flex justify-center items-center gap-2 mt-2 text-[32px]`}
          style={{ width: gridSize + 16 }}
        >
          <div
            id="play-stop-button"
            className={`cursor-pointer ${
              running ? "text-danger" : "text-success"
            }`}
            onClick={running ? resetGame : handleCodeExecution}
          >
            {running ? <FaStopCircle /> : <FaPlayCircle />}
          </div>
        </div>
      </div>

      <LevelCompletionModal
        open={showLevelCompletedModal}
        onClose={() => setShowLevelCompletedModal(false)}
        gameId={GAME_IDS.MAZE}
        level={+level}
      />
    </>
  );
};

export default MazeGrid;
