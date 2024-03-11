import mongoose from 'mongoose';

const activeRoom = new mongoose.Schema({
    roomCode: {
        type: String,
        require: true
    },
    host: {
        type: String,
        require: true
    },
    members: [String],
    firstLine: String,
    secondLine: String,
    thirdLine: String,
    house: String,
    createdAt: {
        type: Date,
        immutable: true,
        default: () => new Date()
    }
});

const activeRoomSchema = mongoose.model('Active-Room', activeRoom);

export default activeRoomSchema;