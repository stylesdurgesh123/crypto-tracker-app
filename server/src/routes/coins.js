const express = require('express');
const router = express.Router();
const { fetchTopCoins, normalizeCoins } = require('../services/coingecko');
const CurrentData = require('../models/CurrentData');

// simple in-memory cache to reduce upstream calls and rate limit issues
let cache = { data: null, fetchedAt: 0 };
const CACHE_TTL_MS = 60 * 1000; // 1 minute

// GET /api/coins - fetch live data and also store/overwrite CurrentData
router.get('/', async (req, res) => {
  try {
    const now = Date.now();
    if (cache.data && now - cache.fetchedAt < CACHE_TTL_MS) {
      return res.json(cache.data);
    }

    const coins = normalizeCoins(await fetchTopCoins());

    // Upsert each coin into CurrentData (overwrite current snapshot)
    const bulkOps = coins.map((coin) => ({
      updateOne: {
        filter: { coinId: coin.coinId },
        update: { $set: coin },
        upsert: true,
      },
    }));
    if (bulkOps.length > 0) {
      await CurrentData.bulkWrite(bulkOps, { ordered: false });
    }

    cache = { data: coins, fetchedAt: Date.now() };
    res.json(coins);
  } catch (err) {
    console.error('GET /api/coins error:', err.message);
    try {
      // Fallback to latest stored CurrentData
      const docs = await CurrentData.find({}).lean();
      if (docs && docs.length > 0) {
        return res.json(docs.map((d) => ({
          coinId: d.coinId,
          name: d.name,
          symbol: d.symbol,
          priceUsd: d.priceUsd,
          marketCap: d.marketCap,
          change24hPercent: d.change24hPercent,
          lastUpdated: d.lastUpdated,
        })));
      }
    } catch (dbErr) {
      console.error('Fallback to CurrentData failed:', dbErr.message);
    }
    res.status(500).json({ error: 'Failed to fetch coins' });
  }
});

module.exports = router;


