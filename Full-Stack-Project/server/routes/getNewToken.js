import jwt from 'jsonwebtoken';     //Auth Js

export function generateToken(username){
    let token;
    try{
        token = jwt.sign({user:username}, "THISISMYSECRETKEYFORMYSECRETPROJECT");
    }
    catch(err){
        console.log(err);
    }
    return token;
}