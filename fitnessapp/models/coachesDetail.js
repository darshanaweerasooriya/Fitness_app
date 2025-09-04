const mongoose = require('mongoose');
const {genderList, specialistAreaList } = require('../enums/enumList');

const CoachDetailsSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      age: { type: Number },
      height: { type: Number },
      weight: { type: Number },
      gender: { type: String, enum: Object.values(genderList), required: true },
      specailistArea: { type: String, enum: Object.values(specialistAreaList), required: true},
      about: {type: String, required: true },
      qualification: {type: String, required: true }
});

const coachDetails = mongoose.model('CoachDetails', CoachDetailsSchema);

module.exports = coachDetails;