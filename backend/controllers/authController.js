const pool = require('../config/db');
// In a real app, use bcrypt here. For this request, plain text as per user flow, 
// but I will add a comment about security.
// const bcrypt = require('bcryptjs'); 

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = rows[0];

        // Simple password check
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Return user info (excluding password)
        res.json({
            id: user.id,
            username: user.username,
            role: user.role
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createUser = async (req, res) => {
    const { username, password, role, topicIds } = req.body;

    // Logic to Ensure only admin can create (Middleware will handle the check, here we just insert)
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [existing] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'Username already exists' });
        }

        const [result] = await connection.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, password, role || 'user']);

        const userId = result.insertId;

        if (topicIds && Array.isArray(topicIds) && topicIds.length > 0) {
            const topicValues = topicIds.map(tid => [userId, tid]);
            await connection.query('INSERT INTO user_topics (user_id, topic_id) VALUES ?', [topicValues]);
        }

        await connection.commit();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (connection) connection.release();
    }
};

