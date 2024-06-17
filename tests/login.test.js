const authRoute = require('../routes/auth');
const User = require('../model/UserModel');

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.json());
app.use('/api/v1/auth', authRoute);

jest.setTimeout(40000);


describe('POST /login', () => {
    it('should respond with 404 status if credentials are missing', async () => {
        const res = await request(app)
            .post('/api/v1/auth/')
            .send({});
            expect(res.body).toEqual({ status: 404, message: 'Missing user and/or password' });

    });

    it('should respond with 404 status if only username is provided', async () => {
        const res = await request(app)
            .post('/')
            .send({ email: 'john.doe@example.com' });
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Missing user and/or password');
    });

    it('should respond with 404 status if only password is provided', async () => {
        const res = await request(app)
            .post('/')
            .send({ password: 'pass123' });
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Missing user and/or password');
    });

    it('should respond with 404 status if user does not exist', async () => {
        const res = await request(app)
            .post('/')
            .send({ email: 'nonexistent@example.com', password: 'pass123' });
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', );
    });

    it('should respond with 401 status if password is incorrect', async () => {
        const res = await request(app)
            .post('/')
            .send({ email: 'john.doe@example.com', password: 'wrongpassword' });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Incorrect credentials');
    });

    it('should respond with 200 status and a token if login is successful', async () => {
        const res = await request(app)
            .post('/')
            .send({ email: 'john.doe@example.com', password: 'pass123' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});