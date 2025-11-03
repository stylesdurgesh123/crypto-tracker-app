const cron = require('node-cron');
const HistoryData = require('../models/HistoryData');
const CurrentData = require('../models/CurrentData');
const { fetchTopCoins, normalizeCoins } = require('../services/coingecko');

async function runSnapshotOnce() {
  const coins = normalizeCoins(await fetchTopCoins());
  const now = new Date();

  // Insert into history
  const historyDocs = coins.map((c) => ({ ...c, snapshotAt: now }));
  await HistoryData.insertMany(historyDocs, { ordered: false });

  // Overwrite current
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
  return { count: coins.length, snapshotAt: now.toISOString() };
}

// Schedule to run every hour at minute 0
cron.schedule('0 * * * *', async () => {
  try {
    const result = await runSnapshotOnce();
    console.log(`[cron] Snapshot stored:`, result);
  } catch (err) {
    console.error('[cron] Snapshot failed:', err.message);
  }
});

module.exports = { runSnapshotOnce };


