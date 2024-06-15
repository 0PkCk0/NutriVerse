const express = require('express');
const router = express.Router();
const User = require('../model/UserModel'); // Assuming your user model is defined in this file
const verify = require('../config/verifyToken');

// Route to handle uploading PDF URLs
router.post('/', verify, async (req, res) => {
  const { professionalId, url, type } = req.body;

  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    user.plansUrl.push({ professionalId, url, type });

    await user.save();

    res.status(200).json({ status: 200, message: 'PDF URL uploaded successfully' });
  } catch (error) {
    console.error('Error uploading PDF URL', error);
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
});

router.put('/', verify, async (req, res) => {
  const { professionalId, url, type } = req.body;

  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    const index = user.plansUrl.findIndex((plan) => plan.professionalId === professionalId && plan.url === url);

    user.plansUrl[index].type = type;

    await user.save();

    res.status(200).json({ status: 200, message: 'PDF URL updated successfully' });
  } catch (error) {
    console.error('Error updating PDF URL', error);
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
});

router.delete('/', verify, async (req, res) => {
  const { professionalId, url } = req.body;

  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    user.plansUrl.pull({ professionalId, url });

    await user.save();

    res.status(200).json({ status: 200, message: 'PDF URL deleted successfully' });
  } catch (error) {
    console.error('Error deleting PDF URL', error);
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
})

// Export the router
module.exports = router;
