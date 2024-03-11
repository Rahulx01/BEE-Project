import activeRoomSchema from '../DBmodel/activeRoomSchema.js';
import { roomStateMap } from '../index.js';

export const hostRoom = async (req, res) => {
    let roomCode;
    try {
        while (!roomCode) {
            roomCode = generateRoomCode(10);
            if (await activeRoomSchema.exists({ roomCode: roomCode })) roomCode = undefined;
        }
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
        roomStateMap.set(roomCode, { host: req?.user?.username, roomActiveStatus: false, boardNumbers: boardNumbers });
    } catch (e) {
        console.log("Error while generating room code : ", e);
        res.status(500).json({ message: "Error while generating room code" });
    }
}

export const joinRoom = async (roomCode, username) => {
    try {
        const roomDetails = await activeRoomSchema.findOne({ roomCode: roomCode });
        const members = roomDetails.members;
        for (let i = 0; i < members.length; i++) {
            if (members[i] === username) return roomDetails;
        }
        if (roomStateMap.get(roomCode).roomActiveStatus) return null;
        members.push(username);
        await roomDetails.save();
        return roomDetails;
    }
    catch (e) {
        console.log("Error while joining room : ", e);
    }
}

export const whoIsHost = async (roomCode) => {
    try {
        const roomDetails = await activeRoomSchema.findOne({ roomCode: roomCode });
        return roomDetails.host;
    }
    catch (e) {
        console.log("Error while getting host details : ", e);
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
