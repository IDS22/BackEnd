const request = require('supertest');
const ser = require('../server');
const app = ser.app;
const lisener = ser.listener;
const express = require('express');
const Note = require('../models/note');
const Enclosure = require('../models/enclosure');
const mongoose = require('mongoose');
const kill = require('kill-port');
const User = require('../models/user');
const { conn } = require('../server');

describe('noteController', () => {
    let enclosure;
    let note;

    beforeAll(async () => {

        /*await mongoose.connect(
            "mongodb+srv://marcodemo:AkOCEAVpdDzTwxCW@cluster0.ejoavk6.mongodb.net/?retryWrites=true&w=majority",
            { useNewUrlParser: true, useUnifiedTopology: true },
            (err) => {
                if (err) return console.log("Error: ", err);
                console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
            }

        );*/
    })

    afterAll(async () => {
        //conn.close();
        //kill(8080)
        console.log("MongoDB Connection mannaggina-- Ready state is:", mongoose.connection.readyState);

        //await mongoose.connection.close();
    })

    beforeEach(async () => {
        User.deleteMany({mail: 'Test User'})


        enclosure = new Enclosure({
            name: 'Test Enclosure',
            notes: [],
            creator: 'Test Creator',
            dateCreated: Date.now()
        });

        note = new Note({
            title: 'Test Note',
            content: 'Test Content',
            enclosure: enclosure._id,
            dateCreated: Date.now()
        });
        enclosure.notes.push(note._id);
        await note.save();
        await enclosure.save();
    });

    afterEach(async () => {
        User.deleteMany({mail: 'Test User'})

        await enclosure.remove()
        await note.remove()
    });








    //NEW NOTE
    describe('newNote', () => {
        test('creates a new note', async () => {
            //lisener.close();
            //kill(8080);
            const res = await request(app)
                .post(`/note/${enclosure._id}`)
                .send({
                    title: 'New Note',
                    content: 'New Content'
                });

            expect(res.status).toBe(200);
            expect(res.body).toBe(true);
        });

        test('returns an error if note already exists', async () => {
            const res = await request(app)
                .post(`/note/${enclosure._id}`)
                .send({
                    title: 'Test Note',
                    content: 'Test Content'
                });

            expect(res.status).toBe(409);
            expect(res.body.message).toBe('Note already exists');
        });
    });

    //GET NOTE BY ID
    describe('Get note by id', () => {
        it('should return a note with a given id', async () => {
            const note = await Note.findOne({ title: 'Test Note' });
            const response = await request(app).get(`/note/${note._id}`);
            expect(response.status).toBe(200);
            expect(response.body.title).toEqual(note.title);
            expect(response.body.content).toEqual(note.content);
        });

        it('should return 404 if a note with the given id does not exist', async () => {
            /*let test = new Note({
                title: 'Test Note12',
                content: 'Test Content',
                dateCreated: Date.now()}
            );
            test.save();*/
            //const ID = test._id;


            const removedNote = await note.remove();
            const response = await request(app).get(`/note/${note._id}`);

            expect(removedNote._id.toString()).toEqual(note._id.toString());
            expect(response.status).toBe(404);
            expect(response.body.message).toEqual('Note does not exist');
        });
    });






    describe('DELETE note', () => {
        it('should return 404 if note not found', async () => {
            //const note = await Note.findOne({ title: 'Test Note' });
            note.remove()
            const res = await request(app)
                .delete(`/note/${note._id}`)

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ message: "Note does not exist" });
        });

        it('should return 204 if note successfully deleted', async () => {


            const res = await request(app)
                .delete(`/note/${note._id}`)


            expect(res.status).toBe(200);
            expect(await Note.findById(note._id)).toBeNull();
        });

    });

    //GET ALL NOTE BY ENCLOSURE
    describe('Get all note by enclosure', () => {
        it('should return all notes with a given enclosure id', async () => {
            const note = await Note.findOne({ title: 'Test Note' });
            const response = await request(app).get(`/note/enclosure/${enclosure._id}`);
            expect(response.status).toBe(200);
            expect(response.body[0].title).toEqual(note.title);
            expect(response.body[0].content).toEqual(note.content);
        });

        it('should return 404 if a note with the given enclosure id does not exist', async () => {
            /*let test = new Note({
                title: 'Test Note12',
                content: 'Test Content',
                dateCreated: Date.now()}
            );
            test.save();*/
            //const ID = test._id;

await enclosure.remove()
            const response = await request(app).get(`/note/enclosure/${enclosure._id}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toEqual('Enclosure does not exist');
        });
    });

})








