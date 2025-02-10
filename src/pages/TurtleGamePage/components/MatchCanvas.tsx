import { Layer, Line, Stage } from "react-konva";
import { CanvasLinePoints } from "./TurtleCanva";
import { useEffect, useRef } from "react";
import { Stage as StageType } from "konva/lib/Stage";

interface MatchCanvasProps {
  drawingPoints: CanvasLinePoints[];
  answerPoints: CanvasLinePoints[];
  canvasMatchedCallback: (isMatched: boolean) => void;
}

const MatchCanvas = ({ drawingPoints, answerPoints, canvasMatchedCallback }: MatchCanvasProps) => {
  const answerRef = useRef<StageType>(null);
  const drawingRef = useRef<StageType>(null);

  useEffect(() => {
    if (!drawingRef.current || !answerRef.current) return;
    const answerStr = answerRef.current.toDataURL();
    const drawingStr = drawingRef.current.toDataURL();
    if (answerStr === drawingStr) {
      canvasMatchedCallback(true);
    } else {
      canvasMatchedCallback(false);
    }
  }, []);
  return (
    <div style={{ display: "none" }}>
      <Stage ref={drawingRef} width={window.innerWidth - 100} height={window.innerHeight - 100}>
        <Layer>
          {drawingPoints.map(({ points }, index) => (
            <Line
              key={index.toString()}
              x={points.x1}
              y={points.y1}
              points={[0, 0, points.x2 - points.x1, points.y2 - points.y1]}
              stroke="white"
            />
          ))}
        </Layer>
      </Stage>
      <Stage ref={answerRef} width={window.innerWidth - 100} height={window.innerHeight - 100}>
        <Layer>
          {answerPoints.map(({ points }, index) => (
            <Line
              key={index.toString()}
              x={points.x1}
              y={points.y1}
              points={[0, 0, points.x2 - points.x1, points.y2 - points.y1]}
              stroke="white"
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default MatchCanvas;
