const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
    name: String,
    building: String,
    floor: String,
    capacity: Number,
    type: String
});

module.exports = mongoose.model('Venue', venueSchema);