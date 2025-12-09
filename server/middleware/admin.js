const User = require('../models/User');

module.exports = async function(req, res, next) {
    try {
        // Get the user information from the database using the ID from the token
        const user = await User.findById(req.user.id);
        
        // Check if their role is 'admin'
        if (user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied. Admins only.' });
        }
        
        next(); // They are admin, let them pass!
    } catch (err) {
        res.status(500).send('Server Error');
    }
};