import express from "express";
import mongoose, { set } from "mongoose";
import route from "./routes/route.js";
import cors from "cors";
import dotenv from 'dotenv';
import io from "./socket.js";

// importing some classified details from .env file
dotenv.config();
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const EXPRESS_SERVER_PORT = process.env.EXPRESS_SERVER_PORT;

const app = express();
//middleware's !
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://online-tambola.vercel.app/"],
    // methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);

app.use(route);

export const roomStateMap = new Map();
// setInterval(() => {
//     // io.emit('broadcastMSG', "Hello from server69");
//     console.log("The active rooms are", roomBoardNumbers);
// }, 5000);

//server setup
app.listen(EXPRESS_SERVER_PORT, () => {
  console.log(`server is running at port ${EXPRESS_SERVER_PORT}`);
});

//Database connectivity
console.log(DB_USERNAME);
console.log(DB_PASSWORD);
const URL = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@tambolacluster.b515j1j.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
