const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

const PORT = process.env.PORT || 3001;
const usernames = {};

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("createGame", () => {
    const gameCode = Math.floor(1000 + Math.random() * 9000).toString();
    socket.join(gameCode);
    socket.emit("gameCodeGenerated", gameCode);
  });

  socket.on("joinGame", (gameCode) => {
    const room = io.sockets.adapter.rooms.get(gameCode);
    if (room && room.size > 0) {
      socket.join(gameCode);
      socket.emit("joinedGame", gameCode);
      io.to(gameCode).emit("playerJoined", socket.id);
    } else {
      socket.emit("errorJoining", "Invalid game code");
    }
  });

  socket.on("username", (username) => {
    usernames[socket.id] = username;
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    delete usernames[socket.id]; // remove username when user disconnects
  });
});

server.listen(3001);
