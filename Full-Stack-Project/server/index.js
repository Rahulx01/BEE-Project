import express from "express";
import mongoose from "mongoose";
import route from "./routes/route.js";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const EXPRESS_SERVER_PORT = process.env.EXPRESS_SERVER_PORT || 3001;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(route);


//server creation
app.listen(EXPRESS_SERVER_PORT, () => {
  console.log(`server is running at port ${EXPRESS_SERVER_PORT}`);
});

// Database connectivity
const URL = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@tambolacluster.b515j1j.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

export default app;
