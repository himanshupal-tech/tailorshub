const express = require('express');
const router = express.Router();

// GET all orders
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Orders route working!',
    data: []
  });
});

module.exports = router;