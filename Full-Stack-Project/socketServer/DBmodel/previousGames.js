import mongoose from "mongoose";

const previousRoom = new mongoose.Schema({
    roomCode: {
        type: String,
        require: true
    },
    host: {
        type: String,
        require: true
    },
    members: [String],
    firstLine: {
        type: String,
        default: ""
    },
    secondLine: {
        type: String,
        default: ""
    },
    thirdLine: {
        type: String,
        default: ""
    },
    house: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => new Date()
    }
});

const previousRoomSchema = mongoose.model('Previous-Room', previousRoom);


export default previousRoomSchema;