const jwt = require("jsonwebtoken");
const tokenCollection = require("../models/token");
require("dotenv").config();



const verifyToken = (req, res, next) => {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];


    if (token == null) {
        return res.status(401).json({ message: "Access Denied. No Token Provided." });
    }

    try {

        jwt.verify(token, process.env.ACCESS_JWTkey, (err, user) => {
            if (err) {
                return res.status(403).json(err);
            }
            console.log(user);
            res.json({user: user, access: true});
            next();
        });
        

    } catch (error) {

        return res.status(400).json({ message: "Invalid Token." });
    
    }
};

const refreshTokens = (req, res) => {
    const refreshToken = req.body.token;
}

const generateToken = (req, res) => {
    const user = req.body.user;
    const token = jwt.sign(user, process.env.ACCESS_JWTkey, {expiresIn: '100', clockTimestamp: Math.floor(Date.now() / 1000) });
    const ttoken = new tokenCollection({
        token: token
    })
    ttoken.save();
    res.json({token: token});
}

 
/*function  generateToken(user) {
    
    
    token = jwt.sign(user, process.env.ACCESS_JWTkey, {expiresIn: '15s' });
    ttoken = new tokenCollection({
        token: token
    })
    ttoken.save();

    return token;

}*/

module.exports = {
    verifyToken,
    generateToken
}
