'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const supabase = createClient('https://sbytfdyuhjzboifhiisl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNieXRmZHl1aGp6Ym9pZmhpaXNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNDM0MDIsImV4cCI6MjA4OTgxOTQwMn0.NCxNrG09wj55sov-CTrl45AiElRU4gXkSKaOQsrOXF0')

export default function Dashboard() {
  const [data, setData] = useState<Record<string, any[]>>({})
  const [mode, setMode] = useState('yoy')

  useEffect(() => {
    const fetchData = async () => {
      const tables = ['china_retail_sales', 'china_fixed_asset_investment', 'china_industrial_production']
      const fetched: Record<string, any[]> = {}
      for (const table of tables) {
        const { data } = await supabase.from(table).select('*').order('date', { ascending: true })
        fetched[table] = data || []
      }
      setData(fetched)
    }
    fetchData()
  }, [])

  const getLatest = (table: string, field: string) => {
    const d = data[table]
    if (!d || d.length === 0) return 'N/A'
    return d[d.length - 1][field]
  }

  const getChartData = (table: string, yoyField: string, absField: string) => {
    const d = data[table]
    if (!d) return []
    return d.map(row => ({
      date: row.date,
      value: mode === 'yoy' ? row[yoyField] : row[absField] || row[yoyField]
    }))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">China Economic Dashboard</h1>
      <div className="mb-6 flex justify-center">
        <button
          onClick={() => setMode('yoy')}
          className={`mr-4 px-6 py-2 rounded ${mode === 'yoy' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          YoY %
        </button>
        <button
          onClick={() => setMode('absolute')}
          className={`px-6 py-2 rounded ${mode === 'absolute' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          Absolute Values
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Retail Sales</h2>
          <p className="text-3xl font-bold">{getLatest('china_retail_sales', 'yoy_change')}%</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Fixed Asset Investment</h2>
          <p className="text-3xl font-bold">{getLatest('china_fixed_asset_investment', 'ytd_yoy_change')}%</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Industrial Production</h2>
          <p className="text-3xl font-bold">{getLatest('china_industrial_production', 'yoy_change')}%</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Retail Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getChartData('china_retail_sales', 'yoy_change', 'absolute_value')}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Fixed Asset Investment Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getChartData('china_fixed_asset_investment', 'ytd_yoy_change', 'absolute_value')}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
              <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Industrial Production Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getChartData('china_industrial_production', 'yoy_change', 'absolute_value')}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
              <Line type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
