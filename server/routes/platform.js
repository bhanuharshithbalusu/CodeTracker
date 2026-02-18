const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { fetchStats, calculateStreak } = require('../utils/platformUtils');

const VALID_PLATFORMS = ['codeforces', 'leetcode', 'codechef'];
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// POST /api/platform/connect — Add or update a platform handle
router.post('/connect', auth, [
    body('platform').isIn(VALID_PLATFORMS).withMessage('Invalid platform'),
    body('handle').trim().isLength({ min: 1, max: 50 }).withMessage('Handle is required (max 50 chars)'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
        const { platform, handle } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Fetch stats for the platform
        const data = await fetchStats(handle, platform);

        user.platforms[platform].handle = handle;
        user.platforms[platform].stats = data.stats;
        user.platforms[platform].heatmap = data.heatmap;
        user.platforms[platform].recentSubmissions = data.recentSubmissions;
        user.platforms[platform].lastFetched = new Date();

        // Recalculate totals
        user.totalSolved = VALID_PLATFORMS.reduce((sum, p) => sum + (user.platforms[p]?.stats?.solved || 0), 0);

        // Calculate streaks from combined heatmaps
        const allHeatmaps = VALID_PLATFORMS
            .filter(p => user.platforms[p]?.handle)
            .flatMap(p => user.platforms[p].heatmap || []);

        // Merge heatmaps by date
        const merged = {};
        allHeatmaps.forEach(h => {
            merged[h.date] = (merged[h.date] || 0) + h.count;
        });
        const mergedArr = Object.entries(merged)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, count]) => ({ date, count }));

        const streaks = calculateStreak(mergedArr);
        user.currentStreak = streaks.current;
        user.longestStreak = streaks.longest;

        await user.save();

        const safeUser = user.toJSON();
        delete safeUser.password;
        res.json(safeUser);
    } catch (err) {
        console.error('Connect platform error:', err);
        res.status(500).json({ message: 'Failed to fetch platform stats' });
    }
});

// DELETE /api/platform/disconnect
router.delete('/disconnect', auth, [
    body('platform').isIn(VALID_PLATFORMS).withMessage('Invalid platform'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
        const { platform } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.platforms[platform] = { handle: '', stats: {}, heatmap: [], recentSubmissions: [], lastFetched: null };
        user.totalSolved = VALID_PLATFORMS.reduce((sum, p) => sum + (user.platforms[p]?.stats?.solved || 0), 0);
        await user.save();

        const safeUser = user.toJSON();
        delete safeUser.password;
        res.json(safeUser);
    } catch (err) {
        console.error('Disconnect error:', err);
        res.status(500).json({ message: 'Failed to disconnect platform' });
    }
});

// GET /api/platform/refresh — Refresh stale data
router.get('/refresh', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const now = Date.now();
        let updated = false;

        for (const platform of VALID_PLATFORMS) {
            const p = user.platforms[platform];
            if (p?.handle) {
                const lastFetched = p.lastFetched ? new Date(p.lastFetched).getTime() : 0;
                if (now - lastFetched > CACHE_DURATION) {
                    const data = await fetchStats(p.handle, platform);
                    p.stats = data.stats;
                    p.heatmap = data.heatmap;
                    p.recentSubmissions = data.recentSubmissions;
                    p.lastFetched = new Date();
                    updated = true;
                }
            }
        }

        if (updated) {
            user.totalSolved = VALID_PLATFORMS.reduce((sum, p) => sum + (user.platforms[p]?.stats?.solved || 0), 0);
            await user.save();
        }

        const safeUser = user.toJSON();
        delete safeUser.password;
        res.json(safeUser);
    } catch (err) {
        console.error('Refresh error:', err);
        res.status(500).json({ message: 'Failed to refresh stats' });
    }
});

module.exports = router;
