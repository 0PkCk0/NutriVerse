const express = require('express');
const router = express.Router();
const User = require('../model/UserModel'); // Assuming your user model is defined in this file
const verify = require('../config/verifyToken');


//Get plan made by me of a User (24)
router.get('/:emailUser', verify, async (req, res) => {
    const user = await User.findById(req.user);

    //Check if the user exists
    if (!user) {
        return res.status(404).json({ status:404, message: 'User not found' });
    }

    //Check if the user is a professionist
    if (!(user.Profession && (user.Profession.includes('Nutritionist') || user.Profession.includes('Personal Trainer')))) {
        return res.status(404).json({ status: 404, message: 'User not a Professionist' });
    }

    const emailUser = req.params.emailUser;

    client=User.findOne({email:emailUser});

    if (!client){
        return res.status(404).json({ status:404, message: 'Client not found' });
    }

    URLsplan=client.plansUrl;

    let plans=[];

    for (const plan of URLsplan){
        if (plan.professionalEmail === user.email){
            plans.push(plan);
        }
    }

    return res.status(200).json({ status: 200, Plans: plans });

});
