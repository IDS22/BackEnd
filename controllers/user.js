const User = require('../models/user')
const tokenCollection = require("../models/token");
const jwt = require("jsonwebtoken");
const Enclosure = require('../models/enclosure');

const getAllUser = (req, res) => { 
    User.find({}, (err, data) => {
        if (err) {
            return res.json({ Error: err });
        }
        return res.json(data);
    })
};


const newUser = (req, res) => {
    User.findOne({ mail: req.body.mail }, (err, data) => {

        if (!data) {

            const newUser = new User({
                mail: req.body.mail,
                password: req.body.password
            })

            newUser.save((err, data) => {
                if (err) return res.json( `Something went wrong, PD. ${err}` );
                return res.status(200).json(data);
            })
        } else {
            if (err) return res.json(`Something went wrong, please try again. ${err}`);
            return res.status(409).json({ message: "User already exists" });
        }
    })
};

const login = async (req, res) => {
    User.findOne({ mail: req.body.mail }, (err, data) => {
        if(!data) return res.status(404).json({
            login: false,
            AccessToken: null});

        if(data.password == req.body.password){
            console.log(data._id);
            const AccessToken = jwt.sign({password: data.password, mail: data.mail, userId: data._id}, process.env.ACCESS_JWTkey, {expiresIn: '15s' });
            const ttoken = new tokenCollection({
                token: AccessToken
            })
            ttoken.save();

            let enclosures = data.EnclosurePossesed;
           
            //res.json({token: AccessToken});
            // = tokenController.generateToken({user: data});
            return res.json({login:true, AccessToken: AccessToken});
        }else{
            res.status(401).json(false);
            console.log("Wrong password");
        }
    })
}

const deleteUser = async (req, res) => {
    let user = await User.findById(req.params.id).exec()
    if (!user) {
        return res.status(404).json({ message: "User does not exist" })
    }
    await user.remove()
    return res.status(200).json({ message: "User deleted" })
    

    
}

const getUserById = async (req, res) => {
    let user = await User.findById(req.params.id).exec()
    if (!user) {
        return res.status(404).json({ message: "User does not exist" })
    }
    return res.json(user).status(200)
}

module.exports = {
    getAllUser,
    newUser,
    login,
    deleteUser,
    getUserById
}