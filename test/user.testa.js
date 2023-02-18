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

describe('POST /user', () => {

    let enclosure;
    let note;
    let user;


    beforeEach(async () => {
        enclosure = new Enclosure({
            name: 'Test Enclosure',
            description: 'Test Description',
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
        user = new User({
            mail: 'Test User',
            password: 'Test Password'
        });
        user.EnclosurePossesed.push(enclosure._id);

        enclosure.notes.push(note._id);
        await user.save();
        await note.save();
        await enclosure.save();
    });


    afterEach(async () => {

        await user.remove();
        await enclosure.remove();
        await note.remove();

    })

    test('should create a new user', async () => {


        const res = await request(app)
            .post('/user')
            .send({ mail: "email12345", password: "password" })
            .expect(200);
        expect(res.body.mail).toBe("email12345");

        await User.deleteMany({ mail: "email12345" })

    });

    test('should return 409 if user already exists', async () => {


        const res = await request(app)
            .post('/user')
            .send({ mail: user.mail, password: 'newpassword' })
            .expect(409);

        expect(res.body.message).toBe('User already exists');
    });

    describe('POST /user/login', () => {
        let user;

        beforeAll(async () => {
            user = new User({
                mail: 'testuser@example.com',
                password: 'testpassword'
            });
            await user.save();
        });

        afterAll(async () => {
            await User.deleteMany();
            //mongoose.connection.close();
        });

        test('should log in an existing user', async () => {
            const res = await request(app)
                .post('/user/login')
                .send({ mail: 'testuser@example.com', password: 'testpassword' })
                .expect(200);

            expect(res.body.login).toBe(true);
            expect(res.body.AccessToken).toBeTruthy();
        });

        test('should not log in a non-existing user', async () => {
            const res = await request(app)
                .post('/user/login')
                .send({ mail: 'nonexisting@example.com', password: 'testpassword' })
                .expect(404);

            expect(res.body.login).toBe(false);
            expect(res.body.AccessToken).toBeNull();
        });

        test('should not log in a user with wrong password', async () => {
            const res = await request(app)
                .post('/user/login')
                .send({ mail: 'testuser@example.com', password: 'wrongpassword' })
                .expect(401);

            expect(res.body).toBe(false);
        });
    });
    describe('DELETE /user/:id', () => {
        let user;

        beforeEach(async () => {
            user = new User({
                mail: 'testuser@gmail.com',
                password: 'testpassword',
            });
            await user.save();
        });

        afterEach(async () => {
            await user.remove();
        });

        test('should delete an existing user', async () => {
            const res = await request(app).delete(`/user/${user._id}`).expect(200);
            expect(res.body.message).toBe('User deleted');
        });

        test('should return 404 if user does not exist', async () => {
            const res = await request(app).delete(`/user/${mongoose.Types.ObjectId()}`).expect(404);
            expect(res.body.message).toBe('User does not exist');
        });
    });
    describe('GET /user/:id', () => {
        let userId;

        beforeAll(async () => {
            // Create a test user and get the user's id
            const user = new User({
                mail: 'test_user@example.com',
                password: 'test_password'
            });
            await user.save();
            userId = user._id;
        });

        afterAll(async () => {
            // Remove the test user from the database
            await User.deleteMany({ mail: 'test_user@example.com' });
            //mongoose.connection.close();
            //listener.close();
        });

        test('should return a user by id', async () => {
            const res = await request(app)
                .get(`/user/${userId}`)
                .expect(200);

            expect(res.body.mail).toBe('test_user@example.com');
        });

        test('should return a 404 error for non-existent user', async () => {
            const res = await request(app)
                .get('/user/606e54af42dce71f42800781')
                .expect(404);

            expect(res.body.message).toBe('User does not exist');
        });
    });
})