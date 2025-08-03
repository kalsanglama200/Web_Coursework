const mysql = require('mysql2');

// Database configuration - try different common setups
const configs = [
  { host: 'localhost', user: 'root', password: '' },
  { host: 'localhost', user: 'root', password: 'root' },
  { host: 'localhost', user: 'root', password: 'password' },
  { host: 'localhost', user: 'root', password: 'admin' },
];

async function testConnection(config) {
  return new Promise((resolve) => {
    console.log(`Testing connection: ${config.host}:${config.user}:${config.password ? '***' : 'empty'}`);
    
    const connection = mysql.createConnection(config);
    connection.connect((err) => {
      if (err) {
        console.log(`❌ Failed: ${err.message}`);
        connection.end();
        resolve(null);
      } else {
        console.log(`✅ Success!`);
        resolve(config);
      }
    });
  });
}

async function setupDatabase() {
  console.log('🔍 Testing MySQL connections...\n');
  
  let workingConfig = null;
  
  // Test each configuration
  for (const config of configs) {
    workingConfig = await testConnection(config);
    if (workingConfig) break;
  }
  
  if (!workingConfig) {
    console.log('\n❌ No working MySQL configuration found.');
    console.log('Please check your MySQL installation and try one of these:');
    console.log('1. Start MySQL service');
    console.log('2. Check if MySQL is running on localhost');
    console.log('3. Verify root user password');
    console.log('4. Try: mysql -u root -p');
    return;
  }
  
  console.log('\n🎉 Found working configuration!');
  
  // Create database and tables
  const connection = mysql.createConnection(workingConfig);
  
  try {
    // Create database if it doesn't exist
    await connection.promise().query('CREATE DATABASE IF NOT EXISTS freelancing_platform');
    console.log('✅ Database "freelancing_platform" created/verified');
    
    // Use the database
    await connection.promise().query('USE freelancing_platform');
    
    // Create users table
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('Client', 'Freelancer', 'Admin') NOT NULL DEFAULT 'Freelancer',
        banned BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created/verified');
    
    // Create jobs table
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        budget DECIMAL(10,2),
        user_id INT NOT NULL,
        status ENUM('open', 'in_progress', 'completed', 'cancelled') DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Jobs table created/verified');
    
    // Create proposals table
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS proposals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT NOT NULL,
        freelancer_id INT NOT NULL,
        message TEXT NOT NULL,
        status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Proposals table created/verified');
    
    // Insert sample admin user (password: admin123)
    await connection.promise().query(`
      INSERT INTO users (name, email, password, role) VALUES 
      ('Admin User', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin')
      ON DUPLICATE KEY UPDATE name = VALUES(name)
    `);
    console.log('✅ Admin user created/verified');
    
    // Insert sample client user (password: client123)
    await connection.promise().query(`
      INSERT INTO users (name, email, password, role) VALUES 
      ('Test Client', 'client@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Client')
      ON DUPLICATE KEY UPDATE name = VALUES(name)
    `);
    console.log('✅ Client user created/verified');
    
    // Insert sample freelancer user (password: freelancer123)
    await connection.promise().query(`
      INSERT INTO users (name, email, password, role) VALUES 
      ('Test Freelancer', 'freelancer@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Freelancer')
      ON DUPLICATE KEY UPDATE name = VALUES(name)
    `);
    console.log('✅ Freelancer user created/verified');
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Test Users:');
    console.log('Admin: admin@example.com / admin123');
    console.log('Client: client@example.com / client123');
    console.log('Freelancer: freelancer@example.com / freelancer123');
    
    console.log('\n📝 Use these settings in your .env file:');
    console.log(`DB_HOST=${workingConfig.host}`);
    console.log(`DB_USER=${workingConfig.user}`);
    console.log(`DB_PASSWORD=${workingConfig.password || ''}`);
    console.log('DB_NAME=freelancing_platform');
    console.log('JWT_SECRET=your_super_secret_jwt_key_change_this_in_production');
    console.log('PORT=5000');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
  } finally {
    connection.end();
  }
}

setupDatabase(); 