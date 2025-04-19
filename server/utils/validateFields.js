const bcrypt = require('bcryptjs');
const User = require('../models/User');

function validateRequiredFields(body, fields, password = '', confirmPassword = '') {
    const errors = {};

    fields.forEach(({ key, label }) => {
        if (!body[key] || typeof body[key] !== 'string' || !body[key].trim()) {
            errors[key] = `${label} is required`;
        }
    });

    // if (!password.trim() || !confirmPassword.trim()) {
    //     errors.confirmPassword = 'Password and confirm password are required';
    // } else if (password !== confirmPassword) {
    //     errors.confirmPassword = 'Passwords do not match';
    // }


    const message =
        Object.keys(errors).length === fields.length
            ? 'Please fill in the required fields'
            : '';

    return { errors, message };
}

async function validateUserCredentials(username, password) {
    const authErrors = {};

    const user = await User.findOne({ username }).select('+password');
    const isPasswordValid = user && await bcrypt.compare(password, user.password);

    if (!user || !isPasswordValid) {
        if (!user) authErrors.username = 'Invalid username';
        if (user && !isPasswordValid) authErrors.password = 'Invalid password';
    }

    return { authErrors, user };
}

module.exports = {
    validateRequiredFields,
    validateUserCredentials
};