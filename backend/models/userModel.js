const db = require('../config/db');

exports.createUser = (name, email, password, role, callback) => {
  db.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, role],
    callback
  );
};

exports.findUserByEmail = (email, callback) => {
  db.query('SELECT * FROM users WHERE email = ?', [email], callback);
};

exports.findUserById = (id, callback) => {
  db.query('SELECT * FROM users WHERE id = ?', [id], callback);
};

exports.getAllUsers = (callback) => {
  db.query('SELECT id, name, email, role, banned, created_at FROM users ORDER BY created_at DESC', callback);
};

exports.updateUser = (id, updates, callback) => {
  const { name, email } = updates;
  db.query(
    'UPDATE users SET name = ?, email = ? WHERE id = ?',
    [name, email, id],
    callback
  );
};

exports.deleteUser = (userId, callback) => {
  // Delete user's proposals first, then jobs, then the user
  db.query('DELETE FROM proposals WHERE freelancer_id = ?', [userId], (err) => {
    if (err) return callback(err);
    db.query('DELETE FROM jobs WHERE user_id = ?', [userId], (err) => {
      if (err) return callback(err);
      db.query('DELETE FROM users WHERE id = ?', [userId], callback);
    });
  });
};

exports.toggleUserBan = (userId, callback) => {
  db.query(
    'UPDATE users SET banned = NOT banned WHERE id = ?',
    [userId],
    callback
  );
};