import React, { useState, useEffect } from 'react'
import { testApiConnection, apiEndpoints } from '../utils/api'

const ApiTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing')
  const [healthData, setHealthData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      setConnectionStatus('testing')
      setError(null)
      
      // API bağlantısını test et
      const isConnected = await testApiConnection()
      
      if (isConnected) {
        setConnectionStatus('connected')
        
        // Health endpoint'ini test et
        try {
          const healthData = await apiEndpoints.health()
          setHealthData(healthData)
        } catch (healthError) {
          console.error('Health check hatası:', healthError)
        }
      } else {
        setConnectionStatus('failed')
        setError('API bağlantısı kurulamadı')
      }
    } catch (err) {
      setConnectionStatus('failed')
      setError(err.message)
    }
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-600'
      case 'failed':
        return 'text-red-600'
      default:
        return 'text-yellow-600'
    }
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return '✅'
      case 'failed':
        return '❌'
      default:
        return '⏳'
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">API Bağlantı Testi</h3>
      
      <div className="space-y-4">
        {/* Bağlantı Durumu */}
        <div className="flex items-center space-x-2">
          <span className="text-xl">{getStatusIcon()}</span>
          <span className={`font-medium ${getStatusColor()}`}>
            {connectionStatus === 'testing' && 'Test ediliyor...'}
            {connectionStatus === 'connected' && 'Bağlantı başarılı'}
            {connectionStatus === 'failed' && 'Bağlantı başarısız'}
          </span>
        </div>

        {/* Hata Mesajı */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Health Data */}
        {healthData && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <h4 className="font-medium text-green-800 mb-2">Backend Durumu:</h4>
            <pre className="text-xs text-green-700 overflow-auto">
              {JSON.stringify(healthData, null, 2)}
            </pre>
          </div>
        )}

        {/* Yeniden Test Butonu */}
        <button
          onClick={testConnection}
          disabled={connectionStatus === 'testing'}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {connectionStatus === 'testing' ? 'Test Ediliyor...' : 'Yeniden Test Et'}
        </button>

        {/* Environment Bilgisi */}
        <div className="text-xs text-gray-600">
          <p>Environment: {import.meta.env.MODE}</p>
          <p>API URL: {import.meta.env.VITE_API_URL || 'Varsayılan'}</p>
        </div>
      </div>
    </div>
  )
}

export default ApiTest 