const mongoose = require("mongoose")
const ObjectId = require('mongoose').Types.ObjectId


const enclosureSchema = new mongoose.Schema({
    name: {type: String, required: true},
    notes: [{type: ObjectId, ref: 'Note'}],
    creator: {type: ObjectId, ref: 'User'},
    dateCreated: {type: Date, required: true},
})

const Enclosure = mongoose.model('enclosureSchema', enclosureSchema)
module.exports = Enclosure
