const request = require('supertest');
const express = require('express');
const app = express();
const router = require('../routes/yourRouteFile'); // replace with your actual route file

app.use('/api/v1/plans', router);
app.use(express.json());

describe('POST /plans', () => {
    let user;
    let token;

    beforeAll(async () => {
        user = await User.findOne({ email: 'test.simple.user@gmail.com' });
        token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
    });

    it('should respond with 200 status if PDF URL upload is successful', async () => {

        

        const response = await request(app)
            .post('/api/v1/plans')
            .set('auth-token', token)
            .send({
                userId: 'testUserId',
                url: 'testUrl',
                type: 'testType'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('PDF URL uploaded successfully');
    });
});

describe('PUT /plans/:PlanID', () => {
    it('should respond with 200 status if comment is added successfully', async () => {
        const response = await request(app)
            .put('/api/v1/plans/testPlanId')
            .send({ comment: 'testComment' });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Added the comment');
    });
});

describe('GET /plans/:proEmail', () => {
    it('should respond with 200 status if plans are fetched successfully', async () => {
        const response = await request(app).get('/api/v1/plans/testProEmail');

        expect(response.statusCode).toBe(200);
        expect(response.body.Plans).toBeDefined();
    });
});

describe('GET /plans', () => {
    it('should respond with 200 status if all plans are fetched successfully', async () => {
        const response = await request(app).get('/api/v1/plans');

        expect(response.statusCode).toBe(200);
        expect(response.body.Plans).toBeDefined();
    });
});

describe('DELETE /plans/:planId', () => {
    it('should respond with 200 status if plan is deleted successfully', async () => {
        const response = await request(app).delete('/api/v1/plans/testPlanId');

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Plan deleted successfully');
    });
});