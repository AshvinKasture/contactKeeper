const express = require('express');

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
router.post('/', (req, res) => {
  res.send('Log in user');
});

module.exports = router;