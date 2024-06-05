import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket"; // shared socket instance

function JoinGame() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [gameCode, setGameCode] = useState(null);
  const [players, setPlayers] = useState([]);
  const [isLeader, setIsLeader] = useState(false);

  // Handle initial setup and listen for game updates
  useEffect(() => {
    socket.on("gameCodeGenerated", (code, leader) => {
      setGameCode(code);
      setIsLeader(leader);
    });

    socket.on("joinedGame", (code, leader) => {
      setIsLeader(leader);
    });

    socket.on("updatePlayerList", (playerList) => {
      setPlayers(playerList);
    });

    socket.on("gameStarted", () => {
      navigate("/game"); // Navigate to the game page when the game starts
    });

    socket.on("errorJoining", (message) => {
      alert(message);
    });

    // Cleanup listeners when the component is unmounted
    return () => {
      socket.off("gameCodeGenerated");
      socket.off("joinedGame");
      socket.off("updatePlayerList");
      socket.off("gameStarted");
      socket.off("errorJoining");
    };
  }, [navigate]);

  // Emit game creation event to the server
  const handleCreateGame = () => {
    socket.emit("createGame");
  };

  // Emit game joining event to the server
  const handleJoinGame = () => {
    socket.emit("joinGame", code);
  };

  const handleStartGame = () => {
     socket.emit("startGame",gameCode);
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
      <button onClick={handleStartGame}>Start Game</button>

      {/* Display list of players in the current game */}
      {players.length > 0 && (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {players.map((player, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "5px",
                borderBottom: "1px solid #ccc", // Separating line between items
              }}
            >
              {/* Number or index marker */}
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#007bff", // Example color (blue)
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: "10px",
                }}
              >
                {index + 1} {/* Display player number */}
              </div>
              {/* Player's name */}
              <div>{player}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default JoinGame;
