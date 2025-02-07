import { useState, useEffect } from "react";

interface GameStatsProps {
  gameImage: string;
  gameName: string;
  gameProgress: number;
  totalLevels: number;
  totalLevelsCompleted: number;
}

const Index = ({
  gameImage,
  gameName,
  gameProgress,
  totalLevels,
  totalLevelsCompleted,
}: GameStatsProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    // Animation duration in milliseconds (1.5 seconds)
    const animationDuration = 1500;

    // Calculate the total number of steps needed to reach the gameProgress
    const totalSteps = Math.ceil(animationDuration / 16);

    // Calculate the step value to increment progress in each step
    const step = gameProgress / totalSteps;

    // Start the animation timer
    const animationTimer = setInterval(() => {
      // Calculate the new progress value
      const newProgress = animatedProgress + step;

      // Ensure the new progress doesn't exceed the gameProgress
      const clampedProgress = Math.min(newProgress, gameProgress);

      setAnimatedProgress(clampedProgress);

      // Stop the animation when reaching the gameProgress value
      if (clampedProgress >= gameProgress) {
        clearInterval(animationTimer);
      }
    }, 16); // 60 FPS

    // Clean up animation timer on component unmount
    return () => clearInterval(animationTimer);
  }, [gameProgress, animatedProgress]);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex p-3 w-full rounded-md shadow-md shadow-primary border-primary border-double border-4">
        <img src={gameImage} alt={gameName} width={80} />
        <div className="flex flex-col justify-center items-center m-auto">
          <h2 className="text-2xl font-heading text-primary">{gameName}</h2>
          <h4 className="text-center text-sm text-text">
            {totalLevelsCompleted}/{totalLevels} levels completed
          </h4>
        </div>
      </div>
      <div className="relative w-full h-4 rounded text-text bg-gray-300">
        <h4 className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {Math.round(animatedProgress)}%
        </h4>
        <div
          style={{ width: `${Math.round(animatedProgress)}%` }}
          className={`absolute h-4 transition-all duration-30 ease-in-out bg-primaryDark rounded`}
        />
      </div>
    </div>
  );
};

export default Index;
