const express = require('express');
const router = express.Router();
const User = require('../model/UserModel'); // Assuming your user model is defined in this file
const verify = require('../config/verifyToken');
const ProUser = require('../model/ProUserModel');
const moment = require('moment-timezone');

// Route to handle uploading PDF URLs
router.post('/', verify, async (req, res) => {
  const { clientEmail, url, type } = req.body;

  const user = await User.findById(req.user);

  // Check if the user exists
  if (!user) {
      return res.status(404).json({ status: 404, message: 'User not found' });
  }

    //Check if the user is a professionist
    if (!(user.Profession && (user.Profession.includes('Nutritionist') || user.Profession.includes('Personal Trainer')))) {
        return res.status(404).json({ status: 404, message: 'User not a Professionist' });
    }

  try {

    const client = await User.findOne({email:clientEmail});

    if (!client) {
      return res.status(404).json({ status: 404, message: 'Client not found' });
    }

    //Check if the user already has a Diet or workout plan
    for (const plan of client.plansUrl){
        if (plan.type === type){
            return res.status(404).json({ status: 404, message: 'You already have a workout or diet plan' });
        }
    }

    const push_element={
        professionalEmail:user.email,
        url:url,
        type:type,
    }

    client.plansUrl.push(push_element);

    await client.save();

    res.status(200).json({ status: 200, message: 'PDF URL uploaded successfully' });
  } catch (error) {
    console.error('Error uploading PDF URL', error);
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
});

// We add a comment to a specific plan (16)
router.put('/:emailUser', verify, async (req, res) => {
  const user = await User.findById(req.user);

  const type=req.body.type;
  const emailUser = req.params.emailUser;

  URLsplan=user.plansUrl;

  let pushField={};

  const comment=req.body.comment;

  if (!comment || comment===''){
      return res.status(404).json({ status: 404, message:'Comment empty'});
  }else{
      var time = moment.tz(new Date(), "Europe/Rome");
      const returnTime=time.format('YYYY/MM/DD HH:mm');

      pushField= {
          message:comment,
          date:returnTime
      };
  }

  find_one=false;

  if (URLsplan){
      for (const plan of URLsplan){
          if (plan.professionalEmail===emailUser && plan.type===type){
              // We add a comment to the plan
              find_one=true;

              User.updateOne(
                  { _id: req.user, "plansUrl._id": plan._id },
                  { $push: { "plansUrl.$.comment": pushField } }

              )
                  .then(doc=>{

                  return res.status(200).json({ status: 200, message:'Added the comment'});

              })
                  .catch(err=>{

                      console.log(err);
                      return res.status(500).json({ status: 500, message:'Internal error on adding the comment'});

                  });
          }
      }

      if (!find_one){

          return res.status(404).json({ status: 404, message:'Didn\'t find the specified plan' });

      }
  }else{
      return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
});

//Get plan made by a professionist (24)
router.get('/:emailUser', verify, async (req, res) => {
  const user = await User.findById(req.user);

  //Check if the user exists
  if (!user) {
    return res.status(404).json({ status:404, message: 'User not found' });
  }

  const emailUser = req.params.emailUser;

  URLsplan=user.plansUrl;

  let plans=[];

  for (const plan of URLsplan){
      if (plan.professionalEmail === emailUser){
          plans.push(plan);
      }
  }

  return res.status(200).json({ status: 200, Plans: plans });

});


// Get all the plans of the User (11)
router.get('/', verify, async (req, res) => {
  const user = await User.findById(req.user);

  //Check if the user exists
  if (!user) {
    return res.status(404).json({ status:404, message: 'User not found' });
  }

  URLsplan = user.plansUrl;

  if (URLsplan) {
    return res.status(200).json({ status: 200, Plans: URLsplan });
  } else {
    return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
});


router.delete('/:planId', verify, async (req, res) => {
  try {
    const planId = req.params.planId;
    const userId = req.user._id;

    // Find the user
    const user = await User.findById(userId);

    // Check if the user was found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(user.Profession);

    if (user.Profession && (user.Profession === 'Nutritionist' || user.Profession === 'Personal Trainer')) {

      client = await User.findById(req.body.userId);
      console.log(client);
      const planExists = client.plansUrl.some(plan => plan._id.toString() === planId);

      if (!planExists) {
        return res.status(404).json({ message: 'Plan not found' });
      }

      await User.findByIdAndUpdate(
        client,
        { $pull: { plansUrl: { _id: planId } } },
        { new: true }
      );

    } else {
      const planExists = user.plansUrl.some(plan => plan._id.toString() === planId);

      if (!planExists) {
        return res.status(404).json({ message: 'Plan not found' });
      }

      await User.findByIdAndUpdate(
        userId,
        { $pull: { plansUrl: { _id: planId } } },
        { new: true }
      );
    }

    res.status(200).json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Export the router
module.exports = router;
