import logo from "../assets/blocklyLogo.png"; // path to your logo
import React, { useEffect, useState } from "react";

interface SplashScreenProps {
  endLoading: () => void; // A function to call when loading ends
}

const SplashScreen: React.FC<SplashScreenProps> = ({ endLoading }) => {
  const [loadPercent, setLoadPercent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadPercent((prevState) => prevState + 2); // Increase by 2 every time
    }, 20); // Increase every 20ms for 2 seconds total

    if (loadPercent >= 100) {
      clearInterval(timer);
      setTimeout(endLoading, 500); // Wait for a half second before ending loading
    }

    return () => clearInterval(timer); // Clean up on component unmount
  }, [loadPercent, endLoading]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="relative z-10 w-64 max-w-xs mb-8">
        <img src={logo} alt="Game Logo" className="w-full" />
      </div>
      <div className="relative z-10 w-64 h-4 mb-4 bg-secondaryDark rounded">
        <div
          style={{ width: `${loadPercent}%` }}
          className={`absolute h-4 transition-all duration-30 ease-in-out bg-secondaryLight rounded`}
        />
      </div>
      <p className="z-10 text-lg font-bold text-text">{loadPercent}%</p>
    </div>
  );
};

export default SplashScreen;
