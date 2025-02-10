//@ts-nocheck
import { useParams } from "react-router";
import { config } from "../../../constants/config/index";
import { useStateCallback } from "../../../hooks/useStateCallback";
import planeImage from "../../../assets/images/birdImages/plane.png";
import { useCallback, useState } from "react";
import { GetShape } from "./GetShape";
import { useEffect } from "react";
import { FaPlayCircle, FaStopCircle } from "react-icons/fa";
import {
  areBoxesColliding,
  distance,
  getQuadrilateralShape,
  translate,
} from "../../../utils/geometry";
import daySky from "../../../assets/images/birdImages/daySky.jfif";
import nightSky from "../../../assets/images/birdImages/nightSky.jfif";
import { degToRad } from "../../../utils/miscUtils";
import { useLocalStorage } from "usehooks-ts";
import LevelCompletionModal from "../../../components/LevelCompletionModal";
import { GAME_IDS } from "../../../constants/common";
import Scale from "../../../components/Scale";

interface Position {
  x: number;
  y: number;
}

interface BirdGameProps {
  code: string;
}

interface Path {
  point: Position;
  angle: number;
  type: string;
}

const collisionProvision = 40;
const boundaryProvision = -17;
const obstacleProvision = 4;
const velocity = 60;
const gridHeight = 300;
const gridWidth = 300;

const initalValues = {
  headingAngle: 0,
};

export const BirdGame = ({ code }: BirdGameProps) => {
  const { level = "1" } = useParams();
  const [planeDetails, setPlanedetails] = useState<any>(null);
  const { plane, airport, passenger, obstacles, targets, xml } =
    config.plane.levels[Number(level) - 1];
  const [planePosition, setPlanePosition] = useStateCallback<Position>({
    x: 0,
    y: 0,
  });
  const [headingAngle, setHeadingAngle] = useStateCallback<number>(0);
  const [isCollided, setIsCollided] = useStateCallback<boolean>(false);
  const [isEvaluationDone, setIsEvaluationDone] = useState<boolean>(false);
  const [collidedObject, setCollidedObject] = useStateCallback<any>(undefined);
  const [updatedPlaneCordinates, setUpdatedPlaneCordinates] = useStateCallback<
    Position[]
  >([...plane.cordinates]);
  const [collidedWithBoundary, setCollidedWithBoundary] =
    useStateCallback<boolean>(false);
  const [path, setPath] = useStateCallback<Path[]>([]);
  const [remTargets, setRemTargets] = useStateCallback<number>(targets || 2);
  const [isWin, setIsWin] = useStateCallback<boolean>(false);
  const [animationTime, setAnimationTime] = useState<number>(0);
  const [running, setRunning] = useStateCallback<boolean>(false);
  const [isPassengerPicked, setIsPassengerPicked] = useState<boolean>();
  const [isPassengerCollided, setIsPassengerCollided] = useState(false);
  const [showLevelCompletedModal, setShowLevelCompletedModal] = useState(false);
  const [isGameResetted, setGameResetted] = useStateCallback<boolean>(false);
  const [darkMode] = useLocalStorage<boolean | undefined>(
    "dark-mode",
    undefined
  );

  useEffect(() => {
    let planeDetails = getQuadrilateralShape(plane.cordinates);
    setPlanedetails({ ...planeDetails });
    setPlanePosition({ x: planeDetails.center.x, y: planeDetails.center.y });
    setPath([
      ...path,
      {
        point: { x: planeDetails.center.x, y: planeDetails.center.y },
        angle: 0,
        type: "plane",
      },
    ]);
  }, []);

  const updateAngle = useCallback((angle: number) => {
    return new Promise((resolve) => {
      setHeadingAngle(angle, () => {
        resolve("");
      });
    });
  }, []);

  const getHeadingAngle = useCallback(() => {
    return new Promise<number>((resolve) => {
      setHeadingAngle(((direction: number) => {
        resolve(direction);
        return direction;
      }) as any);
    });
  }, []);

  const getIsPassengerCollided = useCallback(() => {
    return new Promise<boolean>((resolve) => {
      setIsPassengerCollided(((status: boolean) => {
        resolve(status);
        return status;
      }) as any);
    });
  }, []);

  const getRemTargets = useCallback(() => {
    return new Promise<number>((resolve) => {
      setRemTargets(((targets: number) => {
        resolve(targets);
        return targets;
      }) as any);
    });
  }, []);

  const getResetStatus = useCallback(() => {
    return new Promise<boolean>((resolve) => {
      setGameResetted(((status: boolean) => {
        resolve(status);
        return status;
      }) as any);
    });
  }, []);

  const getWinStatus = useCallback(() => {
    return new Promise<boolean>((resolve) => {
      setIsWin(((status: boolean) => {
        resolve(status);
        return status;
      }) as any);
    });
  }, []);

  const getPaths = useCallback(() => {
    return new Promise<Path[]>((resolve) => {
      setPath(((paths: Path[]) => {
        resolve(paths);
        return paths;
      }) as any);
    });
  }, []);

  const getCollidedObjDetails = useCallback(() => {
    return new Promise((resolve) => {
      setCollidedObject(((details: any) => {
        resolve(details);
        return details;
      }) as any);
    });
  }, []);

  const getBoundaryCollidedStatus = useCallback(() => {
    return new Promise<boolean>((resolve) => {
      setCollidedWithBoundary(((status: boolean) => {
        resolve(status);
        return status;
      }) as any);
    });
  }, []);

  const getCollidedStatus = useCallback(() => {
    return new Promise<boolean>((resolve) => {
      setIsCollided(((status: boolean) => {
        resolve(status);
        return status;
      }) as any);
    });
  }, []);

  const getPlanePosition = useCallback((cordinate: string = "") => {
    return new Promise<Position>((resolve) => {
      setPlanePosition(((position: Position) => {
        resolve(cordinate ? position[cordinate.toLocaleLowerCase()] : position);
        return position;
      }) as any);
    });
  }, []);

  const checkCollisions = useCallback(() => {
    return new Promise(async (resolve) => {
      let updatedCordinates = await getUpdatedCordinates();

      const collidedWithPassenger = passenger
        ? areBoxesColliding(updatedCordinates, passenger.cordinates)
        : false;
      if (collidedWithPassenger) {
        setIsCollided(true);
        setIsPassengerCollided(true);
        setCollidedObject(passenger, () => {
          resolve("");
        });
        return;
      }

      const collidedWithAirport = areBoxesColliding(
        updatedCordinates,
        airport.cordinates
      );
      if (collidedWithAirport) {
        setIsCollided(true);
        setCollidedObject(airport, () => {
          resolve("");
        });
        return;
      }

      let collidedWithObstacle = false;
      for (let i = 0; i < obstacles.length; i++) {
        collidedWithObstacle = areBoxesColliding(
          updatedCordinates,
          obstacles[i].cordinates
        );
        if (collidedWithObstacle) {
          setIsCollided(true);
          setCollidedObject(obstacles[i], () => {
            resolve("");
          });
          return;
        }
      }

      resolve("");
    });
  }, []);

  const setPathPoint = useCallback(async (path: Path) => {
    return new Promise((resolve) => {
      setPath(
        ((prevPaths: Path[]) => {
          return [...prevPaths, path];
        }) as any,
        () => {
          resolve("");
        }
      );
    });
  }, []);

  const updateCordinates = useCallback(
    (distance: number = 2, angle?: number) => {
      return new Promise(async (resolve) => {
        const headingAngle = angle ?? (await getHeadingAngle());
        let { x: x1, y: y1 } = await getPlanePosition();
        const { x: x2, y: y2 } = translate(
          { x: x1, y: y1 },
          distance,
          headingAngle
        );
        setPlanePosition({ x: x2, y: y2 });
        setUpdatedPlaneCordinates(
          ((cordinates: Position[]) => {
            let updated: Position[] = [];
            cordinates.forEach((cor) => {
              cor.x = cor.x + distance * Math.cos(degToRad(headingAngle));
              cor.y = cor.y + distance * Math.sin(degToRad(headingAngle));
              updated.push({ x: cor.x, y: cor.y });
            });
            return updated;
          }) as any,
          () => {
            resolve("");
          }
        );
      });
    },
    []
  );

  const getUpdatedCordinates = useCallback(() => {
    return new Promise<Position[]>((resolve) => {
      setUpdatedPlaneCordinates(((cordinates: Position[]) => {
        resolve(cordinates);
        return cordinates;
      }) as any);
    });
  }, []);

  const move = useCallback(() => {
    return new Promise(async (resolve) => {
      let headingAngle = await getHeadingAngle();
      let { x: x1, y: y1 } = await getPlanePosition();
      let { x: x2, y: y2 } = translate({ x: x1, y: y1 }, 2, headingAngle);

      await updateCordinates();
      if (x2 >= gridWidth || y2 >= gridHeight || x2 <= 0 || y2 <= 0) {
        setCollidedWithBoundary(true);
        setIsCollided(true);
      }
      resolve("");
    });
  }, []);

  const animate = useCallback((path1: Path, path2: Path) => {
    return new Promise(async (resolve) => {
      //10px/s velocity
      if (await getResetStatus()) {
        return resolve();
      }
      let dis = distance(path1.point, path2.point);
      let time = dis / velocity;

      setHeadingAngle(path2.angle);
      setPlanePosition({ x: path2.point.x, y: path2.point.y });
      setAnimationTime(time);

      setTimeout(async () => {
        if (await getResetStatus()) {
          return resolve();
        }

        if (path2.type === "passenger") {
          setIsPassengerPicked(true);
        }
        resolve("");
      }, time * 1000);
    });
  }, []);

  const moveOutOfCollision = useCallback(async () => {
    let collidedObj: any = await getCollidedObjDetails();
    let isCollided = true;
    while (isCollided) {
      await updateCordinates();
      let cordinatesOfPlane = await getUpdatedCordinates();
      isCollided = areBoxesColliding(cordinatesOfPlane, collidedObj.cordinates);
    }
  }, []);

  const initAnimations = useCallback(async () => {
    let paths = await getPaths();
    let gameResetted;
    for (let n = 0; n <= paths.length - 2; n++) {
      gameResetted = await getResetStatus();
      if (gameResetted) break;
      await animate(paths[n], paths[n + 1]);
    }
  }, [path]);

  const reset = () => {
    if (!planeDetails) return;

    setGameResetted(true, () => {
      setIsWin(false);
      setAnimationTime(0);
      setCollidedObject(undefined);
      setIsCollided(false);
      setCollidedWithBoundary(false);
      setRemTargets(targets || 2);
      setPath([
        {
          point: { x: planeDetails.center.x, y: planeDetails.center.y },
          angle: 0,
          type: "plane",
        },
      ]);
      setUpdatedPlaneCordinates([...plane.cordinates]);
      setPlanePosition({ x: planeDetails.center.x, y: planeDetails.center.y });
      setIsPassengerPicked(false);
      setIsEvaluationDone(false);
      setRunning(false);
      setIsPassengerCollided(false);
    });
  };

  const checkIsGameOver = useCallback(async () => {
    let remTargets = await getRemTargets();
    let gameResetted = await getResetStatus();
    let winStatus = await getWinStatus();
    if (remTargets === 0 && !gameResetted && winStatus === true) {
      setShowLevelCompletedModal(true);
    }
  }, []);

  const runGame = useCallback(async () => {
    if (!planeDetails) return;

    setRunning(true);
    setGameResetted(false, async () => {
      let position = await getPlanePosition();
      let gameResetted = await getResetStatus();
      let lastAngle = await getHeadingAngle();
      let counter = 0;

      while (
        position.x >= 0 &&
        position.x <= gridWidth &&
        position.y >= 0 &&
        position.y <= gridHeight &&
        !gameResetted
      ) {
        eval(`(async()=>{
        ${code}
      })()`);
        counter++;
        await move();
        await checkCollisions();
        let currAngle = await getHeadingAngle();
        let collidedObject: any = await getCollidedObjDetails();
        let planePosition = await getPlanePosition();
        let collided = await getCollidedStatus();
        let remTargets = await getRemTargets();
        let isCollidedWithBoundary = await getBoundaryCollidedStatus();
        if (collided) {
          if (isCollidedWithBoundary) {
            await setPathPoint({
              point: translate(planePosition, boundaryProvision, currAngle),
              angle: currAngle,
              type: "boundary",
            });
            setCollidedWithBoundary(false);
            setIsCollided(false);
            break;
          }
          if (collidedObject) {
            await setPathPoint({
              point: translate(
                planePosition,
                collidedObject.type === "obstacle"
                  ? obstacleProvision
                  : collisionProvision,
                currAngle
              ),
              angle: currAngle,
              type: collidedObject.nature,
            });
            await updateCordinates(collisionProvision);
            if (collidedObject.type !== "target") {
              setCollidedObject(undefined);
              setIsCollided(false);
              break;
            } else {
              if (
                collidedObject.nature == "airport" &&
                passenger &&
                !(await getIsPassengerCollided())
              ) {
              } else setRemTargets(remTargets - 1);
              eval(`(async()=>{
                ${code}
              })()`);

              if (remTargets - 1 == 0) {
                setIsWin(true);
                setCollidedObject(undefined);
                setIsCollided(false);
                break;
              } else await moveOutOfCollision();
              setCollidedObject(undefined);
              setIsCollided(false);
            }
          }
        } else if (lastAngle !== currAngle && counter > 1) {
          await setPathPoint({
            point: translate(position, 0, lastAngle),
            angle: lastAngle,
            type: "imaginary",
          });
          await updateCordinates(0, lastAngle);
        }
        lastAngle = await getHeadingAngle();
        position = await getPlanePosition();
        gameResetted = await getResetStatus();
      }
      setPlanePosition({ x: planeDetails.center.x, y: planeDetails.center.y });
      setIsEvaluationDone(true);
      setHeadingAngle(0);
      gameResetted = await getResetStatus();
      if (!gameResetted) {
        await initAnimations();
        await checkIsGameOver();
      }
    });
  }, [code, updateAngle]);

  return (
    <>
      <div
        className="m-auto"
        style={{
          transform: "scale(0.92)",
        }}
      >
        <div
          className="bg-text relative overflow-hidden rounded"
          style={{
            height: gridHeight,
            width: gridWidth,
            backgroundImage: `url(${darkMode ? nightSky : daySky})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: darkMode ? "center" : "right top",
            backgroundSize: darkMode
              ? "cover"
              : `calc(${gridHeight}px + 225px)`,
          }}
        >
          {planeDetails ? (
            <div
              className="absolute"
              style={{
                left: !isEvaluationDone
                  ? planeDetails.center.x
                  : planePosition.x,
                bottom: !isEvaluationDone
                  ? planeDetails.center.y
                  : planePosition.y,
                transformOrigin: "top left",
                width: planeDetails.width,
                height: planeDetails.height,
                transition: `left ${animationTime}s linear, bottom ${animationTime}s linear`,
                transform: `translate(-50%,50%)`,
                objectFit: "fill",
                zIndex: "50",
              }}
            >
              <img
                src={planeImage}
                width="100%"
                style={{
                  transform: `rotate(${
                    !isEvaluationDone ? planeDetails.angle : 90 - headingAngle
                  }deg)`,
                }}
              />
            </div>
          ) : null}
          {!isPassengerPicked && passenger ? (
            <GetShape cordinates={passenger.cordinates} object="passenger" />
          ) : null}
          {obstacles.map((obstacle, ix) => {
            return <GetShape key={ix} cordinates={obstacle.cordinates} />;
          })}
          <GetShape cordinates={airport.cordinates} object="airport" />
          {xml ? (
            <>
              <Scale horizontal length={gridWidth} gap={50} />
              <Scale horizontal={false} length={gridHeight} gap={50} />{" "}
            </>
          ) : null}
        </div>

        <div
          className={`flex justify-center items-center gap-2 mt-2 text-[32px]`}
        >
          <div
            id="play-stop-button"
            className={`${running ? "text-danger" : "text-success"}`}
            onClick={running ? reset : runGame}
          >
            {running ? <FaStopCircle /> : <FaPlayCircle />}
          </div>
        </div>
      </div>
      <LevelCompletionModal
        open={showLevelCompletedModal}
        onClose={() => setShowLevelCompletedModal(false)}
        gameId={GAME_IDS.BIRD}
        level={+level}
      />
    </>
  );
};
