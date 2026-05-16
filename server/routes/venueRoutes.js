const express = require('express');
const router = express.Router();
const Venue = require('../models/Venue');
const { protect } = require('../middleware/auth');

async function autoEmptyAllVenues() {
    try {
        const result = await Venue.updateMany(
            { status: 'occupied' },
            { 
                status: 'empty', 
                occupiedBy: null, 
                occupiedUntil: null,
                lastUpdated: new Date()
            }
        );
        if (result.modifiedCount > 0) {
            console.log(`🕖 Auto-empty: ${result.modifiedCount} venues reset to empty (7 PM daily reset)`);
        }
    } catch (error) {
        console.error('Auto-empty error:', error);
    }
}

function scheduleAutoEmpty() {
    const now = new Date();
    const sevenPM = new Date();
    sevenPM.setHours(19, 0, 0, 0);
    
    if (now > sevenPM) {
        sevenPM.setDate(sevenPM.getDate() + 1);
    }
    
    const msUntilSevenPM = sevenPM - now;
    
    setTimeout(() => {
        autoEmptyAllVenues();
        setInterval(autoEmptyAllVenues, 24 * 60 * 60 * 1000);
    }, msUntilSevenPM);
    
    console.log(`🕖 Auto-empty scheduled for ${sevenPM.toLocaleTimeString()} daily`);
}

scheduleAutoEmpty();

router.get('/', async (req, res) => {
    try {
        const venues = await Venue.find();
        
        const now = new Date();
        let expiredCount = 0;
        
        for (let venue of venues) {
            if (venue.status === 'occupied' && venue.occupiedUntil) {
                if (venue.occupiedUntil < now) {
                    venue.status = 'empty';
                    venue.occupiedBy = null;
                    venue.occupiedUntil = null;
                    await venue.save();
                    expiredCount++;
                }
            }
        }
        
        if (expiredCount > 0) {
            console.log(`⏰ Auto-expired: ${expiredCount} venues reset (3-hour limit reached)`);
        }
        
        res.json({ success: true, data: venues });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/:id/occupy', protect, async (req, res) => {
    try {
        const { durationHours, className, bookerName } = req.body;
        const venue = await Venue.findById(req.params.id);
        
        if (!venue) {
            return res.status(404).json({ success: false, message: 'Venue not found' });
        }
        
        if (venue.status === 'occupied') {
            return res.status(400).json({ success: false, message: 'Venue is already occupied by another class rep' });
        }
        const hours = durationHours || 3;
        const occupiedUntil = new Date();
        occupiedUntil.setHours(occupiedUntil.getHours() + hours);
        
        venue.status = 'occupied';
        venue.occupiedBy = bookerName || req.user.name;
        venue.occupiedUntil = occupiedUntil;
        venue.lastUpdated = new Date();
        
        await venue.save();
        
        res.json({ 
            success: true, 
            message: `Venue marked as occupied. Will auto-empty at ${occupiedUntil.toLocaleTimeString()} (after ${hours} hours)`,
            data: venue 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


router.post('/:id/empty', protect, async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        
        if (!venue) {
            return res.status(404).json({ success: false, message: 'Venue not found' });
        }
        
        const currentUserName = req.user.name;
        const isBooker = venue.occupiedBy && venue.occupiedBy.includes(currentUserName);
        
        if (!isBooker) {
            return res.status(403).json({ success: false, message: 'Only the class rep who booked this venue can mark it empty' });
        }
        
        venue.status = 'empty';
        venue.occupiedBy = null;
        venue.occupiedUntil = null;
        venue.lastUpdated = new Date();
        
        await venue.save();
        
        res.json({ success: true, message: 'Venue marked as empty (manual override)' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/stats', protect, async (req, res) => {
    try {
        const total = await Venue.countDocuments();
        const occupied = await Venue.countDocuments({ status: 'occupied' });
        const empty = total - occupied;
        
        res.json({ success: true, data: { total, occupied, empty } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;