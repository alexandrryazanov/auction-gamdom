import { useEffect, useState } from "react";

const useTimeLeft = ({
  skip,
  startValue,
}: {
  skip?: boolean;
  startValue?: number;
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (skip || !startValue) return;

    setTimeLeft(startValue);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) clearInterval(timer);
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [skip, startValue]);

  return timeLeft;
};

export default useTimeLeft;
