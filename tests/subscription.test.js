// const request = require('supertest');
// const express = require('express');
// const app = require('../index');
// const jwt = require('jsonwebtoken');
// const User = require('../model/UserModel');
// const ProUser = require('../model/ProUserModel');
// const subscriptionRoute = require('../routes/UserSubscription');

// app.use(express.json());
// app.use('/api/v1/subscription', subscriptionRoute);

// const cleanUpSubscription = async () => {
//     const query = await User.findOne({ email: 'john.doe@example.com' });
//     const john = query;

//     const mail = 'john.doe@example.com';

//     await User.findByIdAndUpdate(john._id, { $pull: { subscriptionsId: mail } });
//     await ProUser.findByIdAndUpdate(john._id, { $pull: { subscribersId: mail } });

//     const token = jwt.sign({ _id: john._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

//     const res = await request(app)
//         .post('/api/v1/subscription')
//         .set('auth-token', `${token}`)
//         .send({ email: mail });

//     expect(res.status).toEqual(200);

//     await john.save();
// };

// // POST /subscription
// describe('POST /subscription', () => {
//     it('should send a request to a professionist and return 200 status', async () => {
//         const query = await User.findOne({ email: 'john.doe@example.com' });
//         const john = query;

//         const token = jwt.sign({ _id: john._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

//         const mail = 'john.doe@example.com';

//         const res = await request(app)
//             .post('/api/v1/subscription')
//             .set('auth-token', `${token}`)
//             .send({ email: mail });

//         expect(res.status).toEqual(200);
//         expect(res.body.message).toEqual('Request sent to Professionist');
//     });

//     it('should return 400 status for invalid professionist id', async () => {
//         const query = await User.findOne({ email: 'john.doe@example.com' });
//         const john = query;
//         const token = jwt.sign({ _id: john._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

//         const mail = 'false@example.com';

//         const res = await request(app)
//             .post('/api/v1/subscription')
//             .set('auth-token', `${token}`)
//             .send({ email: mail });

//         expect(res.status).toEqual(400);
//     });

//     it('should send a request to a professionist and return 400 status, already present', async () => {
//         const query = await User.findOne({ email: 'john.doe@example.com' });
//         const john = query;

//         const token = jwt.sign({ _id: john._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

//         const mail = 'john.doe@example.com';

//         const res = await request(app)
//             .post('/api/v1/subscription')
//             .set('auth-token', `${token}`)
//             .send({ email: mail });

//         expect(res.status).toEqual(400);
//         expect(res.body.message).toEqual('Subscription already exists or request pending');
//     });
// });

// // PUT /api/v1/subscription
// describe('PUT /api/v1/subscription', () => {

//     it('should accept a subscription request', async () => {
//         const query = await ProUser.findOne({ email: 'john.doe@example.com' });
//         const john = query;

//         const token = jwt.sign({ _id: john._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

//         const mail = 'john.doe@example.com';

//         const res = await request(app)
//             .put('/api/v1/subscription')
//             .set('auth-token', `${token}`)
//             .send({ acceptEmail: mail, ADRequest: true });

//         expect(res.status).toEqual(200);
//         expect(res.body.message).toEqual('User added');
//     });

//     it('should deny a subscription request', async () => {

//         await cleanUpSubscription();

//         const query = await ProUser.findOne({ email: 'john.doe@example.com' });
//         const john = query;

//         const token = jwt.sign({ _id: john._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

//         const mail = 'john.doe@example.com';

//         const res = await request(app)
//             .put('/api/v1/subscription')
//             .set('auth-token', `${token}`)
//             .send({ acceptEmail: mail, ADRequest: false });

//         expect(res.status).toEqual(200);
//         expect(res.body.message).toEqual('Deny access');
//     });
// });

// // DELETE /api/v1/subscription/:userEmail
// describe('DELETE /api/v1/subscription', () => {
//     it('should disenroll a user by a professional and return 200 status', async () => {
//         const query_test = await User.findOne({ email: 'test.simple.user@gmail.com' });
//         const test = query_test;

//         const token_test = jwt.sign({ _id: test._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

//         const mail_test = 'test.simple.user@gmail.com';
//         const mail = 'john.doe@example.com';

//         const res_test = await request(app)
//             .post(`/api/v1/subscription`)
//             .set('auth-token', `${token_test}`)
//             .send({ email: mail });

//         expect(res_test.status).toEqual(200);

//         const query = await ProUser.findOne({ email: 'john.doe@example.com' });
//         const john = query;

//         const token = jwt.sign({ _id: john._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

//         const res_conf = await request(app)
//             .put('/api/v1/subscription')
//             .set('auth-token', `${token}`)
//             .send({ acceptEmail: mail_test, ADRequest: true });

//         expect(res_conf.status).toEqual(200);

//         const res = await request(app)
//             .delete(`/api/v1/subscription/${mail_test}`)
//             .set('auth-token', `${token}`);

//         expect(res.status).toEqual(200);
//         expect(res.body.message).toEqual('User disenrolled by Professional');
//     });



//     it('should disenroll a user by a professional and return 200 status', async () => {
//         const query_test = await User.findOne({ email: 'test.simple.user@gmail.com' });
//         const test = query_test;

//         const token_test = jwt.sign({ _id: test._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

//         const mail_test = 'test.simple.user@gmail.com';
//         const mail = 'john.doe@example.com';

//         const res_test = await request(app)
//             .post(`/api/v1/subscription`)
//             .set('auth-token', `${token_test}`)
//             .send({ email: mail });

//         expect(res_test.status).toEqual(200);

//         const query = await ProUser.findOne({ email: 'john.doe@example.com' });
//         const john = query;

//         const token = jwt.sign({ _id: john._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

//         const res_conf = await request(app)
//             .put('/api/v1/subscription')
//             .set('auth-token', `${token}`)
//             .send({ acceptEmail: mail_test, ADRequest: true });

//         expect(res_conf.status).toEqual(200);

//         const res = await request(app)
//             .delete(`/api/v1/subscription/${mail}`)
//             .set('auth-token', `${token_test}`);

//         expect(res.status).toEqual(200);
//         expect(res.body.message).toEqual('User unsubscribed from Professionist');
//     });
// });
