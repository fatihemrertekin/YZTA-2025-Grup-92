import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Mail, Calendar, ExternalLink, Zap, Clock, Tag } from 'lucide-react'

export function EmailPreview() {
  const { type } = useParams()
  const [selectedTemplate, setSelectedTemplate] = useState(type || 'daily')

  // Mock data for preview
  const mockArticles = [
    {
      id: 1,
      title: 'Microsoft Edge becomes an AI browser with launch of Copilot Mode',
      summary: 'Microsoft integrates advanced AI capabilities directly into Edge browser, offering users real-time assistance with web browsing, content summarization, and productivity features.',
      category: 'Yapay Zeka',
      source: 'TechCrunch',
      link: 'https://techcrunch.com/example',
      published_at: '2024-01-28T10:00:00Z'
    },
    {
      id: 2,
      title: 'Tesla signs $16.5B deal with Samsung to make AI chips',
      summary: 'Tesla partners with Samsung to develop custom AI processing chips for next-generation autonomous vehicles, marking a significant step in automotive AI technology.',
      category: 'Yapay Zeka',
      source: 'TechCrunch',
      link: 'https://techcrunch.com/example2',
      published_at: '2024-01-28T09:30:00Z'
    },
    {
      id: 3,
      title: 'Anthropic unveils new rate limits to curb Claude Code power users',
      summary: 'AI company Anthropic introduces usage restrictions for its Claude coding assistant to ensure fair access and prevent system overload from intensive users.',
      category: 'Yazılım',
      source: 'TechCrunch',
      link: 'https://techcrunch.com/example3',
      published_at: '2024-01-28T08:45:00Z'
    }
  ]

  const getCategoryColor = (category) => {
    const colors = {
      'Yapay Zeka': '#8B5CF6',
      'Yazılım': '#3B82F6', 
      'Donanım': '#10B981',
      'Diğer': '#6B7280'
    }
    return colors[category] || colors['Diğer']
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Email HTML Template
  const EmailTemplate = () => (
    <div style={{
      fontFamily: 'Inter, system-ui, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
        color: 'white',
        padding: '32px 24px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '8px',
            marginRight: '12px'
          }}>
            ⚡
          </div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
            Tech<span style={{ opacity: 0.9 }}>News</span>
          </h1>
        </div>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '500', opacity: 0.95 }}>
          {selectedTemplate === 'daily' ? 'Günlük' : 'Haftalık'} Teknoloji Özeti
        </h2>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
          {formatDate(new Date())}
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>
        {/* Intro */}
        <p style={{ 
          margin: '0 0 24px 0', 
          fontSize: '16px', 
          lineHeight: '1.5', 
          color: '#374151' 
        }}>
          🚀 Günaydın! İşte bugünün en önemli teknoloji haberleri, AI tarafından seçildi ve özel olarak sizin için özetlendi.
        </p>

        {/* Articles */}
        <div style={{ marginBottom: '32px' }}>
          {mockArticles.map((article, index) => (
            <div key={article.id} style={{
              borderLeft: `3px solid ${getCategoryColor(article.category)}`,
              paddingLeft: '16px',
              marginBottom: index < mockArticles.length - 1 ? '24px' : '0',
              backgroundColor: '#F9FAFB',
              borderRadius: '0 8px 8px 0',
              padding: '20px'
            }}>
              {/* Category Badge */}
              <div style={{ marginBottom: '12px' }}>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: getCategoryColor(article.category),
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {article.category}
                </span>
              </div>

              {/* Title */}
              <h3 style={{
                margin: '0 0 12px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                lineHeight: '1.4'
              }}>
                {article.title}
              </h3>

              {/* Summary */}
              <p style={{
                margin: '0 0 16px 0',
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#4B5563'
              }}>
                {article.summary}
              </p>

              {/* Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
                color: '#6B7280'
              }}>
                <span>📰 {article.source}</span>
                <a 
                  href={article.link}
                  style={{
                    color: '#3B82F6',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                >
                  Tam Makaleyi Oku →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{
          backgroundColor: '#F3F4F6',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>
                {mockArticles.length}
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                                  Bugünkü Makaleler
              </div>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>
                3
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                                  Kategoriler
              </div>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>
                ~5min
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                                  Okuma Süresi
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <a 
            href="/#/archive"
            style={{
              display: 'inline-block',
              backgroundColor: '#3B82F6',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            📰 Tam Arşive Göz At
          </a>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: '#F9FAFB',
        padding: '20px 24px',
        borderTop: '1px solid #E5E7EB',
        textAlign: 'center',
        fontSize: '12px',
        color: '#6B7280'
      }}>
        <p style={{ margin: '0 0 8px 0' }}>
          TechNews'e abone olduğunuz için bu e-postayı alıyorsunuz
        </p>
        <p style={{ margin: '0 0 12px 0' }}>
          <a href="#" style={{ color: '#3B82F6', textDecoration: 'none' }}>
            Tercihleri Güncelle
          </a>
          {' | '}
          <a href="#" style={{ color: '#3B82F6', textDecoration: 'none' }}>
            Aboneliği İptal Et
          </a>
        </p>
        <p style={{ margin: 0 }}>
          © 2024 TechNews • React + FastAPI + Gemini AI ile geliştirildi
        </p>
      </div>
    </div>
  )

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            E-posta Önizlemesi
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Bülteninizin gelen kutunuzda nasıl görüneceğini görün
          </p>
        </div>

        {/* Template Selector */}
        <div className="mb-8 flex justify-center">
          <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setSelectedTemplate('daily')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTemplate === 'daily'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="inline h-4 w-4 mr-1" />
              Günlük Özet
            </button>
            <button
              onClick={() => setSelectedTemplate('weekly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTemplate === 'weekly'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Clock className="inline h-4 w-4 mr-1" />
              Haftalık Özet
            </button>
          </div>
        </div>

        {/* Preview Info */}
        <div className="card mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Mail className="h-6 w-6 text-primary-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Bülten Önizlemesi
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="font-medium text-gray-600 dark:text-gray-400">Şablon</dt>
              <dd className="text-gray-900 dark:text-white capitalize">{selectedTemplate === 'daily' ? 'Günlük' : 'Haftalık'} Özet</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-600 dark:text-gray-400">Makaleler</dt>
              <dd className="text-gray-900 dark:text-white">{mockArticles.length} Öne Çıkan</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-600 dark:text-gray-400">Okuma Süresi</dt>
              <dd className="text-gray-900 dark:text-white">~5 minutes</dd>
            </div>
          </div>
        </div>

        {/* Email Preview */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              📧 Email Preview
            </div>
          </div>
          
          <EmailTemplate />
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20 w-fit mx-auto mb-4">
              <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Yapay Zeka Destekli
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Her özet maksimum doğruluk ve uygunluk için Gemini AI tarafından oluşturulur.
            </p>
          </div>

          <div className="card text-center">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20 w-fit mx-auto mb-4">
              <Tag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Kategorilendirilmiş
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Makaleler otomatik olarak Yapay Zeka, Yazılım, Donanım ve daha fazlasına göre sıralanır.
            </p>
          </div>

          <div className="card text-center">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20 w-fit mx-auto mb-4">
              <ExternalLink className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Doğrudan Bağlantılar
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              TechCrunch ve The Verge gibi güvenilir kaynaklardan tam makalelere hızlı erişim.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/#subscribe"
            className="btn-primary px-8 py-4 text-lg"
          >
            <Mail className="mr-2 h-5 w-5" />
            Bültene Abone Ol
          </a>
        </div>
      </div>
    </div>
  )
} 