import { useState, useEffect } from 'react';

const useIdleTracker = () => {
  const [idleSeconds, setIdleSeconds] = useState(0);
  const [idlerInterval, setIdlerInterval] = useState<NodeJS.Timer | null>(null);

  useEffect(() => {
    window.addEventListener('touchstart', () => {
      setIdleSeconds(0);
    });
    window.addEventListener('touchmove', () => {
      setIdleSeconds(0);
    });
    window.addEventListener('keydown', () => {
      setIdleSeconds(0);
    });
    window.addEventListener('click', () => {
      setIdleSeconds(0);
    });

    return () => {
      stopIdleTracker();
    };
  }, []);

  const stopIdleTracker = () => {
    if (idlerInterval !== null) {
      clearInterval(idlerInterval);
      setIdlerInterval(null);
      setIdleSeconds(0);
    }
  };

  const initIdlerInterval = (resetTimer = true) => {
    if (idlerInterval !== null) return;

    const newInterval = setInterval(async () => {
      setIdleSeconds((secs) => secs + 1);
    }, 1000);

    setIdlerInterval(newInterval);

    if (resetTimer) {
      setIdleSeconds(0);
    }
  };

  return {
    startIdleTracker: () => initIdlerInterval(true),
    resumeIdleTracker: () => initIdlerInterval(false),
    initIdlerInterval,
    stopIdleTracker,
    idleSeconds,
  };
};

export default useIdleTracker;
