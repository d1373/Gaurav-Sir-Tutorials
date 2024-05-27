const express = require('express');
const { registerUser, loginUser, logoutUser, updateUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.post('/update', updateUser);

module.exports = router;
