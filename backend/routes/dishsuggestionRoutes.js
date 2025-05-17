const express = require('express');
const router = express.Router();
const { suggestDish } = require('../controllers/dishSuggestionController');

router.post('/suggest', suggestDish);

module.exports = router;
