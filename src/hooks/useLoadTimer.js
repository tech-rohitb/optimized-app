import { useState, useEffect } from "react";

export const useLoadTimer = (startTiming) => {
  const [timer, setTimer] = useState(0);
  const [loadTime, setLoadTime] = useState(null);

  useEffect(() => {
    let interval = null;

    if (startTiming) {
      const startTime = performance.now(); // Start measuring time
      interval = setInterval(() => {
        const currentTime = performance.now();
        setTimer((currentTime - startTime).toFixed(2)); // Update timer
      }, 10); // Update every 10 ms

      // Setting a timeout to stop the timer and capture the load time after the render
      const timeoutId = setTimeout(() => {
        const endTime = performance.now();
        setLoadTime((endTime - startTime).toFixed(2)); // Set final load time after render
        clearInterval(interval); // Clear interval after setting load time
      }, 0); // Execute immediately after the rendering

      return () => {
        clearInterval(interval);
        clearTimeout(timeoutId); // Cleanup on unmount
      };
    }

    return () => clearInterval(interval); // Cleanup on unmount if not timing
  }, [startTiming]); // Dependency on timing state

  return { timer, loadTime };
};
