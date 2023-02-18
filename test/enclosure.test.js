const request = require('supertest');
const ser = require('../server');
const app = ser.app;
const lisener = ser.listener;
const Note = require('../models/note');
const Enclosure = require('../models/enclosure');
const mongoose = require('mongoose');
const User = require('../models/user');
const kill = require('kill-port');
const { serve } = require('swagger-ui-express');
const { conn } = require('../server');

describe('enclosureController', () => {
    let enclosure;
    let note;
    let user;



    beforeAll(async () => {

        /*await mongoose.connect(
            "mongodb+srv://marcodemo:AkOCEAVpdDzTwxCW@cluster0.ejoavk6.mongodb.net/?retryWrites=true&w=majority",
            { useNewUrlParser: true, useUnifiedTopology: true },
            (err) => {
                if (err) return console.log("Error: ", err);
            }

        );*/

        console.log("MongoDB Connection mannaggina-- Ready state is:", mongoose.connection.readyState);

    })

    afterAll(async () => {
        //console.log(await mongoose.connection.close())
        //await lisener.close();
        //kill(8080)
        //conn.close();
        //mongoose.connection.close();
        await User.deleteMany({ mail: 'Test User' })
        //await app.listeners('close');
    })

    afterEach(async () => {

        await User.deleteMany({ mail: 'Test User' })

        await enclosure.remove()
        await note.remove()
        await user.remove()
    });


    beforeEach(async () => {


        User.deleteMany({ mail: 'Test User' })


        user = new User({
            mail: 'Test User',
            password: 'Test Password'
        })

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
        user.EnclosurePossesed.push(enclosure._id);
        enclosure.notes.push(note._id);
        await note.save();
        await enclosure.save();
        await user.save();

    })

    describe('newEnclosure', () => {

        test('creates a new enclosure', async () => {


            const res = await request(app)
                .post(`/enclosure/${user._id}`)
                .send({
                    name: 'Test Enclosure1',
                    notes: [],
                    creator: user._id,
                    dateCreated: Date.now()
                })
            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(true);
            enclosure.remove();

        })
    })

    describe('getEnclosurebyId', () => {
        test('gets enclosure by id', async () => {
            console.log(user)
            const res = await request(app)
                .get(`/enclosure/${enclosure._id}`)
            expect(res.statusCode).toEqual(200)
            let s1 = "" + res.body._id;
            let s2 = "" + enclosure._id;
            expect(s1).toEqual(s2);
        })
    })

    describe('searchEnclosure', () => {
        let user;
        let enclosure1;
        let enclosure2;

        beforeEach(async () => {
            user = new User({
                mail: 'test@test.com',
                password: 'password'
            });
            enclosure1 = new Enclosure({
                name: 'Test Enclosure 1',
                notes: [],
                creator: user._id,
                dateCreated: Date.now()
            });
            enclosure2 = new Enclosure({
                name: 'Test Enclosure 2',
                notes: [],
                creator: user._id,
                dateCreated: Date.now()
            });
            user.EnclosurePossesed = [enclosure1._id, enclosure2._id];
            await user.save();
            await enclosure1.save();
            await enclosure2.save();
        });

        afterEach(async () => {
            await user.remove();
            await enclosure1.remove();
            await enclosure2.remove();
        });

        test('returns an array of enclosures that match the search query', async () => {
            const res = await request(app)
                .get(`/enclosure/search/${user._id}`)
                .send({ name: 'Test Enclosure 1' });
            expect(res.statusCode).toEqual(200);
            expect(res.body[0].name).toEqual('Test Enclosure 1');
        });

        test('returns an empty array if no enclosures match the search query', async () => {
            const res = await request(app)
                .get(`/enclosure/search/${user._id}`)
                .send({ mail: 'Non-existent Enclosure' });
            expect(res.statusCode).toEqual(200);
        });

        test('returns an error if user does not exist', async () => {
            await user.remove();
            const res = await request(app)
                .get(`/enclosure/search/${user._id}`)
                .send({ mail: 'Test Enclosure 1' });
            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toEqual('User does not exist');
        });

    });

    describe('deleteEnclosure', () => {
        test('deletes an enclosure', async () => {
            const res = await request(app)
                .delete(`/enclosure/${enclosure._id}`)
                .send()
            expect(res.statusCode).toEqual(200)
            expect(res.body.message).toEqual("Enclosure deleted")
            const enclosureDeleted = await Enclosure.findById(enclosure._id)
            expect(enclosureDeleted).toBeNull()
        })

        test('returns 404 if enclosure does not exist', async () => {
            const res = await request(app)
                .delete(`/enclosure/5f5b5e5c5e5f5c5d5e5c5d5f`)
                .send()
            expect(res.statusCode).toEqual(404)
            expect(res.body.message).toEqual("Enclosure does not exist")
        })
    })
    beforeEach(async () => {
        await User.deleteMany({ mail: 'Test User' })

        user = new User({
            mail: 'Test User',
            password: 'Test Password'
        })

        enclosure = new Enclosure({
            name: 'Test Enclosure',
            notes: [],
            creator: 'Test Creator',
            dateCreated: Date.now()
        });

        user.EnclosurePossesed.push(enclosure._id);
        await enclosure.save();
        await user.save();
    })

    describe('getAllEnclosureByUser', () => {
        test('returns all enclosures belonging to a user', async () => {
            const res = await request(app)
                .get(`/enclosure/user/${user._id}`)
            expect(res.statusCode).toEqual(200)
            expect(res.body.length).toEqual(1)
            let s1 = "" + res.body[0]._id;
            let s2 = "" + enclosure._id;
            expect(s1).toEqual(s2)
        })

        test('returns an error if the user does not exist', async () => {
            const res = await request(app)
                .get(`/enclosure/user/123456789012`)
            expect(res.statusCode).toEqual(404)
            expect(res.body).toEqual({ message: "User does not exist" })
        })
    })
    describe('shareEnclosure', () => {

        let user2;
        let enclosure2;


        beforeEach(async () => {
            user2 = new User({
                mail: 'CIAO@semplicementeciao',
                password: 'password'
            });
            enclosure2 = new Enclosure({
                name: 'Test Enclosure 2',
                notes: [],
                creator: user._id,
                dateCreated: Date.now()
            });
            user2.save();
        })
        afterEach(async () => {
            await user2.remove();
            await enclosure2.remove();
        })
        



        it('should share an enclosure with a user', async () => {

            const response = await request(app)
                .put('/enclosure/share')
                .send({ mail: user2.mail, enclosure: enclosure._id })
                .expect(200)

            expect(response.body.message).toBe('Enclosure shared')

            // Check if the user2 now has the shared enclosure
            const updatedUser = await User.findById(user2._id).exec()
            expect(updatedUser.EnclosurePossesed).toContainEqual(enclosure._id)
        })

        it('should return 404 if the user to be shared does not exist', async () => {
            const response = await request(app)
                .put('/enclosure/share')
                .send({ mail: 'invalid@example.com', enclosure: enclosure._id })
                .expect(404)

            expect(response.body.message).toBe('User does not exist')
        })

        it('should return 409 if the enclosure is already possessed by the user', async () => {
            // Share the enclosure with user2 first
            user.EnclosurePossesed.push(enclosure._id)
            await user.save()

            // Try to share the same enclosure with user2 again
            const response = await request(app)
                .put('/enclosure/share')
                .send({ mail: user.mail, enclosure: enclosure._id })
                .expect(409)

            expect(response.body.message).toBe('Enclosure already possesed')
        })
    })



})     