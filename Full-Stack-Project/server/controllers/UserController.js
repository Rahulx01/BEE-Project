import userSchema from '../DBmodel/userSchema.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const jwtForUser = process.env.JWT_KEY_FOR_AUTH;

export const register = async (req, res) => {
    try {
        const { email, uname, passwd } = req.body;
        if (!email || !uname || !passwd) {
            return res.status(400).json({ error: "Payload missing" });
        }
        if (await userSchema.findOne({ username: uname })) {
            return res.status(409).json({ error: "Username already exists" });
        }
        let token = generateToken(uname, passwd);
        const newUser = new userSchema({
            email: email,
            username: uname,
            password: passwd
        });
        await newUser.save();
        // const options = {
        //     expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        //     sameSite: "none",
        //     httpOnly: true,
        //     secure: true,
        // };
        console.log("This is from register token ", token);
        res.cookie("token", token);
        return res.sendStatus(200);
    } catch (err) {
        console.log("This is from register error ", err);
    }
}

export const login = async (req, res) => {
    try {
        const user = await userSchema.findOne({ username: req.body.uname, password: req.body.passwd });
        if (user) {
            // Username and password combination exists in MongoDB
            let token = generateToken(req.body.uname, req.body.passwd);
            // const options = {
            //     expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            //     sameSite: "none",
            //     httpOnly: true,
            //     secure: true,
            // };
            res.cookie("token", token);
            return res.sendStatus(200);
        } else {
            // Username and password combination does not exist in MongoDB
            return res.status(404).json({ msg: "Invalid username or password." });
        }
    }
    catch (err) {
        console.log("Error occurred during login:", err);
        return res.status(500).json({ msg: "Internal server error" });
    }
}


function generateToken(uname, passwd) {
    let token;
    try {
        token = jwt.sign({ username: uname, passwd: passwd }, jwtForUser);
    }
    catch (err) {
        console.log(err);
    }
    return token;
}

