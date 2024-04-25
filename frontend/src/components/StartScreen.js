import React from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  withCredentials: true,
});

function StartScreen() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/join"); // Redirect to the JoinGame component
  };

  const handleUsername = () => {
    const nameInput = document.getElementById("username");
    const name = nameInput.value;
    if (name) {
      socket.emit("username", name);
    } else {
      socket.emit("username", "guest");
    }
  };

  return (
    <div>
      <h1>Welcome to the Drafting Game</h1>
      <h2>Choose a name</h2>
      <input type="text" id="username"></input>
      <button onClick={handleUsername}>Choose</button>
      <button onClick={handleStart}>Start</button>
    </div>
  );
}

export default StartScreen;
