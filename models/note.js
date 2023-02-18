const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String},
    dateCreated: {type: Date, required: true},
    dateLastModified: {type: Date}

})

const Note = mongoose.model('noteSchema', noteSchema)
module.exports = Note