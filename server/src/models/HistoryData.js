const mongoose = require('mongoose');

const HistoryDataSchema = new mongoose.Schema(
  {
    coinId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    priceUsd: { type: Number, required: true },
    marketCap: { type: Number, required: true },
    change24hPercent: { type: Number, required: true },
    lastUpdated: { type: Date, required: true },
    snapshotAt: { type: Date, required: true, default: () => new Date() },
  },
  { timestamps: true }
);

HistoryDataSchema.index({ coinId: 1, snapshotAt: -1 });

module.exports = mongoose.model('HistoryData', HistoryDataSchema);


