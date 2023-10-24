"use client";


import { useEffect, useState } from "react";


const Timer = () => {

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1); 
    }, 1000);

    return () => clearInterval(interval); 
  }, []); 

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div className="text-sm">
      {hours.toString().padStart(2, '0')}:
      {minutes.toString().padStart(2, '0')}:
      {remainingSeconds.toString().padStart(2, '0')} elapsed
    </div>
  );
};

export default Timer;
