import React, { useEffect, useMemo, useRef, useState } from 'react'
import { getCoins } from './api.js'
import CoinTable from './components/CoinTable.jsx'

const THIRTY_MIN_MS = 30 * 60 * 1000

export default function App() {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const didRetryRef = useRef(false)
  const [lastLoadedAt, setLastLoadedAt] = useState(null)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState('marketCap')
  const [sortDir, setSortDir] = useState('desc')

  async function load() {
    try {
      setLoading(true)
      setError('')
      const data = await getCoins()
      setCoins(data)
      didRetryRef.current = false
      setLastLoadedAt(new Date())
    } catch (e) {
      setError('Failed to load data')
      // one quick retry to smooth over transient failures (e.g., rate limits)
      if (!didRetryRef.current) {
        didRetryRef.current = true
        setTimeout(() => {
          load()
        }, 1200)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const id = setInterval(load, THIRTY_MIN_MS)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = coins
    if (q) {
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
      )
    }
    const dir = sortDir === 'asc' ? 1 : -1
    const getVal = (c) => {
      switch (sortKey) {
        case 'name':
          return c.name
        case 'symbol':
          return c.symbol
        case 'priceUsd':
          return c.priceUsd
        case 'change24hPercent':
          return c.change24hPercent
        case 'lastUpdated':
          return new Date(c.lastUpdated).getTime()
        case 'marketCap':
        default:
          return c.marketCap
      }
    }
    return [...list].sort((a, b) => {
      const av = getVal(a)
      const bv = getVal(b)
      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
  }, [coins, query, sortKey, sortDir])

  function onSort(key) {
    if (key === sortKey) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div className="brand">
          <h2 style={{ margin: 0 }}>Crypto Tracker</h2>
        </div>
        <label className="switch" title="Toggle theme">
          <input type="checkbox" checked={theme === 'light'} onChange={(e) => setTheme(e.target.checked ? 'light' : 'dark')} />
          <div className="track"><div className="thumb" /></div>
          <span className="muted">{theme === 'light' ? 'Light' : 'Dark'} mode</span>
        </label>
      </div>

      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="controls">
          <input
            className="input"
            placeholder="Search by name or symbol"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="button" onClick={load}>Refresh now</button>
          {loading && <span className="muted">Loading…</span>}
          {error && <span style={{ color: 'var(--danger)' }}>{error}</span>}
          {lastLoadedAt && !loading && !error && (
            <span className="muted">Last updated: {lastLoadedAt.toLocaleString()}</span>
          )}
        </div>
      </div>

      <div className="table-wrap">
        <CoinTable coins={filtered} onSort={onSort} sortKey={sortKey} sortDir={sortDir} />
      </div>
    </div>
  )
}


