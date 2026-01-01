const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Muruga@7557', // Password provided by user
};

async function setupDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL server.');

    // Create Database
    await connection.query(`CREATE DATABASE IF NOT EXISTS accessdb`);
    console.log('Database "accessdb" created or already exists.');

    await connection.changeUser({ database: 'accessdb' });

    // Create Users Table
    // Admin creates users, so we need a way to store them.
    // role: 'admin' or 'user'
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table "users" created.');

    // Create Topics Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS topics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table "topics" created.');

    // Create User_Topics Table (Many-to-Many)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_topics (
        user_id INT,
        topic_id INT,
        PRIMARY KEY (user_id, topic_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
      )
    `);
    console.log('Table "user_topics" created.');

    // Create Videos Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        topic_id INT,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL
      )
    `);
    console.log('Table "videos" created.');

    // Insert default admin if not exists
    // Ideally we should hash passwords (bcrypt), but for this setup we will do simple storage first as per prompt flow, 
    // but I'll add bcrypt logic in the main app. Here simple insert for initial structure.
    // Actually, let's just leave it empty and let the app handle creation or insert a root admin.
    // The user said "schema name:accessdb username:root password:Muruga@7557" -> this is for DB connection.
    // "create user id and password" -> in the app.

    console.log('Database setup complete.');

  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    if (connection) await connection.end();
  }
}

setupDatabase();
