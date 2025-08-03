const userModel = require('../models/userModel');

exports.getUsers = (req, res) => {
  console.log('Admin requesting all users');
  userModel.getAllUsers((err, results) => {
    if (err) {
      console.error('Error getting users:', err);
      return res.status(500).json({ error: err });
    }
    console.log(`Found ${results.length} users`);
    // Remove passwords from response
    const users = results.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    res.json(users);
  });
};

exports.getProfile = (req, res) => {
  const userId = req.user.id;
  userModel.findUserById(userId, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = results[0];
    // Don't send password in response
    delete user.password;
    res.json(user);
  });
};

exports.updateProfile = (req, res) => {
  const userId = req.user.id;
  const { name, email } = req.body;
  
  // Validate input
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }
  
  userModel.updateUser(userId, { name, email }, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Profile updated successfully', user: { id: userId, name, email } });
  });
};

exports.deleteUser = (req, res) => {
  const { userId } = req.params;
  console.log(`Admin attempting to delete user: ${userId}`);
  
  userModel.deleteUser(userId, (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ error: err });
    }
    console.log('User deleted successfully');
    res.json({ message: 'User deleted successfully' });
  });
};

exports.toggleUserBan = (req, res) => {
  const { userId } = req.params;
  console.log(`Admin attempting to toggle ban for user: ${userId}`);
  
  userModel.toggleUserBan(userId, (err, result) => {
    if (err) {
      console.error('Error toggling user ban:', err);
      return res.status(500).json({ error: err });
    }
    console.log('User ban status updated successfully');
    res.json({ message: 'User ban status updated successfully' });
  });
};