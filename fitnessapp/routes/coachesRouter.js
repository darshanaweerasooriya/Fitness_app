const express = require('express');
const router = express.Router();
const multer = require('multer');
const { register, login } = require('../controllers/coachesController');

const storage = multer.memoryStorage();
const upload = multer({ storage:storage});


router.post('/',upload.single("profileImage"),register);
router.post('/coachlogin',login);


module.exports = router;