const Chapter = require('../models/Chapter');
const redisClient = require('../clients/redisClient');

// GET /api/v1/chapters
exports.getChapters = async (req, res) => {
    try {
        const { class: classFilter, unit, status, weakChapters, subject, page = 1, limit = 10 } = req.query;

        const filter = {};
        if (classFilter) filter.class = classFilter;
        if (unit) filter.unit = unit;
        if (status) filter.status = status;
        if (weakChapters !== undefined) filter.isWeakChapter = weakChapters === 'true';
        if (subject) filter.subject = subject;

        const total = await Chapter.countDocuments(filter);

        const chapters = await Chapter.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const response = { total, page: Number(page), limit: Number(limit), chapters };

        // Cache response for 1 hour
        if (res.locals.cacheKey) {
            await redisClient.set(res.locals.cacheKey, JSON.stringify(response), 'EX', 3600);
        }

        res.json(response);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/v1/chapters/:id
exports.getChapterById = async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
        res.json(chapter);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/v1/chapters (upload JSON file)
exports.uploadChapters = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'JSON file required' });

    let chaptersData;
    try {
        chaptersData = JSON.parse(req.file.buffer.toString());
        if (!Array.isArray(chaptersData)) throw new Error('JSON must be an array of chapters');
    } catch (err) {
        return res.status(400).json({ message: 'Invalid JSON file' });
    }

    const failed = [];
    const success = [];

    for (const chapterData of chaptersData) {
        try {
            const chapter = new Chapter(chapterData);
            await chapter.validate();
            await chapter.save();
            success.push(chapter);
        } catch (err) {
            failed.push({ chapter: chapterData, error: err.message });
        }
    }

    // Invalidate cache on new upload
    const keys = await redisClient.keys('chapters:*');
    if (keys.length) await redisClient.del(keys);

    res.json({ uploaded: success.length, failed });
};
