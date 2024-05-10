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

// Mapping of socket IDs to usernames
const usernames = {};

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
    console.log(`Game created with code: ${gameCode} by client ${socket.id}`);
    socket.join(gameCode);
    socket.emit("gameCodeGenerated", gameCode);
  });

  // Event for joining a game
  socket.on("joinGame", (gameCode) => {
    const room = io.sockets.adapter.rooms.get(gameCode);
    if (room && room.size > 0) {
      socket.join(gameCode);
      console.log(`Client ${socket.id} joined game ${gameCode}`);
      socket.emit("joinedGame", gameCode);

      // Emit updated list of players in the room
      const players = getUsernamesInRoom(gameCode);
      console.log(`Players in room ${gameCode}:`, players);
      io.to(gameCode).emit("updatePlayerList", players);
    } else {
      console.log(`Invalid game code attempt by client ${socket.id}`);
      socket.emit("errorJoining", "Invalid game code");
    }
  });

  // Handle client disconnection and cleanup
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.leave(room);
        const players = getUsernamesInRoom(room);
        console.log(
          `Updated players in room ${room} after client ${socket.id} disconnected:`,
          players
        );
        io.to(room).emit("updatePlayerList", players);
      }
    }
    // Remove the username associated with the disconnected client
    delete usernames[socket.id];
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
