import mongoose from 'mongoose';

const user = new mongoose.Schema({
    email:{
        type:String,
        require:true,
        lowercase: true
    },
    username:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => new Date()
    }
});

const userSchema = mongoose.model('user',user);
export default userSchema;    