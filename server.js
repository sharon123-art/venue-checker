const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/venue_checker')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err));

const venueRoutes = require('./server/routes/venueRoutes');
const authRoutes = require('./server/routes/authRoutes');

app.use('/api/venues', venueRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'VenueChecker API running!' });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});