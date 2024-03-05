import { set } from 'mongoose';
import activeRoomSchema from '../DBmodel/activeRoomSchema.js';
import { roomBoardNumbers } from '../index.js';

export const hostRoom = async (req, res) => {
    let roomCode;
    try {
        while (!roomCode) {
            roomCode = generateRoomCode(10);
            if (await activeRoomSchema.exists({ roomCode: roomCode })) roomCode = undefined;
        }
        // console.log(req.user);
        const newRoom = new activeRoomSchema({
            roomCode: roomCode,
            host: req?.user?.username
        });
        await newRoom.save();
        res.json({ roomCode: roomCode });
        const boardNumbers = new Set();
        for (let i = 1; i <= 90; i++) {
            boardNumbers.add(i);
        }
        roomBoardNumbers.set(roomCode, boardNumbers);
        // console.log(roomBoardNumbers);
    } catch (e) {
        console.log("Error while generating room code : ", e);
        res.status(500).json({ message: "Error while generating room code" });
    }
}

export const joinRoom = async (roomCode, username) => {
    try {
        const roomDetails = await activeRoomSchema.findOne({ roomCode: roomCode });
        roomDetails.members.push(username);
        await roomDetails.save();
        return roomDetails;
    }
    catch (e) {
        console.log("Error while joining room : ", e);
    }
}

function generateRoomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
