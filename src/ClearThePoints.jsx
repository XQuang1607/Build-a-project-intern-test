import React, { useState, useEffect } from "react";

const containerSize = 800;
const ballSize = 40;

const getRandomPosition = () => {
  const margin = ballSize;
  return {
    x: Math.random() * (containerSize - margin * 2) + margin,
    y: Math.random() * (containerSize - margin * 2) + margin,
  };
};

const ClearThePoints = () => {
  const [points, setPoints] = useState(0);
  const [balls, setBalls] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameCleared, setGameCleared] = useState(false);
  const [shakeBallId, setShakeBallId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying && !gameCleared && startTime) {
      const interval = setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, gameCleared, startTime]);

  const generateBalls = (pointsCount) => {
    const newBalls = [];
    for (let i = 1; i <= pointsCount; i++) {
      const pos = getRandomPosition();
      newBalls.push({
        id: i,
        x: pos.x,
        y: pos.y,
        cleared: false,
        fading: false,
      });
    }
    setBalls(newBalls);
    setCurrentNumber(1);
    setStartTime(Date.now());
    setElapsedTime(0);
    setGameCleared(false);
    setShakeBallId(null);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    generateBalls(points);
  };

  const handleRestart = () => {
    generateBalls(points);
  };

  const handleClickBall = (id) => {
    if (id === currentNumber) {
      setBalls((prevBalls) =>
        prevBalls.map((ball) =>
          ball.id === id ? { ...ball, fading: true } : ball
        )
      );
      setTimeout(() => {
        setBalls((prevBalls) =>
          prevBalls.map((ball) =>
            ball.id === id ? { ...ball, cleared: true } : ball
          )
        );
      }, 2000);

      if (currentNumber === balls.length) {
        setGameCleared(true);
      }
      setCurrentNumber((prev) => prev + 1);
      setShakeBallId(null);
    } else {
      setShakeBallId(id);
      setTimeout(() => setShakeBallId(null), 500);
    }
  };

  return (
    <div style={{ padding: "20px" }} className="content_mid">
      <h2 style={{ color: gameCleared ? "green" : "black" }}>
        {gameCleared ? "ALL CLEARED" : "LET'S PLAY"}
      </h2>

      <div style={{ marginBottom: "10px" }}>
        <label>Points: </label>
        <input
          type="text"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          min="1"
          style={{
            width: "150px",
            marginRight: "20px",
            marginLeft: "80px",
            marginBottom: "10px",
          }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          Time:
          <a style={{ marginLeft: "100px",}}>{elapsedTime.toFixed(1)}s</a>
        </label>
      </div>

      {!isPlaying ? (
        <button onClick={handlePlay} style={{ marginBottom: "20px", padding :'5px 20px' }}>
          Play
        </button>
      ) : (
        <button onClick={handleRestart} style={{ marginBottom: "20px", padding :'5px 20px' }}>
          Restart
        </button>
      )}

      <div
        style={{
          marginTop: "20px",
          width: `${containerSize}px`,
          height: `${containerSize}px`,
          border: "2px solid black",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#f9f9f9",
        }}
      >
        {balls.map((ball) =>
          !ball.cleared ? (
            <div
              key={ball.id}
              onClick={() => handleClickBall(ball.id)}
              style={{
                position: "absolute",
                top: ball.y - ballSize / 2,
                left: ball.x - ballSize / 2,
                width: `${ballSize}px`,
                height: `${ballSize}px`,
                borderRadius: "50%",
                border: "2px solid black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: ball.fading ? "red" : "#ffffff",
                color: "#000000",
                fontWeight: "bold",
                fontSize: "18px",
                cursor: "pointer",
                userSelect: "none",
                transition: "opacity 2s ease, background-color 0.3s ease",
                opacity: ball.fading ? 0 : 1,
                animation: shakeBallId === ball.id ? "shake 0.5s" : "none",
              }}
            >
              {ball.id}
            </div>
          ) : null
        )}
      </div>

      <style>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
      `}</style>
    </div>
  );
};

export default ClearThePoints;
