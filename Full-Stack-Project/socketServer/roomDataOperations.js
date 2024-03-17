import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import mongoose, { set } from "mongoose";
import activeRoomSchema from "./DBmodel/activeRoomSchema.js";


dotenv.config();
const jwtForTicket = process.env.JWT_KEY_FOR_TICKET;
const jwtForAuth = process.env.JWT_KEY_FOR_AUTH;

//mongoDB connectivity
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

/*
setInterval(() => {
activeRoomSchema.find({ roomActiveStatus: true }).then((rooms) => {
    console.log("Rooms : ", rooms);
})
    .catch((e) => {
        console.log("Error while getting rooms : ", e);
    })
}, 6000);*/

export const setGameStatus = async (roomCode, status, username) => {
    try {
        const roomDetails = await activeRoomSchema.findOne({ roomCode: roomCode });
        if (roomDetails.host === username) {
            roomDetails.roomActiveStatus = status;
            await roomDetails.save();
            return true;
        }
        else return false;
    }
    catch (e) {
        console.log("Error while setting game status : ", e);
        return false;
    }
};

export const getBoardNumbers = async (roomCode) => {
    try {
        const roomDetails = await activeRoomSchema.findOne({ roomCode: roomCode });
        return roomDetails?.boardNumbers;
    }
    catch (e) {
        console.log("Error while getting board numbers : ", e);
        return false;
    }

};

export function claimTicket(claimType, signedTicket, board) {
    const ticket = ticketAuthentication(signedTicket).ticket;
    if (ticket && board) {
        if (claimType == 'firstLine') {
            for (let i = 0; i < 9; i++) {
                if (ticket[0][i] && board.includes(ticket[0][i])) return false;
            }
        }
        else if (claimType == 'secondLine') {
            for (let i = 0; i < 9; i++) {
                if (ticket[1][i] && board.includes(ticket[1][i])) return false;
            }
        }
        else if (claimType == 'thirdLine') {
            for (let i = 0; i < 9; i++) {
                if (ticket[2][i] && board.includes(ticket[2][i])) return false;
            }
        }
        else if (claimType == 'house') {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 9; j++) {
                    if (ticket[i][j] && board.includes(ticket[i][j])) return false;
                }
            }
        }
        return true;
    }
    else return false;
}

export function handleJoinRoom(roomCode, JWtoken, socket) {
    const username = tokenAuthentication(JWtoken);
    if (username) {
        joinRoom(roomCode, username)
            .then((roomDetails) => {
                if (roomDetails) {
                    socket.join(roomCode);
                    socket.emit("room-join-success", username == roomDetails.host, roomDetails.members);
                    socket.to(roomCode).emit("new-user", username);
                }
                else socket.emit("room-join-failed");
            })
            .catch((e) => socket.emit("room-join-failed"));
    } else socket.emit("room-join-failed");
}

export function tokenAuthentication(JWtoken) {
    try {
        const user = jwt.verify(JWtoken, jwtForAuth);
        return user?.username;
    } catch (err) {
        console.log(err);
        return false;
    }
}

const joinRoom = async (roomCode, username) => {
    try {
        const roomDetails = await activeRoomSchema.findOne({ roomCode: roomCode });
        const members = roomDetails.members;
        for (let i = 0; i < members.length; i++) {
            if (members[i] === username) return roomDetails;
        }
        if (roomDetails.roomActiveStatus) return null;
        members.push(username);
        await roomDetails.save();
        return roomDetails;
    }
    catch (e) {
        console.log("Error while joining room : ", e);
    }
}

function ticketAuthentication(signedTicket) {
    try {
        const ticket = jwt.verify(signedTicket, jwtForTicket);
        return ticket;
    }
    catch (err) {
        return false;
    }
}