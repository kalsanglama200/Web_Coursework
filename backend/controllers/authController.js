const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');

exports.register = async (req, res) => {
  try {
    console.log('Registration request received:', { 
      name: req.body.name, 
      email: req.body.email, 
      role: req.body.role 
    });

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;
    
    // Validate role
    const validRoles = ['Client', 'Freelancer', 'Admin'];
    if (!role || !validRoles.includes(role)) {
      console.log('Invalid role:', role);
      return res.status(400).json({ message: 'Valid role is required (Client, Freelancer, or Admin)' });
    }

    console.log('Checking if user exists...');
    userModel.findUserByEmail(email, async (err, results) => {
      if (err) {
        console.error('Database error checking user:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length > 0) {
        console.log('User already exists:', email);
        return res.status(400).json({ message: 'Email already exists' });
      }
      
      try {
        console.log('Hashing password...');
        // Hash the password asynchronously
        const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds
        
        console.log('Creating user...');
        userModel.createUser(name, email, hashedPassword, role, (err, result) => {
          if (err) {
            console.error('Database error creating user:', err);
            return res.status(500).json({ error: 'Failed to create user' });
          }
          
          console.log('User created successfully:', result);
          res.status(201).json({ message: 'User registered successfully' });
        });
      } catch (hashErr) {
        console.error('Password hashing error:', hashErr);
        return res.status(500).json({ error: 'Password processing failed' });
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = (req, res) => {
  try {
    console.log('=== LOGIN REQUEST START ===');
    console.log('Login request received:', { email: req.body.email });
    console.log('Request body:', req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    console.log('Looking up user in database...');
    userModel.findUserByEmail(email, async (err, results) => {
      if (err) {
        console.error('Database error during login:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      console.log('Database query completed. Results:', results.length);
      
      if (results.length === 0) {
        console.log('User not found:', email);
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      const user = results[0];
      console.log('User found:', { id: user.id, name: user.name, email: user.email, role: user.role });
      
      try {
        console.log('Comparing passwords...');
        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match result:', isMatch);
        
        if (!isMatch) {
          console.log('Password mismatch for user:', email);
          return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        console.log('Generating JWT token...');
        // Include user role in the JWT token
        const token = jwt.sign({ 
          id: user.id, 
          role: user.role,
          email: user.email 
        }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production', { expiresIn: '1d' });
        
        const userResponse = { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        };
        
        console.log('Login successful:', userResponse);
        console.log('=== LOGIN REQUEST END ===');
        res.json({ token, user: userResponse });
      } catch (compareErr) {
        console.error('Password comparison error:', compareErr);
        return res.status(500).json({ error: 'Authentication failed' });
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};