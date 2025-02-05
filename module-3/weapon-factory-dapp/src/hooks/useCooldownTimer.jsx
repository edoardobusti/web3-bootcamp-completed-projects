import { useState, useEffect, useRef } from "react";

const useCooldownTimer = (id, initialCooldown, isOrdered, setIsOrdered) => {
  const [cooldown, setCooldown] = useState(initialCooldown);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isOrdered && id < 3) {
      setCooldown(initialCooldown);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setCooldown((prevCooldown) => {
          if (prevCooldown > 1) {
            return prevCooldown - 1;
          } else {
            clearInterval(timerRef.current);
            setIsOrdered(false);
            return 0;
          }
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isOrdered, setIsOrdered, id, initialCooldown]);

  return cooldown;
};

export default useCooldownTimer;
