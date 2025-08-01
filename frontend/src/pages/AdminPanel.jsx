import { useState, useEffect } from 'react'
import { 
  Activity, 
  Users, 
  FileText, 
  Zap, 
  RefreshCw, 
  Play, 
  Database,
  Mail,
  Brain,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { apiEndpoints } from '../utils/api'
import { toast } from 'react-hot-toast'

export function AdminPanel() {
  const [systemStatus, setSystemStatus] = useState(null)
  const [userStats, setUserStats] = useState(null)
  const [articleStats, setArticleStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [crawling, setCrawling] = useState(false)
  const [testingAI, setTestingAI] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [statusRes, userRes, articleRes] = await Promise.all([
        apiEndpoints.adminStatus(),
        apiEndpoints.getUserStats(),
        apiEndpoints.getArticleStats()
      ])
      setSystemStatus(statusRes)
      setUserStats(userRes)
      setArticleStats(articleRes)
    } catch (error) {
      toast.error('Yönetici verileri yüklenemedi')
      console.error('Error loading admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const triggerRSSCrawl = async () => {
    setCrawling(true)
    try {
      const result = await apiEndpoints.triggerCrawl()
      toast.success(`✅ RSS taraması tamamlandı! ${result.articles_found} makale bulundu`)
      await loadDashboardData() // Refresh data
    } catch (error) {
      toast.error(`RSS taraması başarısız: ${error.message}`)
    } finally {
      setCrawling(false)
    }
  }

  const testAIService = async () => {
    setTestingAI(true)
    try {
      const result = await apiEndpoints.testAI({
        title: 'Test Article',
        content: 'This is a test article about AI technology advancements in machine learning and neural networks.'
      })
      toast.success('🤖 AI servisi mükemmel çalışıyor!')
      console.log('AI Test Result:', result)
    } catch (error) {
      toast.error(`AI testi başarısız: ${error.message}`)
    } finally {
      setTestingAI(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
      case 'healthy':
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'inactive':
        return <XCircle className="h-5 w-5 text-gray-400" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
  }

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Yönetici Paneli
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            TechNews sisteminizi izleyin ve yönetin
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={triggerRSSCrawl}
            disabled={crawling}
            className="btn-primary flex items-center disabled:opacity-50"
          >
            {crawling ? (
              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Play className="h-5 w-5 mr-2" />
            )}
            {crawling ? 'RSS Taranıyor...' : 'RSS Taraması Başlat'}
          </button>

          <button
            onClick={testAIService}
            disabled={testingAI}
            className="btn-secondary flex items-center disabled:opacity-50"
          >
            {testingAI ? (
              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Brain className="h-5 w-5 mr-2" />
            )}
            {testingAI ? 'AI Test Ediliyor...' : 'AI Servisini Test Et'}
          </button>

          <button
            onClick={loadDashboardData}
            className="btn-ghost flex items-center"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Veriyi Yenile
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userStats?.total_users || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aktif Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userStats?.active_users || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Makale</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {articleStats?.total_articles || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">İşleme Oranı</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {articleStats?.processing_rate || 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Sistem Durumu
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Veritabanı</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(systemStatus?.database_type ? 'connected' : 'inactive')}
                  <span className="text-sm font-medium">
                    {systemStatus?.database_type || 'Unknown'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">RSS Tarayıcı</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(systemStatus?.services?.rss_crawler)}
                  <span className="text-sm font-medium capitalize">
                    {systemStatus?.services?.rss_crawler || 'inactive'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">AI Özetleyici</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(systemStatus?.services?.ai_summarizer)}
                  <span className="text-sm font-medium capitalize">
                    {systemStatus?.services?.ai_summarizer || 'inactive'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">E-posta Servisi</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(systemStatus?.services?.email_service)}
                  <span className="text-sm font-medium capitalize">
                    {systemStatus?.services?.email_service || 'inactive'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Zamanlayıcı</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(systemStatus?.services?.scheduler)}
                  <span className="text-sm font-medium capitalize">
                    {systemStatus?.services?.scheduler || 'inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Kullanıcı Tercihleri
            </h3>
            {userStats?.category_preferences && (
              <div className="space-y-4">
                {Object.entries(userStats.category_preferences).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{category}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{
                            width: `${(count / userStats.total_users) * 100}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Sistem Bilgileri
            </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Sürüm</dt>
              <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                {systemStatus?.version || '1.0.0'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Ortam</dt>
              <dd className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {systemStatus?.environment || 'production'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Aktif Zaman</dt>
              <dd className="text-lg font-semibold text-gray-900 dark:text-white">Çalışıyor</dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 