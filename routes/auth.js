const express = require('express');
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/Users');

const router = express.Router();

// @route GET api/auth
// @desc Get logged in user
// @auth Private
router.get('/', (req, res) => {
  res.send('Get logged in user');
});

// @route POST api/auth
// @desc Auth user and get token
// @auth Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  (req, res) => {
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      try {
        let user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
          user: {
            is: user.id,
          },
        };

        jwt.sign(
          payload,
          config.get('jwtSecret'),
          {
            expiresIn: 360000,
          },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      } catch (err) {
        console.log(err.message);
        res.status(500).json({ msg: 'Server Error' });
      }
    };
  }
);

module.exports = router;
