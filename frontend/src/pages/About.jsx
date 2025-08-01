import { 
  Users, 
  Target, 
  Zap, 
  Heart, 
  Award, 
  Globe,
  TrendingUp,
  Shield
} from 'lucide-react'

export function About() {
  const stats = [
    { number: '1000+', label: 'Makale Analiz Edildi', icon: TrendingUp },
    { number: '50+', label: 'Mutlu Okuyucu', icon: Heart },
    { number: '3', label: 'Teknoloji Kategorisi', icon: Target },
    { number: '24/7', label: 'AI Destekli Hizmet', icon: Zap }
  ]

  const team = [
    {
      name: 'Fatih Emre Ertekin',
      role: 'Geliştirici',
      avatar: '👨‍💻',
      bio: 'Full-stack geliştirici. React, Python ve AI teknolojileri uzmanı.'
    },
    {
      name: 'Furkan Öztürk',
      role: 'Scrum Master',
      avatar: '👨‍💼',
      bio: 'Agile metodolojileri ve proje yönetimi konusunda deneyimli.'
    }
  ]

  const values = [
    {
      icon: Target,
      title: 'Odaklanmış İçerik',
      description: 'Sadece en önemli teknoloji haberlerini seçiyor ve özetliyoruz.'
    },
    {
      icon: Zap,
      title: 'Hızlı Teslimat',
      description: 'Günlük veya haftalık olarak düzenli e-posta gönderimi.'
    },
    {
      icon: Shield,
      title: 'Güvenilirlik',
      description: 'Sadece güvenilir kaynaklardan haber topluyoruz.'
    },
    {
      icon: Heart,
      title: 'Kullanıcı Odaklı',
      description: 'Her kullanıcının ihtiyaçlarına göre kişiselleştirilmiş içerik.'
    }
  ]

  const timeline = [
    {
      year: '2024',
      title: 'Proje Başlangıcı',
      description: 'TechNews fikri doğdu ve geliştirme süreci başladı.'
    },
    {
      year: '2024',
      title: 'MVP Geliştirme',
      description: 'İlk sürüm geliştirildi ve test kullanıcıları ile denendi.'
    },
    {
      year: '2025',
      title: 'AI Entegrasyonu',
      description: 'Google Gemini AI entegrasyonu tamamlandı.'
    },
    {
      year: '2025',
      title: 'Lansman',
      description: 'TechNews resmi olarak yayına başladı.'
    }
  ]

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Hakkımızda
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            TechNews, teknoloji dünyasındaki en önemli gelişmeleri 
            yapay zeka destekli özetlerle sizlere sunan bir platformdur.
          </p>
        </div>

        {/* Mission */}
        <div className="card mb-12">
          <div className="text-center">
            <Target className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Misyonumuz
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Teknoloji dünyasındaki bilgi karmaşasını ortadan kaldırarak, 
              kullanıcılarımıza en değerli ve güncel haberleri, 
              yapay zeka destekli özetlerle sunmak.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="card text-center">
              <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/20 w-fit mx-auto mb-4">
                <stat.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Değerlerimiz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/20">
                    <value.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Ekibimiz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {team.map((member, index) => (
              <div key={index} className="card text-center">
                <div className="text-4xl mb-4">{member.avatar}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 text-sm mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Yolculuğumuz
          </h2>
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-bold">
                      {item.year}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="card">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Teknoloji Altyapımız
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-900/20 w-fit mx-auto mb-4">
                <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Frontend
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                React, Tailwind CSS, Vite
              </p>
            </div>
            <div className="text-center">
              <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/20 w-fit mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Backend
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                FastAPI, PostgreSQL, Docker
              </p>
            </div>
            <div className="text-center">
              <div className="p-4 rounded-lg bg-purple-100 dark:bg-purple-900/20 w-fit mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                AI
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Google Gemini 1.5 Flash
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Bize Katılın
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Teknoloji dünyasındaki en önemli gelişmeleri kaçırmayın
          </p>
          <a
            href="/#subscribe"
            className="btn-primary px-8 py-4 text-lg"
          >
            Ücretsiz Abone Ol
          </a>
        </div>
      </div>
    </div>
  )
} 