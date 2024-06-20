const request = require('supertest');
const express = require('express');
const app = require('../index');
const User = require('../model/UserModel');
const userRoute = require('../routes/User');
const jwt = require('jsonwebtoken');

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
            .send({ email: 'new.user@example.com' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({ status: 400, message: 'Missing data' });
    });

    it('should respond with 400 status if email already exists', async () => {
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

describe('DELETE /user', () => {
    it('should respond with 200 status if deletion is successful', async () => {
        const user = new User({ email: 'example.dummy@example.com', password: 'pass123' });

        await user.save();

        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

        const res = await request(app)
            .delete('/api/v1/user')
            .set('auth-token', token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ status: 200, message: 'Deleted data' });
    });
});