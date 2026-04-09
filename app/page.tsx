'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const dashboards = [
  {
    key: 'china_retail_sales',
    title: 'Retail Sales',
    cardField: 'yoy_change',
    suffix: '%',
    chartField: 'yoy_change',
    absField: 'absolute_value'
  },
  {
    key: 'china_fixed_asset_investment',
    title: 'Fixed Asset Investment',
    cardField: 'ytd_yoy_change',
    suffix: '%',
    chartField: 'ytd_yoy_change',
    absField: 'absolute_value'
  },
  {
    key: 'china_industrial_production',
    title: 'Industrial Production',
    cardField: 'yoy_change',
    suffix: '%',
    chartField: 'yoy_change',
    absField: 'absolute_value'
  },
  {
    key: 'china_cpi',
    title: 'Consumer Price Index (CPI)',
    cardField: 'yoy_change',
    suffix: '%',
    chartField: 'yoy_change'
  },
  {
    key: 'china_pmi',
    title: 'Manufacturing PMI',
    cardField: 'index_value',
    suffix: '',
    chartField: 'index_value'
  },
  {
    key: 'china_trade_balance',
    title: 'Trade Balance (Exports - Imports)',
    cardField: 'balance_usd_billion',
    suffix: 'B USD',
    chartField: 'balance_usd_billion'
  },
  {
    key: 'china_usd_cny',
    title: 'USD/CNY Exchange Rate',
    cardField: 'exchange_rate',
    suffix: '',
    chartField: 'exchange_rate'
  },
  {
    key: 'china_fdi',
    title: 'FDI YoY Change',
    cardField: 'yoy_change',
    suffix: '%',
    chartField: 'yoy_change'
  },
  {
    key: 'china_unemployment',
    title: 'Urban Unemployment Rate',
    cardField: 'unemployment_rate',
    suffix: '%',
    chartField: 'unemployment_rate'
  }
]

export default function Dashboard() {
  const [data, setData] = useState<Record<string, any[]>>({})
  const [mode, setMode] = useState<'yoy' | 'absolute'>('yoy')

  useEffect(() => {
    const fetchData = async () => {
      const fetched: Record<string, any[]> = {}
      for (const panel of dashboards) {
        const { data: tableData } = await supabase.from(panel.key).select('*').order('date', { ascending: true })
        fetched[panel.key] = tableData || []
      }
      setData(fetched)
    }
    fetchData()
  }, [])

  const getLatest = (table: string, field: string) => {
    const d = data[table]
    if (!d || d.length === 0) return 'N/A'
    return d[d.length - 1][field] ?? 'N/A'
  }

  const getChartData = (panel: typeof dashboards[number]) => {
    const d = data[panel.key]
    if (!d) return []
    const field = mode === 'absolute' && panel.absField ? panel.absField : panel.chartField
    return d.map(row => ({
      date: row.date,
      value: row[field]
    }))
  }

  return (
    <div className="min-h-screen bg-white text-black p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">China Economic Dashboard</h1>
      <div className="mb-6 flex justify-center">
        <button
          onClick={() => setMode('yoy')}
          className={`mr-4 px-6 py-2 rounded ${mode === 'yoy' ? 'bg-blue-600' : 'bg-gray-300'}`}
        >
          YoY %
        </button>
        <button
          onClick={() => setMode('absolute')}
          className={`px-6 py-2 rounded ${mode === 'absolute' ? 'bg-blue-600' : 'bg-gray-300'}`}
        >
          Absolute Values
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {dashboards.map(panel => (
          <div key={panel.key} className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2">{panel.title}</h2>
            <p className="text-3xl font-bold">
              {getLatest(panel.key, panel.cardField)} {panel.suffix}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {dashboards.map(panel => (
          <div key={panel.key} className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">{panel.title} Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getChartData(panel)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#f9fafb', border: 'none' }} />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  )
}

