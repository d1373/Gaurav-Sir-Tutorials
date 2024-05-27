const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
const registerUser = async (req, res) => {
  const { username, email, phone, password, standard, batchCode, dateOfRegistration, type } = req.body;

  console.log('Registration request received with data:', req.body);

  if (phone.length !== 10 || !/^\d+$/.test(phone)) {
    return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
  }

  try {
    const user = await User.create({
      username,
      email,
      phone,
      password,
      standard,
      batchCode,
      dateOfRegistration,
      type,
    });

    console.log('User created successfully:', user);

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        standard: user.standard,
        batchCode: user.batchCode,
        dateOfRegistration: user.dateOfRegistration,
        type: user.type,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      const duplicateField = Object.keys(error.keyValue)[0];
      const message = `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} already exists`;
      console.error(message);
      return res.status(400).json({ message });
    }
    console.error('Error creating user:', error);
    res.status(400).json({ message: 'Invalid user data', error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  console.log('Login request received with data:', req.body);

  try {
    const user = await User.findOne({ username }).select('username password type standard batchCode');
    if (!user) {
      console.log('User not found:', username);
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match for user:', username);
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, type: user.type, standard: user.standard, batchCode: user.batchCode },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Generated token:', token);

    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'strict' });
    res.cookie('username', user.username, { httpOnly: false, secure: false, sameSite: 'strict' });
    res.cookie('type', user.type, { httpOnly: false, secure: false, sameSite: 'strict' });
    res.cookie('standard', user.standard, { httpOnly: false, secure: false, sameSite: 'strict' });
    res.cookie('batchCode', user.batchCode, { httpOnly: false, secure: false, sameSite: 'strict' });

    console.log('Cookies set for user:', user.username);

    res.json({ message: 'Login successful', username: user.username, type: user.type, standard: user.standard, batchCode: user.batchCode, token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const logoutUser = (req, res) => {
  res.json({ message: 'User logged out' });
};

const updateUser = async (req, res) => {
  const { username, email, phone, password, standard, batchCode, oldPassword } = req.body;
  console.log('Received update request for user:', username);

  try {
    const user = await User.findOne({ username });
    console.log('Found user:', user);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.password = password ? await bcrypt.hash(password, 10) : user.password;
    user.standard = standard || user.standard;
    user.batchCode = batchCode || user.batchCode;

    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username, type: user.type, standard: user.standard, batchCode: user.batchCode },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.json({ message: 'User updated successfully', standard: user.standard, batchCode: user.batchCode });
  } catch (error) {
    console.error('Error updating user info:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = { registerUser, loginUser, logoutUser, updateUser };
