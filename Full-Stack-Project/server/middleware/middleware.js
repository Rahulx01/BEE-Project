import jwt from "jsonwebtoken";

export const tokenAuthentication = (req, res, next) => {
    const JWtoken = (req.headers?.cookie)?.replace("JWtoken=", "");
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

export const getUserDetails = (req, res, next) => {
    res.json(req?.user);
    next();
}