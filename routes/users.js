const express = require('express');
const router = express.Router();

// GET all users
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Users route working!',
    data: []
  });
});

// POST create user
router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'User created successfully!',
    data: req.body
  });
});

module.exports = router;