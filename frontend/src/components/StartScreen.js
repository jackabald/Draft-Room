import React from "react";
import { useNavigate } from "react-router-dom";

function StartScreen() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/join"); // Redirect to the JoinGame component
  };

  return (
    <div>
      <h1>Welcome to the Drafting Game</h1>
      <button onClick={handleStart}>Start</button>
    </div>
  );
}

export default StartScreen;
