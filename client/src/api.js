import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const client = axios.create({ baseURL })

export async function getCoins() {
  const { data } = await client.get('/api/coins')
  return data
}


