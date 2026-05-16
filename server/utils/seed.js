const mongoose = require('mongoose');
const Venue = require('../models/Venue');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const venues = [
    
    { name: "Lecture Hall 1", building: "Lecture Block 1", floor: "Ground", capacity: 200, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 2", building: "Lecture Block 1", floor: "Ground", capacity: 180, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 3", building: "Lecture Block 1", floor: "First", capacity: 200, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 4", building: "Lecture Block 1", floor: "First", capacity: 150, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 5", building: "Lecture Block 1", floor: "Second", capacity: 200, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 6", building: "Lecture Block 1", floor: "Second", capacity: 150, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 7", building: "Lecture Block 1", floor: "Third", capacity: 180, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 8", building: "Lecture Block 1", floor: "Third", capacity: 120, type: "lecture_hall", status: "empty" },
    { name: "Computer Lab 1", building: "Lecture Block 1", floor: "Ground", capacity: 50, type: "lab", status: "empty" },
    { name: "Science Lab 1", building: "Lecture Block 1", floor: "First", capacity: 40, type: "lab", status: "empty" },
    
    
    { name: "Lecture Hall 1", building: "Lecture Block 2", floor: "Ground", capacity: 200, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 2", building: "Lecture Block 2", floor: "Ground", capacity: 180, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 3", building: "Lecture Block 2", floor: "First", capacity: 200, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 4", building: "Lecture Block 2", floor: "First", capacity: 150, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 5", building: "Lecture Block 2", floor: "Second", capacity: 200, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 6", building: "Lecture Block 2", floor: "Second", capacity: 150, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 7", building: "Lecture Block 2", floor: "Third", capacity: 180, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 8", building: "Lecture Block 2", floor: "Third", capacity: 120, type: "lecture_hall", status: "empty" },
    { name: "Computer Lab 2", building: "Lecture Block 2", floor: "Ground", capacity: 50, type: "lab", status: "empty" },
    { name: "Science Lab 2", building: "Lecture Block 2", floor: "First", capacity: 40, type: "lab", status: "empty" },
    
    
    { name: "Lecture Hall 1", building: "Lecture Block 3", floor: "Ground", capacity: 200, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 2", building: "Lecture Block 3", floor: "Ground", capacity: 180, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 3", building: "Lecture Block 3", floor: "First", capacity: 200, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 4", building: "Lecture Block 3", floor: "First", capacity: 150, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 5", building: "Lecture Block 3", floor: "Second", capacity: 200, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 6", building: "Lecture Block 3", floor: "Second", capacity: 150, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 7", building: "Lecture Block 3", floor: "Third", capacity: 180, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 8", building: "Lecture Block 3", floor: "Third", capacity: 120, type: "lecture_hall", status: "empty" },
    { name: "Computer Lab 3", building: "Lecture Block 3", floor: "Ground", capacity: 50, type: "lab", status: "empty" },
    { name: "Science Lab 3", building: "Lecture Block 3", floor: "First", capacity: 40, type: "lab", status: "empty" },
    
    
    { name: "Lecture Hall 1", building: "Lecture Block 4", floor: "Ground", capacity: 200, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 2", building: "Lecture Block 4", floor: "Ground", capacity: 180, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 3", building: "Lecture Block 4", floor: "First", capacity: 200, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 4", building: "Lecture Block 4", floor: "First", capacity: 150, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 5", building: "Lecture Block 4", floor: "Second", capacity: 200, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 6", building: "Lecture Block 4", floor: "Second", capacity: 150, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 7", building: "Lecture Block 4", floor: "Third", capacity: 180, type: "lecture_hall", status: "empty" },
    { name: "Lecture Hall 8", building: "Lecture Block 4", floor: "Third", capacity: 120, type: "lecture_hall", status: "empty" },
    { name: "Computer Lab 4", building: "Lecture Block 4", floor: "Ground", capacity: 50, type: "lab", status: "empty" },
    { name: "Science Lab 4", building: "Lecture Block 4", floor: "First", capacity: 40, type: "lab", status: "empty" }
];

async function seed() {
    try {
        await mongoose.connect('mongodb://localhost:27017/venue_checker');
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
        
        console.log(`✅ Seeded ${venues.length} venues`);
        console.log('✅ Admin created: regNo=ADMIN001, password=admin123');
        process.exit();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

seed();