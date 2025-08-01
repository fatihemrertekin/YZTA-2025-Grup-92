import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { 
  ArrowRight, 
  Sparkles, 
  Mail, 
  Zap, 
  Brain, 
  BookOpen, 
  Users, 
  Star,
  TrendingUp,
  Lightbulb,
  GraduationCap,
  Target,
  Clock,
  CheckCircle
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
                <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300 rounded-full">
                  🎓 Eğitim Odaklı
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Teknoloji Dünyasını
                <span className="text-gradient block">Öğrenin ve Takip Edin</span>
                Tek Platformda
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Sadece haber değil, <strong>eğitici içerikler</strong> de sunuyoruz. TechCrunch, The Verge ve diğer kaynaklardan 
                seçilen haberleri <strong>AI destekli analizler</strong> ile zenginleştiriyor, 
                <strong>Yapay Zeka, Yazılım ve Donanım</strong> alanlarında bilginizi artırıyoruz.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/#/archive"
                  className="btn-primary px-8 py-4 text-lg group"
                >
                  Ücretsiz Başla
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="/#/preview"
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
                  <div className="text-sm text-gray-600 dark:text-gray-400">Öğrenen Kullanıcı</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">Günlük</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Eğitim İçeriği</div>
                </div>
              </div>
            </div>

            {/* Subscription Form */}
            <div className="lg:ml-8">
              <div className="card p-8 animate-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center space-x-2 mb-6">
                  <Sparkles className="h-6 w-6 text-primary-500" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Şimdi Başlayın
                  </h2>
                </div>

                <form onSubmit={handleSubmit(onSubscribe)} className="space-y-6">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="label">
                      E-posta Adresiniz
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
                    <label className="label">
                      İlgilendiğiniz Alanlar
                    </label>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label key={category} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            value={category}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            {...register('selected_categories', {
                              required: 'En az bir kategori seçmelisiniz'
                            })}
                          />
                          <span className="text-gray-700 dark:text-gray-300">{category}</span>
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
                    <label className="label">
                      Bülten Sıklığı
                    </label>
                    <select
                      className="input"
                      {...register('frequency', { required: 'Sıklık seçmelisiniz' })}
                    >
                      <option value="">Sıklık seçin</option>
                      {frequencies.map((frequency) => (
                        <option key={frequency} value={frequency}>
                          {frequencyLabels[frequency]} özet
                        </option>
                      ))}
                    </select>
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
                        Gönderiliyor...
                      </div>
                    ) : (
                      <>
                        <Mail className="mr-2 h-5 w-5" />
                        Ücretsiz Abone Ol
                      </>
                    )}
                  </button>
                </form>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                  Spam yok, sadece değerli içerik. İstediğiniz zaman aboneliğinizi iptal edebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Neden TechNews?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Sadece haber değil, teknoloji dünyasını anlamamı sağlayan eğitici platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20 w-fit mx-auto mb-4">
                <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                AI Destekli Analiz
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Gemini AI ile haberlerin arkasındaki teknolojiyi anlayın. Karmaşık konular basit açıklamalarla.
              </p>
            </div>

            <div className="card text-center">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20 w-fit mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Eğitici İçerik
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sadece ne olduğunu değil, nasıl çalıştığını da öğrenin. Teknoloji kavramları açıklanıyor.
              </p>
            </div>

            <div className="card text-center">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20 w-fit mx-auto mb-4">
                <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Kişiselleştirilmiş Öğrenme
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                İlgi alanlarınıza göre özelleştirilmiş içerik. Kendi hızınızda öğrenin.
              </p>
            </div>

            <div className="card text-center">
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 w-fit mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Trend Analizi
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Hangi teknolojilerin yükseldiğini, hangilerinin düştüğünü takip edin.
              </p>
            </div>

            <div className="card text-center">
              <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 w-fit mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Pratik Uygulamalar
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Öğrendiğiniz teknolojilerin gerçek hayatta nasıl kullanıldığını görün.
              </p>
            </div>

            <div className="card text-center">
              <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 w-fit mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Sürekli Gelişim
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Teknoloji dünyasındaki değişimleri takip ederek kariyerinizi geliştirin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Öğrenme Yolculuğunuz
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Teknoloji dünyasını adım adım keşfedin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card text-center">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                1. Temel Kavramlar
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                AI, ML, blockchain gibi temel teknoloji kavramlarını öğrenin
              </p>
            </div>

            <div className="card text-center">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                2. Trend Analizi
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Hangi teknolojilerin geleceği şekillendirdiğini anlayın
              </p>
            </div>

            <div className="card text-center">
              <div className="text-3xl mb-4">💡</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                3. Pratik Uygulamalar
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Teknolojilerin gerçek hayatta nasıl kullanıldığını görün
              </p>
            </div>

            <div className="card text-center">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                4. Gelecek Vizyonu
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Teknoloji dünyasının geleceğini tahmin edin
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Kullanıcılarımız Ne Diyor?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Teknoloji dünyasını anlamamı sağladı
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Ahmet Yılmaz",
                role: "Yazılım Geliştirici",
                avatar: "👨‍💻",
                content: "TechNews sayesinde AI konusunda çok şey öğrendim. Haberlerin arkasındaki teknolojiyi anlamak harika."
              },
              {
                name: "Zeynep Kaya",
                role: "Ürün Yöneticisi",
                avatar: "👩‍💼",
                content: "Sadece haber değil, eğitici içerikler de var. Teknoloji trendlerini takip etmek artık çok kolay."
              },
              {
                name: "Mehmet Demir",
                role: "Öğrenci",
                avatar: "🎓",
                content: "Karmaşık teknoloji konularını basit şekilde açıklıyorlar. Öğrenme sürecim çok hızlandı."
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
            Her gün daha akıllı hale gelen yüzlerce öğrenciye katılın
          </p>
          <a
            href="/#/subscription"
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