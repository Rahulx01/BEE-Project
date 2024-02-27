import jwt from 'jsonwebtoken';     //Auth Js

export function generateToken(uname, passwd){
    let token;
    try{
        token = jwt.sign({username: uname, passwd: passwd}, "THISISMYSECRETKEYFORMYSECRETPROJECT");
    }
    catch(err){
        console.log(err);
    }
    return token;
}