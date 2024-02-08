import express from 'express';
import userSchema from '../DBmodel/userSchema.js';
import { generateToken } from './getNewToken.js';
import { generateRoomCode } from './getNewRoomCode.js';
import activeRoomSchema from '../DBmodel/activeRoomSchema.js';
import jwt from 'jsonwebtoken';

const route = express.Router();
//Define middeware
const tokenAuthentication = (req, res, next) => {
    const JWtoken = (req.headers?.cookie)?.replace("JWtoken=", "");
    // console.log(JWtoken);
    try {
        const user = jwt.verify(JWtoken, "THISISMYSECRETKEYFORMYSECRETPROJECT");
        req.user = {username: user?.username};
        res.status(200);
        next();
    }
    catch(err) {
        // console.log("error occured while authenticating",err);
        return res.status(401);
        // .json({ message: "Invalid token" });
    }
}

const getUserDetails = (req, res, next) => {
    res.json(req?.user);
    next();
}
    
// Define routes...

route.get('/me', tokenAuthentication, getUserDetails);

route.post('/login', async (req, res) => {
    const user = await userSchema.findOne({ username: req.body.uname, password: req.body.passwd });
    if (user) {
        // Username and password combination exists in MongoDB
        let token = generateToken(req.body.uname, req.body.passwd);
        try {
            user.token = token;
            await user.save();
            // res.cookie('token')
            res.json({token:token});
        } catch (e) {
            console.log("I am catch error " + e);
        }
    } else {
        // Username and password combination does not exist in MongoDB
        return res.status(404).json({ msg: "Invalid username or password." });
    }
});


route.post('/Yudhister', async (req, res) => {
    try {
        const { email, uname, passwd } = req.body;
        if (!email || !uname || !passwd) {
            return res.status(400).json({ error: "Payload missing" });
        }
        if (await userSchema.findOne({ username: uname })) {
            return res.status(409);
        }
        let token = generateToken(uname, passwd);
        const newUser = new userSchema({
            email: email,
            username: uname,
            password: passwd
        });
        await newUser.save();
        res.status(201).json({token: token});
    } catch (err) {
        console.log("This is from yudhister error ", err);
    }
});

route.get("/host",tokenAuthentication,async (req,res) => {
    let roomCode;
    try{
        while(!roomCode){
            roomCode = generateRoomCode(10);
            if(await activeRoomSchema.exists({roomCode:roomCode})) roomCode = undefined;
        }
        const newRoom = new activeRoomSchema({
            roomCode: roomCode,
            host: req?.username
        });
        await newRoom.save();
        res.json({roomCode:roomCode});
    }catch(e){
        console.log("Error while generating room code : ",e);
        res.status(500).json({message: "Error while generating room code"});
    }
});

// route.get("/join", tokenAuthentication, async (req,res) => {
//     if(await activeRoomSchema.exists({roomCode:roomCode})) roomCode = undefined;
// });

// route.get('/room/:roomcode',async (req,res) => {
//     const JWtoken = req.headers.authorization? req.headers.authorization : (req.headers.cookie).replace("JWtoken=", "");
//     const user = await userSchema.findOne({ token: JWtoken });
//     const roomcode = req.params.roomcode;
//     const room = await activeRoomSchema.findOne({roomCode:roomcode});
//     if(room){
//         if(user && room.host == user.username) return res.status(200).json({message:"you r host",room: room});
//         else{
//             room.members.addToSet(user.username);
//             await room.save();
//             return res.status(201).json({message:"you r member",room: room});
//         }
//     }
//     return res.status(203).json({message:"No room found"});
// });
export default route;

