import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { getTicket } from "./socketUtils.js";
import {
    handleJoinRoom,
    setGameStatus,
    tokenAuthentication,
    getBoardNumbers,
    claimTicket
} from "./roomDataOperations.js";

const io = new Server(9000, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("a user connected lol", socket.id);

    // When user join room
    socket.on("join-room", (roomCode, JWtoken) => {
        if (socket.rooms.size > 1) return;
        handleJoinRoom(roomCode, JWtoken, socket);
    });

    //leave room
    socket.on("leave-room", (roomCode, JWtoken) => {
        const username = tokenAuthentication(JWtoken);
        console.log(username)
        if (username) {
            socket.leave(roomCode);
            socket.to(roomCode).emit("user-left", username);
        }
    });

    // Start Game
    socket.on("game-status", (roomCode, gameActiveStatus, JWtoken) => {
        const username = tokenAuthentication(JWtoken);
        if (username) {
            const gameStatus = setGameStatus(roomCode, gameActiveStatus, username);
            if (gameStatus) socket.to(roomCode).emit("game-status", gameActiveStatus);
        }
    });

    //Get Ticket
    socket.on("get-ticket", () => {
        const ticket = getTicket();
        const signedTicket = jwt.sign({ ticket: ticket }, "THISISMYSECRETKEYFORSIGNINGTICKET");
        socket.emit("ticket", ticket, signedTicket);
    });

    //Claim Ticket
    socket.on("claim-ticket", (claimType, signedTicket, roomCode, JWtoken) => {

        const username = tokenAuthentication(JWtoken);
        getBoardNumbers(roomCode).then((board) => {
            if (claimTicket(claimType, signedTicket, board)) {
                io.to(roomCode).emit("claim-ticket", claimType, username);
            }
            else {
                io.to(roomCode).emit("bogey", claimType, username);
            }
        }).catch((e) => {
            console.log("Error while getting board numbers : ", e);
        });
    });

    //when user send chat message
    socket.on("room-chat-message", (roomCode, message, JWtoken) => {
        const username = tokenAuthentication(JWtoken);
        if (username) socket.to(roomCode).emit("room-chat-message", username, message);
    });

    //when user disconnect
    socket.on("disconnect", () => {
        // const roomCode = Array.from(socket.rooms).find((room) => room !== socket.id);
        // socket.to(roomCode).emit("user-left", username);
        console.log("user disconnected");

    });
});

