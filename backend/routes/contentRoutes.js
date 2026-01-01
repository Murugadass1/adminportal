const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createTopic, getTopics, uploadVideo, getVideos } = require('../controllers/contentController');

// Multer Setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // unique filename
    }
});

const upload = multer({ storage: storage });

// Routes
router.post('/topics', createTopic);
router.get('/topics', getTopics);

router.post('/videos', upload.single('video'), uploadVideo);
router.get('/videos', getVideos);

module.exports = router;
