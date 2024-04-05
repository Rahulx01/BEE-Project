import { ticketAuthentication } from './socketUtils.js';
import {
    joinRoom,
    getBoardNumbers,
    setGameStatus as sgs,
    getRoomDetails,
    abortRoom
} from './controllers/controller.js';


export function handleJoinRoom(roomCode, username, socket) {
    console.log(username, socket.id);
    joinRoom(roomCode, username)
        .then((roomDetails) => {
            if (roomDetails) {
                socket.join(roomCode);
                socket.emit("room-join-success", username == roomDetails.host, roomDetails.members, roomDetails.roomActiveStatus);
                socket.to(roomCode).emit("new-user", username);
            }
            else socket.emit("room-join-failed");
        })
        .catch((e) => socket.emit("room-join-failed"));
}

export function setGameStatus(roomCode, gameActiveStatus, username) {
    return sgs(roomCode, gameActiveStatus, username);
}

//Abort room on :- claim exausted, all members left, board exausted

export async function getRandomNumber(roomCode) {
    abortRoom(roomCode);
    try {
        const roomDetails = await getRoomDetails(roomCode);
        if (roomDetails) {
            const boardNumbers = roomDetails.boardNumbers;
            if (boardNumbers.length === 0) {
                //to abort the room
            }
            else {
                const randomIndex = Math.floor(Math.random() * boardNumbers.length);
                const randomNumber = boardNumbers[randomIndex];
                boardNumbers.splice(randomIndex, 1);
                roomDetails.save();
                return randomNumber;
            }
        }
    }
    catch (e) {
        console.log("Error while getting random number : ", e);
    }
}

export async function claimTicket(claimType, signedTicket, roomCode) {
    const roomDetails = await getRoomDetails(roomCode);
    const board = roomDetails.boardNumbers;
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

export function handleLeaveRoom(io, socket) {

    // console.log(members);
    const roomCode = socket.roomCode;
    const username = socket.username;
    socket.leave(roomCode);
    socket.to(roomCode).emit("user-left", username);
    if (roomCode) {
        getRoomDetails(roomCode)
            .then((roomDetails) => {
                if (roomDetails.host == username) {
                    let newHost;
                    while (!newHost) {
                        newHost = roomDetails.members[Math.floor(Math.random() * roomDetails.members.length)];
                        if (newHost == username) newHost = null;
                    }
                    socket.to(roomCode).emit("new-host", newHost);
                    roomDetails.host = newHost;
                    roomDetails.save();

                }
            })
            .catch((e) => {
                console.log("Error while getting room details : ", e);
            });
    }
}