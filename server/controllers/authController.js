const dotenv = require('dotenv');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

dotenv.config();

const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const validateUserCredentials = require('../utils/validateFields');
const handleValidationErrors = require('../utils/handleValidationErrors');


// Регистрация
exports.register = async (req, res) => {
    try {
        const { fname, lname, email, password } = req.body;

        const validationError = handleValidationErrors(res, message, errors, 400);
        if (validationError) return;

        // Проверка на существующий username/email
        // const userExists = await User.findOne({ username });
        // const emailExists = await User.findOne({ email });
        // const mobileNumberExists = mobileNumber ? await User.findOne({ mobileNumber }) : null;

        // if (userExists) {
        //     errors.username = 'Username already exists';
        // }
        // if (emailExists) {
        //     errors.email = 'Email already exists';
        // }
        // if (mobileNumberExists) {
        //     errors.mobileNumber = 'Mobile number already exists';
        // }

        // Создаем пользователя с ролью user
        const newUser = new User({ username, email, password, mobileNumber, role: 'user' });
        await newUser.save();

        // Генерируем токен
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ success: true, token, user: { username, role: newUser.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

// Логин
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Проверка на введенные данные
    const { authErrors, user } = await validateUserCredentials(email, password);
    const authError = handleValidationErrors(res, authErrors, 401);
    if (authError) return;

    try {
        const tokenPayload = {
            userId: user._id,
            email: user.email,
            role: user.role,
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// Отправка ссылку на email
exports.resetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            // Не сообщаем, существует ли email — ради безопасности
            return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
        }

        // Генерация токена и установка времени действия
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 минут

        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        const message = `Click the following link to reset your password:\n${resetLink}\nThis link is valid for 15 minutes.`;

        await sendEmail(user.email, 'Password Reset', message);

        res.status(200).json({ message: 'Reset link sent to email.' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error sending reset email.' });
    }
};

// Сброс пароля
exports.resetPasswordWithToken = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }, // проверка на истечение
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error resetting password' });
    }
};