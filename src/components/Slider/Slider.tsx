import React from "react";
import { GiRabbit, GiTurtle } from "react-icons/gi";

interface SliderProps {
  min: number;
  max: number;
  step: number;
  handler: React.ChangeEventHandler;
  value: number;
}

export const Slider: React.FC<SliderProps> = ({ min, max, step, handler, value }) => {
  return (
    <div className="w-25 flex flex-col z-30 absolute top-[-42px] left-[10px] px-0 py-0">
      <div className="flex justify-between items-center mb-2">
        <GiRabbit size={20} className="text-primary" />
        <GiTurtle size={20} className="text-primary" />
      </div>
      <input
        id="steps-range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handler}
        className="h-1 bg-primaryDark accent-secondaryLight rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};
