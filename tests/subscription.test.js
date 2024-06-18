const request = require('supertest');
const express = require('express');
const app = require('../index');
const jwt = require('jsonwebtoken');
const User = require('../model/UserModel');
const subscriptionRoute = require('../routes/UserSubscription');

app.use(express.json());
app.use('/api/v1/subscription', subscriptionRoute);

describe('POST /subscription', () => {
    it('should send a request to a professionist and return 200 status', async () => {
        const query = await User.findOne({ email: 'john.doe@example.com' });
        const john = query;
        
        const token = jwt.sign({ _id: john._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

        const mail = 'john.doe@example.com'; 

        const res = await request(app)
            .post('/api/v1/subscription')
            .set('auth-token', `${token}`)
            .send({ email: mail});

        expect(res.status).toEqual(200);
        expect(res.body.message).toEqual('Request sent to Professionist');
    });

    it('should return 400 status for invalid professionist id', async () => {
        const query = await User.findOne({ email: 'john.doe@example.com' });
        const john = query;
        const token = jwt.sign({ _id: john._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

        const mail = 'false@example.com'; 

        const res = await request(app)
            .post('/api/v1/subscription')
            .set('auth-token', `${token}`)
            .send({ email: mail });

        expect(res.status).toEqual(400);
    });
});