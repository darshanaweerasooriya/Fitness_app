import mongoose from "mongoose";

const GymSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
             type: Number,
            required: true
        },
        createdAt:{
            type: Date,
            default: Date.now
        }


    }
)

module.exports = mongoose.model('GymDetails', GymSchema);