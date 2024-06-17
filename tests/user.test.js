const request = require('supertest');
const express = require('express');
const app = require('../index');
const User = require('../model/UserModel');
const userRoute = require('../routes/User');

app.use('/api/v1/user', userRoute);
app.use(express.json());

describe('POST /user', () => {
    it('should respond with 400 status if email is missing', async () => {
        const res = await request(app)
            .post('/api/v1/user')
            .send({ password: 'pass123' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({ status: 400, message: 'Missing data' });
    });

    it('should respond with 400 status if password is missing', async () => {
        const res = await request(app)
            .post('/api/v1/user')
            .send({ email: 'john.doe@example.com' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({ status: 400, message: 'Missing data' });
    });

    it('should respond with 400 status if email already exists', async () => {
        const user = new User({ email: 'john.doe@example.com', password: 'pass123' });
        await user.save();

        const res = await request(app)
            .post('/api/v1/user')
            .send({ email: 'john.doe@example.com', password: 'pass123' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({ status: 400, message: 'Email already exists' });
    });

    it('should respond with 200 status if registration is successful', async () => {
        const res = await request(app)
            .post('/api/v1/user')
            .send({ email: 'new.user@example.com', password: 'pass123' });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({ status: 201, message: 'A confirmation email has been sent to new.user@example.com.' });
    });
});