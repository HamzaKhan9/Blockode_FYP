import React from "react";
import AnimatedProgressProvider from "./Components/AnimatedProgressProvider";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { easeQuadInOut } from "d3-ease";

interface ProgressProps {
  valueStart: number;
  valueEnd: number;
  duration?: number;
  repeat?: boolean;
  strokeWidth?: number;
  customText?: string;
}

const ProgressComponent: React.FC<ProgressProps> = ({
  valueStart,
  valueEnd,
  duration = 1,
  repeat = false,
  strokeWidth = 10,
  customText,
}) => (
  <AnimatedProgressProvider
    valueStart={valueStart}
    valueEnd={valueEnd}
    duration={duration}
    easingFunction={easeQuadInOut}
    repeat={repeat}
  >
    {(value: number) => {
      const roundedValue = Math.round(value);
      return (
        <CircularProgressbar
          value={value}
          text={customText || `${roundedValue}%`}
          strokeWidth={strokeWidth}
          styles={buildStyles({
            pathTransition: "none",
            pathColor: "var(--color-primary-dark)",
            textColor: "var(--color-text)",
            textSize: "1.7rem",
            strokeLinecap: "butt",
          })}
        />
      );
    }}
  </AnimatedProgressProvider>
);

export default ProgressComponent;
