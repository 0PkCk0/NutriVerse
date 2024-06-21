const express = require('express');
const router = express.Router();
const User = require('../model/UserModel'); // Assuming your user model is defined in this file
const verify = require('../config/verifyToken');
const ProUser = require('../model/ProUserModel');

// Route to handle uploading PDF URLs
router.post('/', verify, async (req, res) => {
  const { userEmail, url, type } = req.body;

  try {
    const professional = await ProUser.findById(req.user._id);
    const prof_email = professional.email;
    const user_query = await User.findOne({email: userEmail});
    const user = user_query;
    if (!user) {
      return res.status(404).json({ status: 404, message: 'User not found' });
    }

    if (type !== 'Diet' && type !== 'Workout') { return res.status(400).json({ status: 400, message: 'Invalid plan type' }); }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $push: { plansUrl: { prof_email, url, type } } },
        { new: true }
      );
    } catch (error) {
      console.error('Error updating user:', error);
    }
    await user.save();

    res.status(200).json({ status: 200, message: 'PDF URL uploaded successfully' });
  } catch (error) {
    console.error('Error uploading PDF URL', error);
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
});

// We add a comment to a specific plan (16)
router.put('/:PlanID', verify, async (req, res) => {
  const user = await User.findById(req.user);

  const PlanID = req.params.PlanID;

  URLsplan = user.plansUrl;

  let pushField = {};

  const comment = req.body.comment;

  if (!comment || comment === '') {
    return res.status(404).json({ status: 404, message: 'Comment empty' });
  } else {
    var time = moment.tz(new Date(), "Europe/Rome");
    const returnTime = time.format('YYYY/MM/DD HH:mm');

    pushField = {
      message: comment,
      date: returnTime
    };
  }

  find_one = false;

  if (URLsplan) {
    for (const plan of URLsplan) {
      if (plan._id.toHexString() === PlanID) {
        // We add a comment to the plan
        find_one = true;

        User.updateOne(
          { _id: req.user, "plansUrl._id": plan._id },
          { $push: { "plansUrl.$.comment": pushField } }

        )
          .then(doc => {

            return res.status(200).json({ status: 200, message: 'Added the comment' });

          })
          .catch(err => {

            console.log(err);
            return res.status(500).json({ status: 500, message: 'Internal error on adding the comment' });

          });
      }
    }

    if (!find_one) {

      return res.status(404).json({ status: 404, message: 'Didn\'t find the specified plan' });

    }
  } else {
    return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
});

router.get('/:proEmail', verify, async (req, res) => {
  const user = await User.findById(req.user);

  // Check if the user exists
  if (!user) {
    return res.status(404).json({ status: 404, message: 'User not found' });
  }

  const proEmail = req.params.proEmail;
  const URLsplan = user.plansUrl;
  const matchingPlans = [];

  if (URLsplan) {
    for (const plan of URLsplan) {
      if (plan.proUserEmail === proEmail) {
        matchingPlans.push(plan);
      }
    }

    if (matchingPlans.length > 0) {
      return res.status(200).json({ status: 200, Plans: matchingPlans });
    } else {
      return res.status(404).json({ status: 404, message: 'No plans found for the specified professional user' });
    }
  } else {
    return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
});


// Get all the plans of the User (11)
router.get('/', verify, async (req, res) => {
  const user = await User.findById(req.user);

  //Check if the user exists
  if (!user) {
    return res.status(404).json({ status: 404, message: 'User not found' });
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
