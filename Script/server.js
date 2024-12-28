// Import required modules
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO on the server
const io = socketIo(server);

// Serve static files (such as HTML, CSS, JS) from the public directory
app.use(express.static(__dirname + '/public'));

// Listen for new connections from clients
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for chatMessage event from a client
  socket.on('chatMessage', (msg) => {
    // Broadcast the message to all clients
    io.emit('chatMessage', msg);
  });

  // Listen for disconnection event
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server on port 3000 (or any port you specify)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
