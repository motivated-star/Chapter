const express = require('express');
const multer = require('multer');
const cacheMiddleware = require('../middleware/cache');
const adminAuth = require('../middleware/auth');
const chapterController = require('../controller/chapterController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', cacheMiddleware, chapterController.getChapters);
router.get('/:id', chapterController.getChapterById);
router.post('/', adminAuth, upload.single('file'), chapterController.uploadChapters);

module.exports = router;
