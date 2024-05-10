import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket"; // shared socket instance

function StartScreen() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  // Update the username state whenever the input changes
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleChoose = () => {
    // Emit the chosen username, or default to "guest" if it's empty
    if (username) {
      socket.emit("username", username);
    } else {
      socket.emit("username", "guest");
    }

    // Navigate to the JoinGame screen after choosing the username
    navigate("/join");
  };

  return (
    <div>
      <h1>Welcome to Wavelength</h1>
      <h2>Choose a name</h2>
      <input
        type="text"
        id="username"
        value={username}
        onChange={handleUsernameChange}
        placeholder="Enter your username"
      />
      <button onClick={handleChoose}>Choose</button>
    </div>
  );
}

export default StartScreen;
