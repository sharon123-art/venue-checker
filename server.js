 const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/venue_checker';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err.message));

// Routes
const venueRoutes = require('./server/routes/venueRoutes');
const authRoutes = require('./server/routes/authRoutes');

app.use('/api/venues', venueRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'VenueChecker API running!' });
});

// ===== TEMPORARY SEED ROUTE - REMOVE AFTER SEEDING =====
app.get('/seed', async (req, res) => {
    try {
        const Venue = require('./server/models/Venue');
        const User = require('./server/models/User');
        const bcrypt = require('bcryptjs');

        const venues = [
            // BLOCK 1
            { name: "Lecture Hall 1", building: "Lecture Block 1", floor: "Ground", capacity: 200, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 2", building: "Lecture Block 1", floor: "Ground", capacity: 180, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 3", building: "Lecture Block 1", floor: "First", capacity: 200, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 4", building: "Lecture Block 1", floor: "First", capacity: 150, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 5", building: "Lecture Block 1", floor: "Second", capacity: 200, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 6", building: "Lecture Block 1", floor: "Second", capacity: 150, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 7", building: "Lecture Block 1", floor: "Third", capacity: 180, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 8", building: "Lecture Block 1", floor: "Third", capacity: 120, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 9", building: "Lecture Block 1", floor: "Fourth", capacity: 150, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 10", building: "Lecture Block 1", floor: "Fourth", capacity: 100, type: "lecture_hall", status: "empty" },
            { name: "Computer Lab 1", building: "Lecture Block 1", floor: "Ground", capacity: 50, type: "lab", status: "empty" },
            { name: "Science Lab 1", building: "Lecture Block 1", floor: "First", capacity: 40, type: "lab", status: "empty" },
            // BLOCK 2
            { name: "Lecture Hall 1", building: "Lecture Block 2", floor: "Ground", capacity: 200, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 2", building: "Lecture Block 2", floor: "Ground", capacity: 180, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 3", building: "Lecture Block 2", floor: "First", capacity: 200, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 4", building: "Lecture Block 2", floor: "First", capacity: 150, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 5", building: "Lecture Block 2", floor: "Second", capacity: 200, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 6", building: "Lecture Block 2", floor: "Second", capacity: 150, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 7", building: "Lecture Block 2", floor: "Third", capacity: 180, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 8", building: "Lecture Block 2", floor: "Third", capacity: 120, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 9", building: "Lecture Block 2", floor: "Fourth", capacity: 150, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 10", building: "Lecture Block 2", floor: "Fourth", capacity: 100, type: "lecture_hall", status: "empty" },
            { name: "Computer Lab 2", building: "Lecture Block 2", floor: "Ground", capacity: 50, type: "lab", status: "empty" },
            { name: "Science Lab 2", building: "Lecture Block 2", floor: "First", capacity: 40, type: "lab", status: "empty" },
            // BLOCK 3
            { name: "Lecture Hall 1", building: "Lecture Block 3", floor: "Ground", capacity: 200, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 2", building: "Lecture Block 3", floor: "Ground", capacity: 180, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 3", building: "Lecture Block 3", floor: "First", capacity: 200, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 4", building: "Lecture Block 3", floor: "First", capacity: 150, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 5", building: "Lecture Block 3", floor: "Second", capacity: 200, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 6", building: "Lecture Block 3", floor: "Second", capacity: 150, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 7", building: "Lecture Block 3", floor: "Third", capacity: 180, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 8", building: "Lecture Block 3", floor: "Third", capacity: 120, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 9", building: "Lecture Block 3", floor: "Fourth", capacity: 150, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 10", building: "Lecture Block 3", floor: "Fourth", capacity: 100, type: "lecture_hall", status: "empty" },
            { name: "Computer Lab 3", building: "Lecture Block 3", floor: "Ground", capacity: 50, type: "lab", status: "empty" },
            { name: "Science Lab 3", building: "Lecture Block 3", floor: "First", capacity: 40, type: "lab", status: "empty" },
            // BLOCK 4
            { name: "Lecture Hall 1", building: "Lecture Block 4", floor: "Ground", capacity: 200, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 2", building: "Lecture Block 4", floor: "Ground", capacity: 180, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 3", building: "Lecture Block 4", floor: "First", capacity: 200, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 4", building: "Lecture Block 4", floor: "First", capacity: 150, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 5", building: "Lecture Block 4", floor: "Second", capacity: 200, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 6", building: "Lecture Block 4", floor: "Second", capacity: 150, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 7", building: "Lecture Block 4", floor: "Third", capacity: 180, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 8", building: "Lecture Block 4", floor: "Third", capacity: 120, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 9", building: "Lecture Block 4", floor: "Fourth", capacity: 150, type: "lecture_hall", status: "empty" },
            { name: "Lecture Hall 10", building: "Lecture Block 4", floor: "Fourth", capacity: 100, type: "lecture_hall", status: "empty" },
            { name: "Computer Lab 4", building: "Lecture Block 4", floor: "Ground", capacity: 50, type: "lab", status: "empty" },
            { name: "Science Lab 4", building: "Lecture Block 4", floor: "First", capacity: 40, type: "lab", status: "empty" }
        ];
        await Venue.deleteMany();
        await Venue.insertMany(venues);
        
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('admin123', salt);
        
        await User.deleteMany();
        await User.create({
            regNo: 'ADMIN001',
            name: 'Administrator',
            email: 'admin@kabianga.ac.ke',
            password: adminPassword,
            role: 'admin'
        });
        
        res.send('✅ Database seeded successfully! 48 venues and admin created.');
    } catch (error) {
        res.send('❌ Error: ' + error.message);
    }
});
// ===== END TEMPORARY SEED ROUTE =====

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});