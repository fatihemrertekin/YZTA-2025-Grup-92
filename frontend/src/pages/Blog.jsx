import { useState } from 'react'
import { 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  ExternalLink,
  Search,
  Filter
} from 'lucide-react'

export function Blog() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const blogPosts = [
    {
      id: 1,
      title: 'Yapay Zeka Teknolojilerindeki Son Gelişmeler',
      excerpt: '2025 yılında AI alanında yaşanan önemli gelişmeler ve gelecek tahminleri...',
      author: 'Ahmet Yılmaz',
      date: '2025-07-31',
      category: 'AI',
      readTime: '5 min',
      image: '🤖',
      featured: true
    },
    {
      id: 2,
      title: 'React 19 ile Gelen Yeni Özellikler',
      excerpt: 'React\'ın en son sürümünde kullanıcı deneyimini iyileştiren yeni özellikler...',
      author: 'Zeynep Kaya',
      date: '2025-07-30',
      category: 'Yazılım',
      readTime: '8 min',
      image: '⚛️'
    },
    {
      id: 3,
      title: 'Docker ve Container Teknolojileri',
      excerpt: 'Modern yazılım geliştirme süreçlerinde container teknolojilerinin rolü...',
      author: 'Mehmet Demir',
      date: '2025-07-29',
      category: 'Yazılım',
      readTime: '6 min',
      image: '🐳'
    },
    {
      id: 4,
      title: 'Yeni Nesil İşlemciler ve Performans',
      excerpt: '2025\'te piyasaya çıkan yeni işlemci teknolojileri ve benchmark sonuçları...',
      author: 'Elif Özkan',
      date: '2025-07-28',
      category: 'Donanım',
      readTime: '7 min',
      image: '💻'
    },
    {
      id: 5,
      title: 'Machine Learning Modellerinin Optimizasyonu',
      excerpt: 'Büyük dil modellerinin performansını artırmanın yolları ve teknikler...',
      author: 'Ahmet Yılmaz',
      date: '2025-07-27',
      category: 'AI',
      readTime: '10 min',
      image: '🧠'
    },
    {
      id: 6,
      title: 'Web Güvenliği ve En İyi Uygulamalar',
      excerpt: 'Modern web uygulamalarında güvenlik açıklarını önleme yöntemleri...',
      author: 'Zeynep Kaya',
      date: '2025-07-26',
      category: 'Yazılım',
      readTime: '9 min',
      image: '🔒'
    }
  ]

  const categories = ['all', 'AI', 'Yazılım', 'Donanım']

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category) => {
    const colors = {
      'AI': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      'Yazılım': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'Donanım': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
    }
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Teknoloji dünyasından en güncel yazılar ve analizler
          </p>
        </div>

        {/* Featured Post */}
        {filteredPosts.filter(post => post.featured).map(post => (
          <div key={post.id} className="card mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-center lg:text-left">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)} mb-4`}>
                  {post.category}
                </span>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-center lg:justify-start space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(post.date)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>
                <button className="btn-primary">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Devamını Oku
                </button>
              </div>
              <div className="text-center">
                <div className="text-8xl mb-4">{post.image}</div>
              </div>
            </div>
          </div>
        ))}

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Blog yazısı ara..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                className="input pl-10 pr-10 appearance-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category} className="capitalize">
                    {category === 'all' ? 'Tüm Kategoriler' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredPosts.length} yazı bulundu
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.filter(post => !post.featured).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Yazı bulunamadı
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Aramanızı veya filtrelerinizi ayarlamayı deneyin' 
                : 'Yakında yeni blog yazıları eklenecek'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.filter(post => !post.featured).map((post) => (
              <article
                key={post.id}
                className="card group hover:shadow-lg transition-shadow duration-300"
              >
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(post.category)}`}>
                    <Tag className="inline h-3 w-3 mr-1" />
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {post.readTime}
                  </span>
                </div>

                {/* Image */}
                <div className="text-center mb-4">
                  <div className="text-4xl">{post.image}</div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {post.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <User className="h-3 w-3" />
                    <span>{post.author}</span>
                  </div>
                  
                  <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium flex items-center group/link">
                    Devamını Oku
                    <ExternalLink className="h-3 w-3 ml-1 group-hover/link:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="card mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Blog Güncellemelerini Kaçırmayın
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Yeni blog yazılarımızdan haberdar olmak için bültenimize abone olun
          </p>
          <a
            href="/#subscribe"
            className="btn-primary px-8 py-3"
          >
            Ücretsiz Abone Ol
          </a>
        </div>
      </div>
    </div>
  )
} 