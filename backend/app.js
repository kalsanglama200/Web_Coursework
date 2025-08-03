require('dotenv').config();

// Set default JWT secret if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your_super_secret_jwt_key_change_this_in_production';
  console.log('Warning: Using default JWT_SECRET. Please set JWT_SECRET in .env file for production.');
}

console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');

const app = express();

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased from 100 to 1000 requests per window
  message: 'Too many requests from this IP, please try again later.'
}));
app.use(xss());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://192.168.56.1:5173',
    'http://172.25.6.61:5173'
  ],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(morgan('combined')); // Logging

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));