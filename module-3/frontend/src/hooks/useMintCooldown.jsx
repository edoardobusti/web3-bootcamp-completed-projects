import { useState, useEffect, useRef } from "react";

const useMintCooldown = (
  id,
  contract,
  provider,
  cooldownTime = 60,
  txStatus,
) => {
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [isMintAllowed, setIsMintAllowed] = useState(false);
  const [isLoadingCooldown, setIsLoadingCooldown] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (id >= 3) return;

    const fetchMintCooldown = async () => {
      setIsLoadingCooldown(true);

      try {
        const block = await provider.getBlock("latest");
        const currentBlockTimestamp = BigInt(block.timestamp);
        const lastMintTimestamp = await contract.lastMintTime(id);
        const timeSinceLastMint = currentBlockTimestamp - lastMintTimestamp;
        const remainingTime = BigInt(cooldownTime) - timeSinceLastMint;

        if (timeSinceLastMint <= BigInt(cooldownTime) && remainingTime > 0) {
          setCooldownRemaining(Number(remainingTime));
          setIsMintAllowed(false);
        } else {
          setCooldownRemaining(0);
          setIsMintAllowed(true);
        }
      } catch (error) {
        console.error("Error fetching cooldown:", error);
      } finally {
        setIsLoadingCooldown(false);
      }
    };

    if (txStatus === "idle") {
      fetchMintCooldown();
    }

    timerRef.current = setInterval(() => {
      setCooldownRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          setIsMintAllowed(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [id, contract, provider, cooldownTime, txStatus]);

  return { cooldownRemaining, isMintAllowed, isLoadingCooldown };
};

export default useMintCooldown;
