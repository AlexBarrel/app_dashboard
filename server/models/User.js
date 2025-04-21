const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // mobileNumber: {
    //     type: String,
    //     required: false,
    // },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

// Хешируем пароль перед сохранением в базе данных
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('User', userSchema, 'kombim_users');

module.exports = User;