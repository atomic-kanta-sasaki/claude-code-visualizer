'use client'

import { useState, useEffect } from 'react'
import { healthApi, type HealthResponse } from '@/shared/api'

export function HealthStatus() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkHealth = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await healthApi.check()
      setHealth(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  if (loading) {
    return (
      <div className="p-4 border rounded-lg">
        <p>Checking health status...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-lg bg-red-50">
        <h3 className="font-semibold text-red-800">Health Check Failed</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={checkHealth}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!health) return null

  const isHealthy = health.status === 'healthy'

  return (
    <div className={`p-4 border rounded-lg ${isHealthy ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold ${isHealthy ? 'text-green-800' : 'text-red-800'}`}>
          Service Status: {health.status}
        </h3>
        <button 
          onClick={checkHealth}
          className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
        >
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Timestamp:</span>
          <br />
          {new Date(health.timestamp).toLocaleString()}
        </div>
        
        {health.version && (
          <div>
            <span className="font-medium">Version:</span>
            <br />
            {health.version}
          </div>
        )}
        
        {health.uptime !== undefined && (
          <div>
            <span className="font-medium">Uptime:</span>
            <br />
            {Math.floor(health.uptime / 60)} minutes
          </div>
        )}
        
        {health.environment && (
          <div>
            <span className="font-medium">Environment:</span>
            <br />
            {health.environment}
          </div>
        )}
      </div>
    </div>
  )
}