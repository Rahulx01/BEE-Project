import activeRoomSchema from "../DBmodel/activeRoomSchema.js";
import previousRoomSchema from "../DBmodel/previousGames.js";

export const joinRoom = async (roomCode, username) => {
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

export const getRoomDetails = async (roomCode) => {
    try {
        const roomDetails = await activeRoomSchema.findOne({ roomCode: roomCode });
        return roomDetails;
    }
    catch (e) {
        console.log("Error while getting room details : ", e);
        return false;
    }
}

export async function abortRoom(roomCode) {
    try {
        //yet to implement
        const roomDetails = await activeRoomSchema.findOne({ roomCode: roomCode });
        const previousRoom = new previousRoomSchema({
            roomCode: roomDetails.roomCode,
            host: roomDetails.host,
            members: roomDetails.members,
            firstLine: roomDetails.firstLine,
            secondLine: roomDetails.secondLine,
            thirdLine: roomDetails.thirdLine,
            house: roomDetails.house,
            createdAt: roomDetails.createdAt
        });
        await previousRoom.save();
        // await activeRoomSchema.deleteOne({ roomCode: roomCode });

    }
    catch (e) {
        console.log("Error while aborting room : ", e);
    }
}