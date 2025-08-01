import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { 
  Zap, 
  Mail, 
  Brain, 
  Clock, 
  Shield, 
  Sparkles,
  ArrowRight,
  Check,
  Star
} from 'lucide-react'
import { apiEndpoints } from '../utils/api'

export function LandingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const categories = ['Yapay Zeka', 'Yazılım', 'Donanım']
  const frequencies = ['daily', 'weekly']
  
  const frequencyLabels = {
    'daily': 'günlük',
    'weekly': 'haftalık'
  }

  const onSubscribe = async (data) => {
    setIsLoading(true)
    try {
      await apiEndpoints.subscribeUser(data)
      toast.success("🎉 Başarıyla abone oldunuz! TechNews'e hoş geldiniz!")
      reset()
    } catch (error) {
      toast.error(`Abonelik başarısız: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 bg-grid-gray-100/25 dark:bg-grid-gray-700/25" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="animate-in">
              <div className="flex items-center space-x-2 mb-6">
                <span className="px-3 py-1 text-sm font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 rounded-full">
                  ✨ Powered by Gemini AI
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Önde Kalın
                <span className="text-gradient block">Yapay Zeka Destekli</span>
                Teknoloji Haberleri ile
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                TechCrunch, The Verge ve diğer kaynaklardan günlük seçilen teknoloji haberlerini alın.
                Yapay zekamız <strong>Yapay Zeka, Yazılım ve Donanım</strong> alanındaki son gelişmeleri özetliyor, 
                önemli hiçbir şeyi kaçırmıyorsunuz.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#subscribe"
                  className="btn-primary px-8 py-4 text-lg group"
                >
                  Ücretsiz Bültene Başla
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="/preview"
                  className="btn-ghost px-8 py-4 text-lg"
                >
Örnek Gör
                </a>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-8 mt-12">
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">1000+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Makale Analiz Edildi</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">50+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Mutlu Okuyucu</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">Günlük</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Taze İçerik</div>
                </div>
              </div>
            </div>

            {/* Subscription Form */}
            <div className="lg:ml-8">
              <div className="card p-8 animate-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center space-x-2 mb-6">
                  <Sparkles className="h-6 w-6 text-primary-500" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Şimdi Abone Ol
                  </h2>
                </div>

                <form onSubmit={handleSubmit(onSubscribe)} className="space-y-6">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="label">
                      E-posta Adresi
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="input"
                      placeholder="sizin@email.com"
                      {...register('email', {
                        required: 'E-posta gereklidir',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Geçersiz e-posta adresi'
                        }
                      })}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="label">İlgi Alanları</label>
                    <div className="grid grid-cols-3 gap-2">
                      {categories.map((category) => (
                        <label key={category} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            value={category}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            {...register('selected_categories', {
                              required: 'En az bir ilgi alanı seçin'
                            })}
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {category}
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.selected_categories && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.selected_categories.message}
                      </p>
                    )}
                  </div>

                  {/* Frequency */}
                  <div>
                    <label className="label">Sıklık</label>
                    <div className="grid grid-cols-2 gap-2">
                      {frequencies.map((freq) => (
                        <label key={freq} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            value={freq}
                            className="border-gray-300 text-primary-600 focus:ring-primary-500"
                            {...register('frequency', { required: 'Sıklık seçin' })}
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                            {frequencyLabels[freq]}
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.frequency && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.frequency.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Abone oluyor...
                      </div>
                    ) : (
                      'Ücretsiz Abone Ol'
                    )}
                  </button>
                </form>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                  Spam yok. İstediğiniz zaman aboneliği iptal edebilirsiniz. Gemini AI tarafından desteklenir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Neden TechNews Seçmelisiniz?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Gelişmiş yapay zeka, mükemmel teknoloji özeti için seçilen içerikle buluşuyor
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'Yapay Zeka Destekli Özetler',
                description: 'Google Gemini karmaşık makaleleri analiz ediyor ve sindirilebilir içgörülere dönüştürüyor.',
                color: 'text-purple-500'
              },
              {
                icon: Clock,
                title: 'Zaman Tasarrufu',
                description: '20+ makalenin özünü 5 dakikada okuyun. Meşgul profesyoneller için mükemmel.',
                color: 'text-blue-500'
              },
              {
                icon: Shield,
                title: 'Güvenilir Kaynaklar',
                description: 'TechCrunch, The Verge, ArXiv ve diğer saygın teknoloji yayınlarından seçilen haberler.',
                color: 'text-green-500'
              },
              {
                icon: Zap,
                title: 'Anlık Teslimat',
                description: 'Taze içerik tercihinize göre günlük veya haftalık olarak gelen kutunuza teslim edilir.',
                color: 'text-yellow-500'
              },
              {
                icon: Mail,
                title: 'Güzel Tasarım',
                description: 'Her cihazda kolayca okunabilen temiz, mobil uyumlu e-postalar.',
                color: 'text-red-500'
              },
              {
                icon: Sparkles,
                title: 'Kişiselleştirilmiş',
                description: 'İlgi alanlarınızı seçin: Yapay Zeka, Yazılım, Donanım veya hepsini.',
                color: 'text-indigo-500'
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="card group hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-700 w-fit mb-4 ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Geliştiriciler Ne Diyor
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Chen',
                role: 'Kıdemli Geliştirici',
                content: 'TechNews teknoloji haberlerini okurken saatlerce zaman tasarrufu sağlıyor. AI özetleri çok isabetli!',
                avatar: '👩‍💻'
              },
              {
                name: 'Mark Rodriguez',
                role: 'CTO',
                content: 'AI trendlerini takip etmek için mükemmel. Günlük özet ekibimizi bilgili tutuyor.',
                avatar: '👨‍💼'
              },
              {
                name: 'Lisa Park',
                role: 'Ürün Müdürü',
                content: 'Temiz format, alakalı içerik. Sabah rutinimde ihtiyacım olan tam olarak bu.',
                avatar: '👩‍🚀'
              }
            ].map((testimonial, index) => (
              <div key={testimonial.name} className="card text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-3xl">{testimonial.avatar}</span>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="subscribe" className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Teknoloji Bilginizi Bir Üst Seviyeye Çıkarmaya Hazır mısınız?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Her gün daha akıllı hale gelen yüzlerce geliştiriciye katılın
          </p>
          <a
            href="#subscribe"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <Mail className="mr-2 h-5 w-5" />
İlk Özetinizi Alın
          </a>
        </div>
      </section>
    </div>
  )
} 