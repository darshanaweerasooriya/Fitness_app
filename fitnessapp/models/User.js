const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String },
    password: { type: String, required: true },
    phonenumber: { type: String },  // Add this
   
});

const User = mongoose.model('FitnessUser', UserSchema);

module.exports = User;


