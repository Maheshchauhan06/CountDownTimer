import { useEffect, useState } from "react";
import "./styles.css";

interface Timer {
  min: number;
  sec: number;
  hour: number;
}

export default function App() {
  const [isTimerStart, setIsTimerStart] = useState(false);
  const [timer, setTimer] = useState<Timer>({
    min: 0,
    sec: 0,
    hour: 0,
  });

  useEffect(() => {
    let timerId: any;

    if (isTimerStart) {
      timerId = setInterval(() => {
        setTimer((prev) => {
          let { hour, min, sec } = prev;

          if (hour === 0 && min === 0 && sec === 0) {
            clearInterval(timerId);
            setIsTimerStart(false);
            return prev;
          }

          if (sec > 0) {
            sec--;
          } else {
            if (min > 0) {
              min--;
              sec = 59;
            } else if (hour > 0) {
              hour--;
              min = 59;
              sec = 59;
            }
          }

          return { hour, min, sec };
        });
      }, 1000);
    }

    return () => clearInterval(timerId);
  }, [isTimerStart]);

  const handleTimer = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    let num = parseInt(value) || 0;

    setTimer((prev) => ({
      ...prev,
      [name]: num,
    }));
  };

  const startTimer = () => {
    let { hour, min, sec } = timer;

    // Normalize minutes to hours
    if (min >= 60) {
      const extraHour = Math.floor(min / 60);
      min = min % 60;
      hour += extraHour;
    }

    // Normalize seconds to minutes
    if (sec >= 60) {
      const extraMin = Math.floor(sec / 60);
      sec = sec % 60;
      min += extraMin;

      // Again check if min got over 60 after this
      if (min >= 60) {
        const extraHour = Math.floor(min / 60);
        min = min % 60;
        hour += extraHour;
      }
    }

    // Update normalized time
    setTimer({
      hour,
      min,
      sec,
    });

    // Start timer
    setIsTimerStart((prev) => !prev);
  };

  const resetTimer = () => {
    setIsTimerStart(false);
    setTimer({
      hour: 0,
      min: 0,
      sec: 0,
    });
  };

  return (
    <div className="App">
      <div className="input_container">
        <label>
          Hours
          <input
            name="hour"
            value={timer.hour}
            onChange={handleTimer}
            type="number"
            disabled={isTimerStart}
          />
        </label>

        <label>
          Minutes
          <input
            name="min"
            value={timer.min}
            onChange={handleTimer}
            type="number"
            disabled={isTimerStart}
          />
        </label>

        <label>
          Seconds
          <input
            name="sec"
            value={timer.sec}
            onChange={handleTimer}
            type="number"
            disabled={isTimerStart}
          />
        </label>
      </div>
      <div className="btn-container">
        <button onClick={startTimer}>{isTimerStart ? "Pause" : "Start"}</button>
        <button onClick={resetTimer}>Re-set</button>
      </div>
    </div>
  );
}
