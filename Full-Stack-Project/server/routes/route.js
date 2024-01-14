import express from 'express';
import userSchema from '../DBmodel/userSchema.js';
import { generateToken } from './getNewToken.js';
import { generateRoomCode } from './getNewRoomCode.js';
import activeRoomSchema from '../DBmodel/activeRoomSchema.js';


const route = express.Router();

// Define routes...

route.get('/', async (req, res) => {
    try {
        // const JWtoken = req.headers.authorization? req.headers.authorization : (req.headers.cookie).replace("JWtoken=", "");
        const JWtoken = (req.headers.cookie).replace("JWtoken=", "");
        console.log(JWtoken);
        if (JWtoken == undefined) return res.status(401).json({message:"The token is undefined!"});
        const user = await userSchema.findOne({ token: JWtoken });
        console.log(user);
        if (user)   return res.json({user: user}); // User is logged in
        else    return res.status(401).json({message:"The token is undefined!"});  // User is not logged in

    } catch (error) {
        // console.log(error);
        res.status(500).json({ message: "uff Internal Server Error" });
    }
});


route.post('/login', async (req, res) => {
    const user = await userSchema.findOne({ username: req.body.uname, password: req.body.passwd });
    if (user) {
        // Username and password combination exists in MongoDB
        let token = generateToken(req.body.uname);
        try {
            // res.cookie("JWtoken", token, {
            //     expires: new Date(Date.now() + 6900000),
            //     withCredentials: true,
            //     httpOnly: true,
            //     secure: true,
            //     sameSite: "None"
            // });
            user.token = token;
            await user.save();
            res.json({user: user});
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
            return res.status(422).json({ error: "Plz filled the field properly" });
        }
        if (await userSchema.findOne({ username: uname })) {
            return res.status(422).json({ error: "This username already exists!" });
        }
        console.log("yes received");
        let token = generateToken(uname);
        const newUser = new userSchema({
            email: email,
            username: uname,
            password: passwd,
            token:token
        });
        // res.cookie("JWtoken", token, {
        //     expires: new Date(Date.now() + 2592000),
        //     withCredentials: true,
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "None"
        // });
        await newUser.save();
        res.status(201).json({user: newUser});
    } catch (err) {
        console.log("This is from yudhister error ", err);
    }
});

route.get("/host",async (req,res) => {
    
    const JWtoken = req.headers.authorization? req.headers.authorization : (req.headers.cookie).replace("JWtoken=", "");
    const user = await userSchema.findOne({ token: JWtoken });
    if(!user) return res.status(200).json({message:"User not logsged in"});
    let roomCode;
    try{
        let room = true;
        while(room){
            roomCode = generateRoomCode(10);
            room = await activeRoomSchema.findOne({roomCode:roomCode});
        }
        const newRoom = new activeRoomSchema({
            roomCode: roomCode,
            host: user.username
        });
        await newRoom.save();
    }catch(e){
        console.log("The error is : ",e);
    }
    // console.log("room code : ",roomCode);
    return res.status(200).json({message:"Succesfull",roomCode:roomCode});
});

route.get('/:roomcode',async (req,res) => {
    const JWtoken = req.headers.authorization? req.headers.authorization : (req.headers.cookie).replace("JWtoken=", "");
    const user = await userSchema.findOne({ token: JWtoken });
    const roomcode = req.params.roomcode;
    const room = await activeRoomSchema.findOne({roomCode:roomcode});
    if(room){
        if(user && room.host == user.username) return res.status(200).json({message:"you r host",room: room});
        else{
            room.members.addToSet(user.username);
            await room.save();
            return res.status(201).json({message:"you r member",room: room});
        }
    }
    return res.status(203).json({message:"No room found"});
});

export default route;

