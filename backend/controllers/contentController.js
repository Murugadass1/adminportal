const pool = require('../config/db');

// --- Topics ---
exports.createTopic = async (req, res) => {
    const { name } = req.body;
    try {
        const [existing] = await pool.query('SELECT * FROM topics WHERE name = ?', [name]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Topic already exists' });
        }
        await pool.query('INSERT INTO topics (name) VALUES (?)', [name]);
        res.status(201).json({ message: 'Topic created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTopics = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM topics ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// --- Videos ---
exports.uploadVideo = async (req, res) => {
    // Multer middleware should handle file upload before this
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, topicId } = req.body;
    const filename = req.file.filename;

    try {
        await pool.query('INSERT INTO videos (title, filename, topic_id) VALUES (?, ?, ?)',
            [title, filename, topicId]);
        res.status(201).json({ message: 'Video uploaded successfully', filename });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getVideos = async (req, res) => {
    const { topicId, userId } = req.query; // Add userId support to fetch only allowed topics
    try {
        let query = 'SELECT videos.*, topics.name as topic_name FROM videos LEFT JOIN topics ON videos.topic_id = topics.id';
        let params = [];
        let conditions = [];

        if (topicId) {
            conditions.push('videos.topic_id = ?');
            params.push(topicId);
        }

        if (userId) {
            // Only show videos from topics the user is assigned to
            // Subquery to get user topics
            conditions.push('videos.topic_id IN (SELECT topic_id FROM user_topics WHERE user_id = ?)');
            params.push(userId);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY uploaded_at DESC';

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

