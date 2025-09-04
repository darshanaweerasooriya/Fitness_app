const asyncHandler = require('express-async-handler');
const CoachDetails = require('../models/coachesDetail');
const { json } = require('express');

exports.crateCoachDetails = async (req, res) => {
    try{
        const { userId, age, height, weight, gender, specailistArea, about, qualification  } = req.body;

        const coach = new CoachDetails({
            userId,
            age,
            height,
            weight,
            gender,
            specailistArea,
            about,
            qualification
        });
        await coach.save();
        res.status(201),json({ success: true, data: coach});
    }catch (err) {
        console.error(err);
        res.status(500).json({success: false, error: 'Server Error'});
    }
};