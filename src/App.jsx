import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { HiPlayPause } from "react-icons/hi2";
import { RxReset } from "react-icons/rx";
import { FaLongArrowAltUp } from "react-icons/fa";
import { FaLongArrowAltDown } from "react-icons/fa";

function App() {
  const [rest, setRest] = useState(5);
  const [session, setSession] = useState(25);
  const [time, setTime] = useState(25 * 60); 
  const [isActive, setIsActive] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(intervalRef.current);
            const audio = document.getElementById('beep');
            if (audio) {
              audio.play().catch(error => {
                console.error("Error playing sound:", error);
              });
            }
            setIsSession(!isSession);
            return isSession ? rest * 60 : session * 60;
          }
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isActive, isSession, rest, session, setTime, setIsSession]);
  

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);  
    setIsActive(false);  
    setIsSession(true);  
    setRest(5);          
    setSession(25);      
    setTime(25 * 60);   

    const sound = document.getElementById('beep');
    if (sound) {
        sound.pause();      
        sound.currentTime = 0;  
    }
};


  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const restDecrement = () => {
    if (rest > 1) {
      setRest(rest - 1);
      if (!isSession) {
        setTime((rest - 1) * 60);
      }
    }
    
  };

  const restIncrement = () => {
    if (rest < 60) {
      setRest(rest + 1);
      if (!isSession) {
        setTime((rest + 1) * 60);
      }
    }
  };

  const sessionDecrement = () => {
    if (session > 1) {
      setSession(session - 1);
      if (isSession) {
        setTime((session - 1) * 60);
      }
    }
  };

  const sessionIncrement = () => {
    if (session < 60) {
      setSession(session + 1);
      if (isSession) {
        setTime((session + 1) * 60);
      }
    }
  };
  

  return (
    <div className="container">
        <div className="control-group">
            <h5 id="break-label">Break Length</h5>
            <div className="controls">
                <button id="break-decrement" onClick={restDecrement}><FaLongArrowAltDown /></button>
                <div id="break-length">{rest}</div>
                <button id="break-increment" onClick={restIncrement}><FaLongArrowAltUp /></button>
            </div>
        </div>

        <div className="control-group">
            <h5 id="session-label">Session Length</h5>
            <div className="controls">
                <button id="session-decrement" onClick={sessionDecrement}><FaLongArrowAltDown /></button>
                <div id="session-length">{session}</div>
                <button id="session-increment" onClick={sessionIncrement}><FaLongArrowAltUp /></button>
            </div>
        </div>

        <div className="timer">
          <h6 id="timer-label">{isSession ? 'Session' : 'Break'}</h6>
          <p id="time-left">{formatTime(time)}</p>
          <button id="start_stop" onClick={toggleTimer}><HiPlayPause /></button>
          <button id="reset" onClick={handleReset}><RxReset /></button>
          <audio id="beep" src="https://www.mediacollege.com/downloads/sound-effects/beep/beep-01.wav" preload="auto"></audio>
        </div>
    </div>
  );
}

export default App;
