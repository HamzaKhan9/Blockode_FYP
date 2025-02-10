import { useCallback, useRef, useEffect, useState, useMemo } from "react";
import { Stage, Layer, Line, Circle, Arrow } from "react-konva";
import { useStateCallback } from "../../../hooks/useStateCallback";
import {
  degToRad,
  dispatchMessage,
  normalizeAngle,
} from "../../../utils/miscUtils";
import { config } from "../../../constants/config";
import { useParams } from "react-router-dom";
import { FaPlayCircle, FaStopCircle } from "react-icons/fa";
import MatchCanvas from "./MatchCanvas";
import LevelCompletionModal from "../../../components/LevelCompletionModal";
import { GAME_IDS } from "../../../constants/common";
import { useLocalStorage } from "usehooks-ts";
import { useIsWebview } from "../../../hooks/useIsWebview";

interface TurtleCanvaProps {
  code: string;
  animationSpeed: number;
}

export interface LinePoints {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface CanvasLinePoints {
  points: LinePoints;
  strokeColor: string;
}

interface PenPosition {
  x: number;
  y: number;
}

const TurtleCanva = ({ code, animationSpeed }: TurtleCanvaProps) => {
  const answerRef = useRef<any>(null);
  const drawingRef = useRef<any>(null);
  const { level = "1" } = useParams();
  const [isWebView] = useIsWebview();
  const [running, setRunning] = useStateCallback<boolean>(false);
  const [isDrawingReady, setIsDrawingReady] = useState(false);
  const [isAnswerReady, setIsAnswerReady] = useState(false);
  const [showLevelCompletedModal, setShowLevelCompletedModal] = useState(false);
  const [answerPoints, setAnswerPoints] = useStateCallback<CanvasLinePoints[]>(
    []
  );
  const [drawingPoints, setDrawingPoints] = useStateCallback<
    CanvasLinePoints[]
  >([]);
  const [penPosition, setPenPosition] = useStateCallback<PenPosition>({
    x: 100,
    y: 100,
  });
  const [isPenDown, setIsPenDown] = useStateCallback<boolean>(true);
  const [strokeColor, setStrokeColor] = useStateCallback<string>("#ffffff");
  const [headingAngle, setheadingAngle] = useStateCallback<number>(0);
  const drawingCode = config.turtle.levels[Number(level) - 1].code;
  const points = config.turtle.levels[Number(level) - 1].points;
  const [darkMode] = useLocalStorage<boolean | undefined>(
    "dark-mode",
    undefined
  );

  const getPenPosition = useCallback(() => {
    return new Promise<PenPosition>((resolve) => {
      setPenPosition(((position: PenPosition) => {
        resolve(position);
        return position;
      }) as any);
    });
  }, []);

  const getHeadingAngle = useCallback(() => {
    return new Promise<number>((resolve) => {
      setheadingAngle(((direction: number) => {
        resolve(direction);
        return direction;
      }) as any);
    });
  }, []);

  const getIsGameRunning = useCallback(() => {
    return new Promise<boolean>((resolve) => {
      setRunning(((running: boolean) => {
        resolve(running);
        return running;
      }) as any);
    });
  }, []);

  const getCurrentStrokeColor = useCallback(() => {
    return new Promise<string>(async (resolve) => {
      setStrokeColor(((color: string) => {
        resolve(color);
        return color;
      }) as any);
    });
  }, []);

  const getDrawingStrokeColor = useCallback(
    (color: string) => {
      if (color === "#ffffff" || color === "grey") {
        if (darkMode) return "black";
        else return "grey";
      } else if (color === "#000000") {
        if (darkMode) return "white";
        else return "black";
      } else color;
    },
    [darkMode]
  );

  const move = useCallback(
    (path: string, distance: number) => {
      return new Promise(async (resolve) => {
        let direction = path === "moveForward" ? distance : distance * -1;
        const headingAngle = await getHeadingAngle();
        const gameRunning = await getIsGameRunning();
        const strokeColor = await getCurrentStrokeColor();
        let radians = degToRad(headingAngle);
        let { x: x1, y: y1 } = await getPenPosition();
        let x2 = x1 + direction * Math.sin(radians);
        let y2 = y1 - direction * Math.cos(radians);
        setIsPenDown(((penDown: boolean) => {
          if (!gameRunning) {
            setDrawingPoints(
              ((drawingPoints: CanvasLinePoints[]) => {
                if (penDown)
                  return [
                    ...drawingPoints,
                    {
                      points: { x1, y1, x2, y2 },
                      strokeColor:
                        strokeColor === "#ffffff" ? "grey" : strokeColor,
                    },
                  ];
                else return [...drawingPoints];
              }) as any,
              () => {
                setPenPosition({ x: x2, y: y2 }, () => {
                  resolve("");
                });
              }
            );
          } else {
            setAnswerPoints(
              ((answerPoints: CanvasLinePoints[]) => {
                if (penDown)
                  return [
                    ...answerPoints,
                    { strokeColor, points: { x1, y1, x2, y2 } },
                  ];
                else return [...answerPoints];
              }) as any,
              () => {
                setPenPosition({ x: x2, y: y2 }, () => {
                  setTimeout(() => {
                    resolve("");
                  }, animationSpeed);
                });
              }
            );
          }
          return isPenDown;
        }) as any);
      });
    },
    [animationSpeed]
  );

  const penDown = useCallback((status: boolean) => {
    return new Promise<void>((resolve) => {
      setIsPenDown(status);
      resolve();
    });
  }, []);

  const penColor = useCallback((color: string) => {
    return new Promise<void>((resolve) => {
      setStrokeColor(color, resolve as any);
    });
  }, []);

  const drawStar = useCallback((distance: number) => {
    return new Promise<void>(async (resolve) => {
      for (let n = 0; n < 5; n++) {
        await move("moveForward", distance);
        await turnRight(144);
      }
      resolve();
    });
  }, []);

  const turn = useCallback((angle: number) => {
    return new Promise<number>(async (resolve) => {
      let headingAngle = await getHeadingAngle();
      let newheadingAngle = normalizeAngle(headingAngle + angle);
      resolve(newheadingAngle);
    });
  }, []);

  const turnRight = useCallback(
    async (angle: number) => {
      return new Promise(async (resolve) => {
        let newHeadingAngle = await turn(angle);
        const gameRunning = await getIsGameRunning();
        setIsDrawingReady(((isDrawingReady: boolean) => {
          setheadingAngle(
            ((headingAngle: number) => {
              if (!gameRunning && !isDrawingReady) return newHeadingAngle;
              else if (gameRunning && isDrawingReady) return newHeadingAngle;
              return headingAngle;
            }) as any,
            async () => {
              if (gameRunning) {
                setTimeout(() => {
                  resolve("");
                }, animationSpeed);
              } else {
                resolve("");
              }
            }
          );
          return isDrawingReady;
        }) as any);
      });
    },
    [turn, animationSpeed]
  );

  const turnLeft = useCallback(
    async (angle: number) => {
      return new Promise(async (resolve) => {
        let newHeadingAngle = await turn(-angle);
        const gameRunning = await getIsGameRunning();
        setIsDrawingReady(((isDrawingReady: boolean) => {
          setheadingAngle(
            ((headingAngle: number) => {
              if (!gameRunning && !isDrawingReady) return newHeadingAngle;
              else if (gameRunning && isDrawingReady) return newHeadingAngle;
              return headingAngle;
            }) as any,
            async () => {
              if (gameRunning) {
                setTimeout(() => {
                  resolve("");
                }, animationSpeed);
              } else {
                resolve("");
              }
            }
          );
          return isDrawingReady;
        }) as any);
      });
    },
    [turn, animationSpeed]
  );

  useMemo(
    () => [turnLeft, turnRight, move, drawStar, penColor, penDown, points],
    []
  );

  const onGameOver = useCallback(
    (isMatched: boolean) => {
      if (isMatched) {
        if (!isWebView) {
          resetGame();
          setShowLevelCompletedModal(true);
        } else {
          console.log("WEBVIEW");
          dispatchMessage("game-ended");
        }
      }
    },
    [isWebView]
  );

  const handleCodeExecution = useCallback(() => {
    setRunning(true, () => {
      eval(`(async ()=> {
        ${code}
        setIsAnswerReady(true)
    })()`);
    });
  }, [code, animationSpeed]);

  const resetGame = useCallback(() => {
    setRunning(false, () => {
      setPenPosition({
        x: 165,
        y: 163,
      });
      setheadingAngle(0);
      setAnswerPoints([]);
      setStrokeColor(!darkMode ? "#ffffff" : "grey");
      setIsAnswerReady(false);
    });
  }, [darkMode]);

  useEffect(() => {
    setPenPosition({ x: 165, y: 163 });
    eval(`
      (async ()=>{
        if(level==='9' || level==='8'){
          setDrawingPoints(points,()=>{
            setIsDrawingReady(true)
          })
        }
        else{
          setRunning(false);
          setheadingAngle(0);
          setIsDrawingReady(false)
          setAnswerPoints([])
          setDrawingPoints([])
          ${drawingCode}
          setIsDrawingReady(true)
        }
        setPenPosition({
          x: 165,
          y: 163,
        });
      }
      )()
      `);
    setStrokeColor(!darkMode ? "#ffffff" : "grey");
  }, [darkMode]);

  return (
    <div className="m-auto">
      <div
        style={{
          height: 245,
        }}
        className="bg-text relative w-min"
      >
        <Stage
          ref={drawingRef}
          width={330}
          height={245}
          style={{
            position: "absolute",
          }}
        >
          <Layer>
            {drawingPoints.map(({ points, strokeColor }, index) => (
              <Line
                key={index.toString()}
                x={points.x1}
                y={points.y1}
                points={[0, 0, points.x2 - points.x1, points.y2 - points.y1]}
                stroke={getDrawingStrokeColor(strokeColor)}
              />
            ))}
          </Layer>
        </Stage>

        <Stage ref={answerRef} width={330} height={245}>
          {
            <Layer>
              {answerPoints.map(({ points, strokeColor }, index) => (
                <Line
                  key={index.toString()}
                  x={points.x1}
                  y={points.y1}
                  points={[0, 0, points.x2 - points.x1, points.y2 - points.y1]}
                  stroke={strokeColor}
                />
              ))}
              {isDrawingReady && (
                <>
                  <Circle
                    x={penPosition.x}
                    y={penPosition.y}
                    radius={8}
                    fillEnabled={true}
                    fill={strokeColor}
                    strokeWidth={3}
                    stroke={strokeColor}
                  />
                  <Arrow
                    x={penPosition.x}
                    y={penPosition.y}
                    points={[0, 0, 0, -20]}
                    stroke={strokeColor}
                    fill={strokeColor}
                    rotation={headingAngle}
                    strokeWidth={3}
                    pointerWidth={10}
                    pointerLength={12}
                  />
                </>
              )}
            </Layer>
          }
        </Stage>
        {isAnswerReady && (
          <MatchCanvas
            drawingPoints={drawingPoints}
            answerPoints={answerPoints}
            canvasMatchedCallback={onGameOver}
          />
        )}
        <LevelCompletionModal
          open={showLevelCompletedModal}
          onClose={() => setShowLevelCompletedModal(false)}
          gameId={GAME_IDS.TURTLE}
          level={+level}
        />
      </div>
      <div
        className={`flex justify-center items-center gap-2 mt-1 text-[32px]`}
      >
        <div
          id="play-stop-button"
          className={`${running ? "text-danger" : "text-success"} ${
            !isDrawingReady ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={running ? resetGame : handleCodeExecution}
        >
          {running ? <FaStopCircle /> : <FaPlayCircle />}
        </div>
      </div>
    </div>
  );
};

export default TurtleCanva;
