import React, { useReducer, useEffect } from 'react';
import "./AnalogClock.scss";

const AnalogClock = () => {
  const [, tick] = useReducer((n) => n + 1, 0);

  useEffect(() => {
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const getLondonTime = () => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });

    const parts = formatter.formatToParts(new Date());
    const timeObj = {};
    parts.forEach(({ type, value }) => {
      if (type !== "literal") {
        timeObj[type] = parseInt(value, 10);
      }
    });
    return timeObj;
  };

  const { hour: hours, minute: minutes, second: seconds } = getLondonTime();

  const hourDegrees = ((hours % 12) + minutes / 60) * 30;
  const minuteDegrees = (minutes + seconds / 60) * 6;
  const secondDegrees = seconds * 6;
  
  return (
    <div className="clock-container">
      <div className="clock">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={`hour_${index}`}
            className="mark hour-mark"
            style={{ transform: `rotate(${index * 30}deg)` }}
          >
            <div className="mark-line" />
          </div>
        ))}
        {Array.from({ length: 60 }).map((_, index) => (
          <div
            key={`minute_${index}`}
            className="mark minute-mark"
            style={{ transform: `rotate(${index * 6}deg)` }}
          >
            <div className="minute-mark-line" />
          </div>
        ))}
        <div className="hand hour-hand" style={{ transform: `rotate(${hourDegrees}deg)` }} />
        <div className="hand minute-hand" style={{ transform: `rotate(${minuteDegrees}deg)` }} />
        <div className="hand second-hand" style={{ transform: `rotate(${secondDegrees}deg)` }} />
      </div>
    </div>
  );
};

export default AnalogClock;
