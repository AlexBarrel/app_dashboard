const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function validateUserCredentials(email, password) {
    const authErrors = {};

    const user = await User.findOne({ email }).select('+password');
    const isPasswordValid = user && await bcrypt.compare(password, user.password);

    if (!user || !isPasswordValid) {
        if (!user) authErrors.email = 'Invalid email';
        if (user && !isPasswordValid) authErrors.password = 'Invalid password';
    }

    return { authErrors, user };
}

module.exports = validateUserCredentials;