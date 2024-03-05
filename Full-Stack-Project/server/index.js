import express from "express";
import mongoose, { set } from "mongoose";
import route from "./routes/route.js";
import cors from "cors";
const app = express();
import io from "./socket.js";

//middleware's !
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    // methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);

app.use(route);

export const roomBoardNumbers = new Map();
// setInterval(() => {
//     // io.emit('broadcastMSG', "Hello from server69");
//     console.log("The active rooms are", roomBoardNumbers);
// }, 5000);

// const io = new Server(9000, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"]
//     }

// });

//server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});

//Database connectivity
const passwordForCluster = "UlXNjRSSxv9ZPWoa";
const URL = `mongodb+srv://rahulgoyal3232:${passwordForCluster}@tambolacluster.b515j1j.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
