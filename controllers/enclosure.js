const User = require('../models/user')
const Note = require('../models/note')
const Enclosure = require('../models/enclosure')

const newEnclosure = async (req, res) => {
    let user = await User.findById(req.params.userid).exec()
    if(!user){
        return res.status(404).json("user does not exist")

    }
    console.log(user)
    let newEnclosure = new Enclosure({
        name: req.body.name,
        notes: [],
        creator: req.params.userid,
        dateCreated: Date.now()
    })
    user.EnclosurePossesed.push(newEnclosure._id)
    await newEnclosure.save()
    await user.save()
    return res.status(200).json(true)
}

const getAllEnclosure = (req, res) => {
    Enclosure.find({}, (err, data) => {
        if (err) {
            return res.json({ Error: err });
        }
        return res.json(data);
    })
};

const getEnclosureById = async (req, res) => {
    let enclosure = await Enclosure.findById(req.params.id).exec()
    if (!enclosure) {
        return res.status(404).json({ message: "Enclosure does not exist" })
    }
    return res.json(enclosure).status(200)
}

const serchEnclosure = async (req, res) => {
    let user = await User.findById(req.params.id).exec()
    if (!user) {
        return res.status(404).json({ message: "User does not exist" })
    }
    console.log(user)
    let enclosure = await Enclosure.find({ _id: user.EnclosurePossesed }).exec()
    console.log(enclosure)
    const filteredArray = enclosure.filter(element => {
        return element.name.includes(req.body.name);
      });
      
    return res.status(200).json(filteredArray)
}

const deleteEnclosure = async (req, res) => {
    let enclosure = await Enclosure.findById(req.params.id).exec()
    if (!enclosure) {
        return res.status(404).json({ message: "Enclosure does not exist" })
    }
    await enclosure.remove()
    return res.status(200).json({ message: "Enclosure deleted" })
}

const getAllEnclosureByUser = async (req, res) => {
    let user = await User.findById(req.params.userid).exec()
    if (!user) {
        return res.status(404).json({ message: "User does not exist" })
    }
    let enclosures = user.EnclosurePossesed;
    
   
    return res.status(200).json(await Enclosure.find({ _id: enclosures }).exec())
}

const shareEnclosure = async (req, res) => {
    let userTobeShared =  await User.findOne({ mail: req.body.mail }).exec()
    let enclosureTobeShared = req.body.enclosure

    if (!userTobeShared) {
        return res.status(404).json({ message: "User does not exist" })
    }
    if(userTobeShared.EnclosurePossesed.includes(enclosureTobeShared)){
        return res.status(409).json({ message: "Enclosure already possesed" })
    }
    userTobeShared.EnclosurePossesed.push(enclosureTobeShared)
    await userTobeShared.save()

    return res.status(200).json({ message: "Enclosure shared" })
}

module.exports = { 
    newEnclosure,   
    getAllEnclosure,
    getEnclosureById,
    deleteEnclosure,
    getAllEnclosureByUser,
    shareEnclosure,
    serchEnclosure

}





