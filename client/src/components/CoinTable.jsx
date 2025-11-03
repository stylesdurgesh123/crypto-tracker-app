import React from 'react'

export default function CoinTable({ coins, onSort, sortKey, sortDir }) {
  const headers = [
    { key: 'name', label: 'Coin Name' },
    { key: 'symbol', label: 'Symbol' },
    { key: 'priceUsd', label: 'Current Price (USD)' },
    { key: 'marketCap', label: 'Market Cap' },
    { key: 'change24hPercent', label: '24h % Change' },
    { key: 'lastUpdated', label: 'Last Updated' },
  ]

  function SortButton({ columnKey }) {
    const active = sortKey === columnKey
    const arrow = active ? (sortDir === 'asc' ? '▲' : '▼') : ''
    return (
      <button
        onClick={() => onSort(columnKey)}
        style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: active ? 700 : 500 }}
      >
        {headers.find((h) => h.key === columnKey)?.label} {arrow}
      </button>
    )
  }

  return (
    <table>
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h.key}>
              <SortButton columnKey={h.key} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {coins.map((c) => (
          <tr key={c.coinId}>
            <td>{c.name}</td>
            <td style={{ textTransform: 'uppercase' }}>{c.symbol}</td>
            <td className="num">${c.priceUsd.toLocaleString(undefined, { maximumFractionDigits: 6 })}</td>
            <td className="num">${c.marketCap.toLocaleString()}</td>
            <td className={c.change24hPercent >= 0 ? 'chip-pos' : 'chip-neg'}>
              {c.change24hPercent.toFixed(2)}%
            </td>
            <td>{new Date(c.lastUpdated).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}


