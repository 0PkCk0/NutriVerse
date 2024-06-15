const express = require('express');
const router = express.Router();
const User = require('../model/UserModel'); // Assuming your user model is defined in this file
const verify = require('../config/verifyToken');

// Route to handle uploading PDF URLs
router.post('/', verify, async (req, res) => {
  const { professionalId, url, type } = req.body;

  try {
    // Find the user by ID
    const userId = req.user._id;
    const user = await User.findById(userId);

    // Push the new PDF URL to the plansUrl array
    user.plansUrl.push({ professionalId, url, type });

    // Save the updated user
    await user.save();

    res.send('PDF URL uploaded successfully');
  } catch (error) {
    console.error('Error uploading PDF URL', error);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/', verify, async (req, res) => {
  const { professionalId, url, type } = req.body;

  try {
    // Find the user by ID
    const userId = req.user._id;
    const user = await User.findById(userId);

    // Find the index of the PDF URL to update
    const index = user.plansUrl.findIndex((plan) => plan.professionalId === professionalId && plan.url === url);

    // Update the type of the PDF URL
    user.plansUrl[index].type = type;

    // Save the updated user
    await user.save();

    res.send('PDF URL updated successfully');
  } catch (error) {
    console.error('Error updating PDF URL', error);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/', verify, async (req, res) => {
  const { professionalId, url } = req.body;

  try {
    // Find the user by ID
    const userId = req.user._id;
    const user = await User.findById(userId);

    user.plansUrl.pull({ professionalId, url });

    // Save the updated user
    await user.save();

    res.send('PDF URL deleted successfully');

  } catch (error) {
    console.error('Error deleting PDF URL', error);
    res.status(500).send('Internal Server Error');
  }
})

// Export the router
module.exports = router;
