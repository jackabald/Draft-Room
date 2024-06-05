const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

const PORT = process.env.PORT || 3001;
const usernames = {};
const games = {};

// Function to retrieve usernames for a specific room
function getUsernamesInRoom(room) {
  const clients = io.sockets.adapter.rooms.get(room);
  if (!clients) return [];
  return Array.from(clients).map((clientId) => usernames[clientId] || "guest");
}

// Handle socket connections
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Listen for the "username" event to associate a name with this socket
  socket.on("username", (username) => {
    usernames[socket.id] = username || "guest";
    console.log(
      `Username registered for socket ${socket.id}: ${usernames[socket.id]}`
    );
  });

  // Event for creating a new game
  socket.on("createGame", () => {
    const gameCode = Math.floor(1000 + Math.random() * 9000).toString();
    games[gameCode] = { leader: socket.id, players: [socket.id]};
    console.log(`Game created with code: ${gameCode} by client ${socket.id}`);
    socket.join(gameCode);
    socket.emit("gameCodeGenerated", gameCode);
    io.to(gameCode).emit("updatePlayerList", getUsernamesInRoom(gameCode));
  });

  // Event for joining a game
  socket.on("joinGame", (gameCode) => {
    const room = io.sockets.adapter.rooms.get(gameCode);
    if (room && room.size > 0) {
        socket.join(gameCode);
        if (!games[gameCode].players.includes(socket.id)) {
            games[gameCode].players.push(socket.id);
        }
        console.log(`Client ${socket.id} joined game ${gameCode}`);
        console.log(`Current players in game ${gameCode}:`, games[gameCode].players);
        io.to(gameCode).emit("updatePlayerList", getUsernamesInRoom(gameCode));
    } else {
        console.log(`Invalid game code attempt by client ${socket.id}`);
        socket.emit("errorJoining", "Invalid game code");
    }
});


  // Emitting the game started event and choosing the player who will view the number
  socket.on("startGame", (gameCode) => {
    if (games[gameCode] && socket.id === games[gameCode].leader) {
        if (games[gameCode].players.length < 2) { 
            socket.emit("error", "Not enough players to start the game.");
            return;
        }
        const randomIndex = Math.floor(Math.random() * games[gameCode].players.length);
        const guesserId = games[gameCode].players[randomIndex];  
        games[gameCode].guesser = guesserId;

        io.to(gameCode).emit("gameStarted", { guesserId });  // Emitting as 'guesserId'
        console.log(`Game ${gameCode} started. Guesser is ${guesserId}`);
    }
});


  // Handle client disconnection and cleanup
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    Object.keys(games).forEach((gameCode) => {
      if (games[gameCode].players.includes(socket.id)) {
        games[gameCode].players = games[gameCode].players.filter(id => id !== socket.id);
        if (games[gameCode].leader === socket.id && games[gameCode].players.length > 0) {
          games[gameCode].leader = games[gameCode].players[0]; // Assign new leader if leader leaves
          io.to(games[gameCode].leader).emit("assignLeader");
        }
        io.to(gameCode).emit("updatePlayerList", getUsernamesInRoom(gameCode));
      }
    });
    delete usernames[socket.id];
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
