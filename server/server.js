const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve a simple response if you visit http://localhost:5000
app.get("/", (req, res) => {
  res.send("Real-Time Collaborative Server Running");
});

let activeUsers = []; // This will hold the list of connected users

io.on("connection", (socket) => {
  console.log("a user connected");

  // When a new user connects, we add them to the active users list
  socket.on("new-user", (username) => {
    socket.username = username;
    activeUsers.push(username);
    io.emit("active-users", activeUsers); // Emit active users list to everyone
  });

  // When a user types, broadcast the text change to all other users
  socket.on("text-change", (newText) => {
    console.log("Text updated by " + socket.username + ": " + newText);
    socket.broadcast.emit("text-update", newText); // Send the text to all users except the sender
  });

  // When a user disconnects, remove them from the active users list
  socket.on("disconnect", () => {
    console.log("user disconnected");
    activeUsers = activeUsers.filter(user => user !== socket.username); // Remove user from the list
    io.emit("active-users", activeUsers); // Update active users list
  });
});

// Start the server on port 5000
server.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
