const express = require('express');
const router = express.Router();
const { crateCoachDetails } = require('../controllers/coachDetailController');

router.post('/',crateCoachDetails);

module.exports = router;