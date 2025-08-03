const mysql = require('mysql2');

// Use default values if environment variables are not set
const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root', // Updated to use the working password
  database: process.env.DB_NAME || 'freelancing_platform',
};

console.log('Database config:', {
  host: config.host,
  user: config.user,
  database: config.database,
  // Don't log password for security
});

const connection = mysql.createConnection(config);

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    console.log('Please make sure:');
    console.log('1. MySQL is installed and running');
    console.log('2. Database "freelancing_platform" exists');
    console.log('3. User has proper permissions');
    console.log('4. Create .env file with DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
    return;
  }
  console.log('Connected to MySQL successfully');
});

module.exports = connection;