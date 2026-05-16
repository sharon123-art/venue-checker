const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/login', async (req, res) => {
    try {
        const { regNo, password } = req.body;
        const user = await User.findOne({ regNo });
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' });
        
        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, regNo: user.regNo, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/register', protect, adminOnly, async (req, res) => {
    try {
        const { regNo, name, email, password } = req.body;
        
        const existingUser = await User.findOne({ $or: [{ regNo }, { email }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = await User.create({
            regNo,
            name,
            email,
            password: hashedPassword,
            role: 'class_rep'
        });
        
        res.status(201).json({ success: true, message: 'Class rep registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/class-reps', protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find({ role: 'class_rep' }).select('-password');
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/class-reps/:id', protect, adminOnly, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Class rep deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;