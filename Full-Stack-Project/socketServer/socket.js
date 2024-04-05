import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { getTicket, tokenAuthentication } from "./socketUtils.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {
    handleJoinRoom,
    claimTicket,
    setGameStatus,
    handleLeaveRoom,
    getRandomNumber
} from "./roomDataOperations.js";


dotenv.config();
const PORT = process.env.PORT || 9000;
const io = new Server(PORT, {
    cors: {
        // origin: ['*'],
        methods: ["GET", "POST"],
    },
});

//mongoDB connectivity
const JWPasskey = process.env.JWT_KEY_FOR_AUTH;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const URL = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@tambolacluster.b515j1j.mongodb.net/?retryWrites=true&w=majority`;

mongoose
    .connect(URL)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });


io.on("connection", (socket) => {
    console.log("a user connected lol", socket.id);
    // When user join room
    socket.on("join-room", (roomCode, JWtoken) => {
        const username = tokenAuthentication(JWtoken);
        if (username) {
            socket.username = username;
            socket.roomCode = roomCode;
            handleJoinRoom(roomCode, username, socket);
        }
    });

    //leave room
    socket.on("leave-room", (roomCode) => {
        handleLeaveRoom(io, socket);
    });

    // Start Game
    socket.on("game-status", (roomCode, gameActiveStatus) => {
        const username = socket.username;
        console.log("from game status", username);
        if (username) {
            setGameStatus(roomCode, gameActiveStatus, username)
                .then((gameStatus) => {
                    if (gameStatus) socket.to(roomCode).emit("game-status", gameActiveStatus);
                })
                .catch((e) => {
                    console.log("Error while setting game status : ", e);
                });

        }
    });

    //Get Ticket
    socket.on("get-ticket", () => {
        const ticket = getTicket();
        const signedTicket = jwt.sign({ ticket: ticket }, JWPasskey);
        socket.emit("ticket", ticket, signedTicket);
    });

    //Claim Ticket
    socket.on("claim-ticket", (claimType, signedTicket, roomCode) => {

        const username = socket.username;
        if (username) {
            claimTicket(claimType, signedTicket, roomCode)
                .then((claimStatus) => {
                    if (claimStatus) {
                        io.to(roomCode).emit("claim-ticket", claimType, username);
                    }
                    else {
                        io.to(roomCode).emit("bogey", claimType, username);
                    }
                })
                .catch((e) => {
                    console.log("Error while claiming ticket : ", e);
                });

        }
    });

    //when user send chat message
    socket.on("room-chat-message", (roomCode, message) => {
        const username = socket.username;
        if (username) socket.to(roomCode).emit("room-chat-message", username, message);
    });

    socket.on("get-new-number", (roomCode) => {
        const username = socket.username;
        if (username) {
            getRandomNumber(roomCode)
                .then((randomNumber) => {
                    if (randomNumber) io.to(roomCode).emit("new-number", randomNumber);
                    else io.to(roomCode).emit("game-over");
                })
                .catch((e) => {
                    console.log("Error while getting random number : ", e);
                });
        }
    });

    //when user disconnect
    socket.on("disconnect", () => {
        handleLeaveRoom(io, socket);
        console.log("user disconnected", socket.username);

    });
});

export default io;