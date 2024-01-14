import { Server } from "socket.io";
const http = require("http");

const server = http.createServer();
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle events or other logic when a user connects

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = 5261;

server.listen(PORT, () => {
  console.log(`WebSocket server is running on http://localhost:${PORT}`);
});