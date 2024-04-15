import activeRoomSchema from '../DBmodel/activeRoomSchema.js';

export const hostRoom = async (req, res) => {
    let roomCode;
    try {
        console.log("Inside host room");
        while (!roomCode) {
            roomCode = generateRoomCode(10);
            if (await activeRoomSchema.exists({ roomCode: roomCode })) roomCode = undefined;
        }
        const newRoom = new activeRoomSchema({
            roomCode: roomCode,
            host: req?.user?.username
        });
        await newRoom.save();
        res.status(200).json({ roomCode: roomCode });
    } catch (e) {
        console.log("Error while generating room code : ", e);
        res.status(500).json({ message: "Error while generating room code" });
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