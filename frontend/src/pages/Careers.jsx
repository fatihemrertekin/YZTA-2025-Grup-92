import { useState } from 'react'
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Users, 
  Zap, 
  Heart,
  Globe,
  Award,
  BookOpen,
  Coffee
} from 'lucide-react'

export function Careers() {
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const departments = ['all', 'Engineering', 'Design', 'Marketing', 'Product']

  const jobOpenings = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'İstanbul, Türkiye',
      type: 'Tam Zamanlı',
      experience: '3+ yıl',
      description: 'React, TypeScript ve modern web teknolojileri konusunda deneyimli geliştirici arıyoruz.',
      requirements: [
        'React, TypeScript ve modern JavaScript deneyimi',
        'Tailwind CSS ve modern CSS framework\'leri',
        'Git ve versiyon kontrol sistemleri',
        'Agile metodolojileri deneyimi',
        'İyi seviyede İngilizce'
      ],
      benefits: [
        'Uzaktan çalışma imkanı',
        'Esnek çalışma saatleri',
        'Sürekli öğrenme ve gelişim fırsatları',
        'Rekabetçi maaş ve yan haklar'
      ]
    },
    {
      id: 2,
      title: 'AI/ML Engineer',
      department: 'Engineering',
      location: 'İstanbul, Türkiye',
      type: 'Tam Zamanlı',
      experience: '2+ yıl',
      description: 'Machine Learning ve AI teknolojileri konusunda uzman mühendis arıyoruz.',
      requirements: [
        'Python ve ML framework\'leri deneyimi',
        'NLP ve büyük dil modelleri konusunda bilgi',
        'Google Gemini API deneyimi',
        'Veri analizi ve görselleştirme becerileri',
        'Araştırma ve geliştirme tutkusu'
      ],
      benefits: [
        'En son AI teknolojileri ile çalışma',
        'Konferans ve eğitim desteği',
        'Açık kaynak projelere katkı fırsatı',
        'Yüksek performanslı donanım'
      ]
    },
    {
      id: 3,
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'İstanbul, Türkiye',
      type: 'Tam Zamanlı',
      experience: '2+ yıl',
      description: 'Kullanıcı deneyimi odaklı, yaratıcı tasarımcı arıyoruz.',
      requirements: [
        'Figma ve modern tasarım araçları deneyimi',
        'Kullanıcı araştırması ve test yöntemleri',
        'Responsive ve accessible tasarım bilgisi',
        'Prototip ve wireframe oluşturma becerileri',
        'Tasarım sistemleri ve component library deneyimi'
      ],
      benefits: [
        'Yaratıcı özgürlük ve otonomi',
        'Modern tasarım araçları ve kaynaklar',
        'Tasarım topluluğu ve networking',
        'Portfolio geliştirme desteği'
      ]
    },
    {
      id: 4,
      title: 'Product Manager',
      department: 'Product',
      location: 'İstanbul, Türkiye',
      type: 'Tam Zamanlı',
      experience: '3+ yıl',
      description: 'Ürün stratejisi ve roadmap geliştirme konusunda deneyimli PM arıyoruz.',
      requirements: [
        'Agile ve Scrum metodolojileri deneyimi',
        'Veri odaklı karar verme becerileri',
        'Stakeholder yönetimi ve iletişim becerileri',
        'Teknoloji ürünleri konusunda bilgi',
        'Analitik araçlar ve A/B test deneyimi'
      ],
      benefits: [
        'Stratejik karar verme süreçlerinde rol',
        'Cross-functional ekip liderliği',
        'Ürün geliştirme süreçlerinde otonomi',
        'Kariyer gelişimi ve mentorluk'
      ]
    }
  ]

  const filteredJobs = jobOpenings.filter(job => 
    selectedDepartment === 'all' || job.department === selectedDepartment
  )

  const companyValues = [
    {
      icon: Heart,
      title: 'İnsan Odaklı',
      description: 'Çalışanlarımızın mutluluğu ve gelişimi bizim için öncelik.'
    },
    {
      icon: Zap,
      title: 'Hızlı İnovasyon',
      description: 'Teknolojideki en son gelişmeleri takip ediyor ve uyguluyoruz.'
    },
    {
      icon: Globe,
      title: 'Uzaktan Çalışma',
      description: 'Dünyanın her yerinden çalışabilme esnekliği sunuyoruz.'
    },
    {
      icon: Award,
      title: 'Sürekli Öğrenme',
      description: 'Kişisel ve profesyonel gelişim için sürekli eğitim fırsatları.'
    }
  ]

  const benefits = [
    {
      icon: Coffee,
      title: 'Esnek Çalışma',
      description: 'Kendi programınızı oluşturabilir, uzaktan çalışabilirsiniz.'
    },
    {
      icon: BookOpen,
      title: 'Eğitim Desteği',
      description: 'Kurslar, konferanslar ve sertifikalar için tam destek.'
    },
    {
      icon: Users,
      title: 'Takım Aktiviteleri',
      description: 'Düzenli takım buluşmaları ve sosyal etkinlikler.'
    },
    {
      icon: Award,
      title: 'Performans Ödülleri',
      description: 'Başarılı performans için bonus ve ödül sistemi.'
    }
  ]

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Kariyer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Teknoloji dünyasında fark yaratmak isteyen yetenekli insanlar arıyoruz. 
            TechNews ailesine katılın ve geleceği birlikte şekillendirelim.
          </p>
        </div>

        {/* Company Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Değerlerimiz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {companyValues.map((value, index) => (
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

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Yan Haklarımız
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="card text-center">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20 w-fit mx-auto mb-4">
                  <benefit.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Job Openings */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Açık Pozisyonlar
          </h2>
          
          {/* Department Filter */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedDepartment === dept
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {dept === 'all' ? 'Tüm Departmanlar' : dept}
                </button>
              ))}
            </div>
          </div>

          {/* Jobs List */}
          <div className="space-y-6">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💼</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Şu anda açık pozisyon bulunmuyor
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Gelecekteki fırsatlar için bizi takip edin
                </p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div key={job.id} className="card">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {job.title}
                        </h3>
                        <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full">
                          {job.department}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {job.type}
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {job.experience}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {job.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Gereksinimler
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                            {job.requirements.map((req, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Yan Haklar
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                            {job.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-600 dark:text-green-400 mr-2">•</span>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 lg:mt-0 lg:ml-6">
                      <button className="btn-primary w-full lg:w-auto">
                        Başvur
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Bizimle İletişime Geçin
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Açık pozisyonlarımızda göremediğiniz bir rol varsa, 
            özgeçmişinizi gönderebilirsiniz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              <Briefcase className="h-4 w-4 mr-2" />
              Özgeçmiş Gönder
            </button>
            <button className="btn-secondary">
              <Users className="h-4 w-4 mr-2" />
              İletişime Geç
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 