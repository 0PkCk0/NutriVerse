const request = require('supertest');
const express = require('express');
const app = require('../index');
const jwt = require('jsonwebtoken');
const User = require('../model/UserModel');
const ProUser = require('../model/ProUserModel');
const router = require('../routes/upload');

app.use('/api/v1/upload', router);
app.use(express.json());

describe('POST api/v1/upload', () => {

    it('should respond with 200 status if PDF URL upload is successful', async () => {  

        const query_test = await User.findOne({ email: 'test.simple.user@gmail.com' });
        const user = await query_test;
    
        const prof_query = await ProUser.findOne({ email: 'john.doe@example.com'});
        prof = await prof_query;
    
        token_prof = jwt.sign({ _id: prof._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
    
        const response = await request(app)
            .post('/api/v1/upload')
            .set('auth-token', token_prof)
            .send({
                userEmail: user.email,
                url: 'testUrl',
                type: 'Diet'
            });
    
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual('PDF URL uploaded successfully');
    });

   
});

// describe('PUT /plans/:PlanID', () => {
//     it('should respond with 200 status if comment is added successfully', async () => {
//         const response = await request(app)
//             .put('/api/v1/plans/testPlanId')
//             .send({ comment: 'testComment' });

//         expect(response.statusCode).toBe(200);
//         expect(response.body.message).toBe('Added the comment');
//     });
// });