const Gym = require("../models/gymAddModel");

//Add new gym 

exports.addGym = async (req, res) => {
    try{
        const { name, latitude, longitude } = req.body;

        if (!name || !latitude || !longitude) {
            return res.status(400).json({message :"Fill the all fields"});

        }

        const newGym = new Gym({ name, latitude, longitude});
        await newGym.save();

        res.status(201).json({ message: "New Gym added successfully", gym: newGym});

    }catch ( err) {
        res.status(500).json({message:"error", error:err.message});
     }
 } ;


 // getting gyms 

 exports.getAllGyms = async (req, res) =>{
    try {
        const gyms = await Gym.find();
        res.json(gyms);
    }catch (err){
        res.status(500).json({message: "Server Eorro", error:err.message});
    }
 }