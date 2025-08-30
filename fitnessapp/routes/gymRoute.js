const express = require("express");
const router = express.Router();
const gymControll = require("../controllers/addGymController");


router.post("/add",gymControll.addGym);
router.get("/get",gymControll.getAllGyms);

module.exports = router;