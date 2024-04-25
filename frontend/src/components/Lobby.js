import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001"); // Update the URL based on server location

function JoinGame() {
  const [code, setCode] = useState("");
  const [gameCode, setGameCode] = useState(null);

  useEffect(() => {
    socket.on("gameCodeGenerated", (code) => {
      setGameCode(code);
    });

    socket.on("joinedGame", (code) => {
      console.log(`Joined game with code: ${code}`);
      // Navigate to game room or similar action
    });

    socket.on("errorJoining", (message) => {
      alert(message);
    });

    return () => {
      socket.off("gameCodeGenerated");
      socket.off("joinedGame");
      socket.off("errorJoining");
    };
  }, []);

  const handleCreateGame = () => {
    socket.emit("createGame");
  };

  const handleJoinGame = () => {
    socket.emit("joinGame", code);
  };

  return (
    <div>
      <button onClick={handleCreateGame}>Create Game</button>
      {gameCode && <p>Game Code: {gameCode}</p>}
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter game code"
      />
      <button onClick={handleJoinGame}>Join Game</button>
    </div>
  );
}

export default JoinGame;
