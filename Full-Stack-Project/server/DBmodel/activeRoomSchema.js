import mongoose from 'mongoose';

const activeRoom = new mongoose.Schema({
    roomCode:{
        type:String,
        require:true
    },
    host:{
        type:String,
        require:true
    },
    members: [String]
});

const activeRoomSchema = mongoose.model('Active-Room',activeRoom);

export default activeRoomSchema;