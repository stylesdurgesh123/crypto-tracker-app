const mongoose = require('mongoose');

const CurrentDataSchema = new mongoose.Schema(
  {
    coinId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    priceUsd: { type: Number, required: true },
    marketCap: { type: Number, required: true },
    change24hPercent: { type: Number, required: true },
    lastUpdated: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CurrentData', CurrentDataSchema);


