const User = require('../models/user')
const Note = require('../models/note')
const Enclosure = require('../models/enclosure')

const newNote = async (req, res) => {
    let enclosure = await Enclosure.findById(req.params.enclosureid).exec()
    if (!enclosure) {
        return res.status(404).json({ message: "Enclosure not found" });
    }
    let notess = await Note.find({ _id: enclosure.notes }).exec()

    let noteExists = null;
    if (!(enclosure.notes.length == 0)) {
        noteExists = notess.some(note => note.title == req.body.title);
    }


    if (noteExists) {
        return res.status(409).json({ message: "Note already exists" });
    }
    let newNote = new Note({
        title: req.body.title,
        content: req.body.content,
        enclosure: enclosure._id,
        dateCreated: Date.now()
    })
    enclosure.notes.push(newNote._id)
    await newNote.save()
    await enclosure.save()
    return res.status(200).json(true)
}

const getAllNote = (req, res) => {
    Note.find({}, (err, data) => {
        if (err) {
            return res.json({ Error: err });
        }
        return res.json(data);
    })
}

const getNoteById = async (req, res) => {
    let note = await Note.findById(req.params.id).exec()
    if (!note) {
        return res.status(404).json({ message: "Note does not exist" })
    } else {
        return res.status(200).json(note)
    }
}


const deleteNote = async (req, res) => {
    let note = await Note.findById(req.params.id).exec()
    if (!note) {
        return res.status(404).json({ message: "Note does not exist" })
    }
    await note.remove()
    return res.status(200).json({ message: "Note deleted" })
}

const getAllNoteByEnclosure = async (req, res) => {
    let enclosure = await Enclosure.findById(req.params.enclosureid).exec()
    if (!enclosure) {
        return res.status(404).json({ message: "Enclosure does not exist" })
    }
    let notes = enclosure.notes;

    return res.status(200).json(await Note.find({ _id: notes }).exec())
}

const updateNote = async (req, res) => {
    let note = await Note.findById(req.params.id).exec()
    if (!note) {
        return res.status(404).json({ message: "Note does not exist" })
    }
    note.content = req.body.content
    note.save()
    return res.status(200).json({ message: "Note updated" })
}

module.exports = {
    newNote,
    getAllNote,
    getNoteById,
    deleteNote,
    getAllNoteByEnclosure,
    updateNote
}
