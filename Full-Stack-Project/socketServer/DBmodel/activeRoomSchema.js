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
    roomActiveStatus: {
        type: Boolean,
        default: false
    },
    boardNumbers: {
        type: [Number],
        default: () => {
            const numberArr = new Array(90);
            for (let i = 1; i <= 90; i++) {
                numberArr[i - 1] = i;
            }
            return numberArr;
        }
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => new Date()
    }
});

const activeRoomSchema = mongoose.model('Active-Room', activeRoom);

export default activeRoomSchema;