import jwt from "jsonwebtoken";

export const tokenAuthentication = (req, res, next) => {
    console.log("Inside token authentication", req.headers?.cookie);
    const JWtoken = (req.headers?.cookie)?.replace("token=", "");
    if (!JWtoken) {
        return res.status(401).send("Unauthorized: No token provided");
    }
    try {
        const user = jwt.verify(JWtoken, "THISISMYSECRETKEYFORMYSECRETPROJECT");
        req.user = { username: user?.username };
        res.status(200);
        next();
    }
    catch (err) {
        return res.status(401).send("Unauthorized: No token provided");
    }
}

export const getUserDetails = (req, res, next) => {
    res.json(req.user);
    next();
}   