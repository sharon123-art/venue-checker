const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
    name: String,
    building: String,
    floor: String,
    capacity: Number,
    type: String,
    status: { type: String, default: 'empty' },
    occupiedBy: String,
    occupiedUntil: Date
});

module.exports = mongoose.model('Venue', venueSchema);