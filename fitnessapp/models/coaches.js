const mongoose = require('mongoose');

const CoachsSchema = new mongoose.Schema({
    username: {  type: String, required: true },
    password: {  type: String, required: true},
    phonenumber: { type: String },
});

const Coach = mongoose.model('Coaches', CoachsSchema);

module.exports = Coach;