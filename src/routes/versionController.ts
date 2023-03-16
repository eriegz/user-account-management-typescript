const express = require('express');
const router = express.Router();

const CONFIG = require('../config');

router.get('/version', (req, res) => {
  res.send({
    version: CONFIG.VERSION,
  });
});

module.exports = router;
