const express = require('express'); 

const router = express.Router();

const noteController = require('../controllers/note');

router.post('/note/:enclosureid', noteController.newNote)

router.get('/note', noteController.getAllNote)

router.get('/note/:id', noteController.getNoteById)

router.delete('/note/:id', noteController.deleteNote)

router.get('/note/enclosure/:enclosureid', noteController.getAllNoteByEnclosure)

router.put('/note/update/:id', noteController.updateNote)



module.exports = router;
