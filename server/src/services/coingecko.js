const axios = require('axios');

const DEFAULT_URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';

async function fetchTopCoins() {
  const url = process.env.COINGECKO_URL || DEFAULT_URL;
  const response = await axios.get(url, {
    timeout: 20000,
    headers: {
      'Accept': 'application/json',
    },
  });
  return response.data;
}

function normalizeCoins(rawCoins) {
  return rawCoins.map((c) => ({
    coinId: c.id,
    name: c.name,
    symbol: c.symbol,
    priceUsd: typeof c.current_price === 'number' ? c.current_price : 0,
    marketCap: typeof c.market_cap === 'number' ? c.market_cap : 0,
    change24hPercent: typeof c.price_change_percentage_24h === 'number' ? c.price_change_percentage_24h : 0,
    lastUpdated: c.last_updated ? new Date(c.last_updated) : new Date(),
  }));
}

module.exports = { fetchTopCoins, normalizeCoins };


