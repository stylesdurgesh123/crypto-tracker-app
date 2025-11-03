const express = require('express');
const router = express.Router();
const HistoryData = require('../models/HistoryData');
const { fetchTopCoins, normalizeCoins } = require('../services/coingecko');

// POST /api/history - store a snapshot of current prices
router.post('/', async (req, res) => {
  try {
    const coins = normalizeCoins(await fetchTopCoins());
    const now = new Date();
    const docs = coins.map((c) => ({ ...c, snapshotAt: now }));
    await HistoryData.insertMany(docs, { ordered: false });
    res.status(201).json({ inserted: docs.length, snapshotAt: now.toISOString() });
  } catch (err) {
    console.error('POST /api/history error:', err.message);
    res.status(500).json({ error: 'Failed to store history' });
  }
});

// GET /api/history/:coinId - get historical price data
router.get('/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params;
    const limit = Math.min(parseInt(req.query.limit || '200', 10), 1000);
    const docs = await HistoryData.find({ coinId })
      .sort({ snapshotAt: -1 })
      .limit(limit)
      .lean();
    res.json(docs);
  } catch (err) {
    console.error('GET /api/history/:coinId error:', err.message);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;


