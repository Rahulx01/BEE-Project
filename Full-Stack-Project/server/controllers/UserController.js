import userSchema from '../DBmodel/userSchema.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
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
        console.log("This is from register error ", err);
    }
}

export const login = async (req, res) => {
    try{
        const user = await userSchema.findOne({ username: req.body.uname, password: req.body.passwd });
        if (user) {
            // Username and password combination exists in MongoDB
            let token = generateToken(req.body.uname, req.body.passwd);
            res.json({token:token});
        } else {
            // Username and password combination does not exist in MongoDB
            return res.status(404).json({ msg: "Invalid username or password." });
        }
    }
    catch(err){
        console.log("This is from login error ", err);
    }
}

function generateToken(uname, passwd){
    let token;
    try{
        token = jwt.sign({username: uname, passwd: passwd}, "THISISMYSECRETKEYFORMYSECRETPROJECT");
    }
    catch(err){
        console.log(err);
    }
    return token;
}

