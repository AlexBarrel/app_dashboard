const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();

// Настройка CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use('/api/auth', authRoutes);

// Подключение к базе
connectDB();

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

const User = require('./models/User');

const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ fname: 'admin', lname: 'admin' });
    if (!existingAdmin) {
      const admin = new User({
        fname: 'admin',
        lname: 'admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASS,
        role: 'admin',
      });
      await admin.save();
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  } catch (err) {
    console.error('Error creating admin user:', err);
  }
};

// createAdminUser();