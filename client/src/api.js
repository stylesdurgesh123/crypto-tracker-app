import axios from 'axios'

const BASE_URL = "https://crypto-tracker-app-3.onrender.com";

const client = axios.create({ baseURL: BASE_URL });

export async function getCoins() {
  const { data } = await client.get('/api/coins')
  return data
}


