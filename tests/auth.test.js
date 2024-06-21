// const authRoute = require('../routes/auth');
// const request = require('supertest');
// const express = require('express');
// const app = require('../index');
// const jwt = require('jsonwebtoken');
// const User = require('../model/UserModel');

// app.use(express.json());
// app.use('/api/v1/auth', authRoute);

// describe('POST /auth', () => {
//     it('should respond with 404 status if credentials are missing', async () => {
//         const res = await request(app)
//             .post('/api/v1/auth')
//             .send({});
//         expect(res.statusCode).toEqual(404);
//         expect(res.body).toEqual({ status: 404, message: 'Missing user and/or password' });

//     });

//     it('should respond with 404 status if only username is provided', async () => {
//         const res = await request(app)
//             .post('/api/v1/auth')
//             .send({ email: 'john.doe@example.com' });
//         expect(res.statusCode).toEqual(404); // Updated to 400
//         expect(res.body).toEqual({ status: 404, message: 'Missing user and/or password' });
//     });
    

//     it('should respond with 404 status if only password is provided', async () => {
//         const res = await request(app)
//             .post('/api/v1/auth')
//             .send({ password: 'pass123' });
//         expect(res.statusCode).toEqual(404);
//         expect(res.body).toEqual({ status: 404, message: 'Missing user and/or password' });
//     });

//     it('should respond with 404 status if user does not exist', async () => {
//         const res = await request(app)
//             .post('/api/v1/auth')
//             .send({ email: 'nonexistent@example.com', password: 'pass123' });
//         expect(res.statusCode).toEqual(404);
//         expect(res.body).toEqual({ status: 404, message: 'User not found' });
//     });

//     it('should respond with 404 status if password is incorrect', async () => {
//         const res = await request(app)
//             .post('/api/v1/auth')
//             .send({ email: 'john.doe@example.com', password: 'wrongpassword' });
//         expect(res.statusCode).toEqual(401);
//         expect(res.body).toEqual({ status: 401, message: 'Incorrect credentials' });
//     });

//     it('should respond with 200 status and a token if login is successful', async () => {
//         const res = await request(app)
//             .post('/api/v1/auth')
//             .send({ email: 'john.doe@example.com', password: 'pass123' });
//         expect(res.statusCode).toEqual(200);
//         expect(res.body).toHaveProperty('token');
//     });
// });

// describe('DELETE /api/v1/auth', () => {
//     it('should clear the auth-token cookie and return 200 status', async () => {
//         const query = await User.findOne({ email: 'john.doe@example.com' });
//         const john = query;
//         const token = jwt.sign({ _id: john._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

//         const res = await request(app)
//             .delete('/api/v1/auth')
//             .set('auth-token', `${token}`)
//             .send();

//         expect(res.status).toEqual(200);
//         expect(res.body.message).toEqual('Logged out');
//     });

//     it('should return 400 status for invalid user', async () => {
//         const token = 'invalid_token'

//         const res = await request(app)
//             .delete('/api/v1/auth')
//             .set('auth-token', `${token}`)
//             .send();

//         expect(res.status).toEqual(400);
//         expect(res.body.message).toEqual("Invalid token");
//     });
// });
