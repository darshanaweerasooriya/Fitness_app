const asyncHandler = require('express-async-handler');
const Coach = require('../models/coaches');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}



const serverBaseUrl = 'http://192.168.1.51:3001';

const register =  asyncHandler(async (req, res) => {
     const { username, password, phonenumber } = req.body;

     if (!username || !password) {
        return res.status(400).json({ message: "Please fill all required fields."});

     }

     const userExists = await Coach.findOne({ username });
     if (userExists){
        return res.status(400).json({message: "User already exists"});

     }

     const hashPassword = await bcrypt.hash(password, 10);
     let profileImageUrl = "";

     if (req.file) {
        const fileName = `profile_${Date.now()}_${req.file.originalname}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, req.file.buffer);
        profileImageUrl = `${serverBaseUrl}/uploads/${fileName}`;
     }

    const coach = new Coach({
        username,
        password: hashPassword,
        phonenumber,
        profileImage: profileImageUrl

    });

    await coach.save();
    res.status(201).json({ message: "User registered successfully", coach });
});

const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const JWT_SECRET = 'manuss';

    const coach = await Coach.findOne({ username });
    if (!coach) {
         return res.status(404).json({ status: false, message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, coach.password);
    if (!isPasswordValid) {
          return res.status(401).json({ status: false, message: 'Invalid password' });
    }

    const token = jwt.sign({ id: coach.toString()}, JWT_SECRET, { expiresIn: '1h'});

    res.status(200).json({
        status: true,
        message: "Login successful",
        token,
        coach,
    });
});

const getProfile = async (req, res) => {
    const coach = await Coach.findOne(req.coach._id);
    if (!coach) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ coach});
}

const requestPasswordResetWithOTP = asyncHandler(async (req, res) => {
    const startTime = new Date().getTime();
    const { email } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = (Math.floor(100000 + Math.random() * 900000)).toString();

    user.resetOTP = otp;
    user.resetOTPExpiration = Date.now() + 600000; // 10 mins
    await user.save();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'manulperera5@gmail.com',
            pass: 'gmkf otsz qjsj nbhd',
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        from: {
            name: 'Healthy Bite',
            address: 'manulperera5@gmail.com'
        },
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email', error);
            return res.status(500).json({ message: 'Failed to send OTP email' });
        }

        const endTime = new Date().getTime();
        console.log('Backend response time:', endTime - startTime, 'ms');
        res.status(200).json({ message: 'OTP sent successfully' });
    });
});

const verifyOTPAndPassword = asyncHandler(async (req, res) => {
    const { phonenumber, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const coaches = await Coach.findOne({ phonenumber: phonenumber.toLowerCase() });

    if (!coaches) return res.status(400).json({ message: 'User not found' });

    if (user.resetOTP !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.resetOTPExpiration < Date.now()) {
        return res.status(400).json({ message: 'Expired OTP' });
    }

    user.resetOTP = null;
    user.resetOTPExpiration = null;
    await coaches.save();

    res.status(200).json({ message: 'OTP verified successfully!' });
});

const deleteAccount = asyncHandler(async (req, res) => {
    const { username } = req.body;

    try {
        const coaches = await Coach.findOneAndDelete({ username });
        if (!coaches) throw new Error('User not found');
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Failed to delete account', error);
        res.status(500).json({ message: 'Failed to delete account' });
    }
});

module.exports ={
    register,
    login,
    getProfile,
    deleteAccount,
    requestPasswordResetWithOTP,
    verifyOTPAndPassword,
}