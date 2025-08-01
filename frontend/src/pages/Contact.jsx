import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle,
  Send,
  CheckCircle
} from 'lucide-react'

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const contactInfo = [
    {
      icon: Mail,
      title: 'E-posta',
      value: 'info@technews.com',
      description: 'Genel sorular için'
    },
    {
      icon: Phone,
      title: 'Telefon',
      value: '+90 (212) 555-0123',
      description: 'Pazartesi - Cuma, 9:00 - 18:00'
    },
    {
      icon: MapPin,
      title: 'Adres',
      value: 'İstanbul, Türkiye',
      description: 'Merkez ofis'
    },
    {
      icon: Clock,
      title: 'Çalışma Saatleri',
      value: 'Pazartesi - Cuma',
      description: '9:00 - 18:00 (GMT+3)'
    }
  ]

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.')
      reset()
    } catch (error) {
      toast.error('Mesaj gönderilemedi. Lütfen tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            İletişim
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Sorularınız mı var? Bizimle iletişime geçin
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="card">
            <div className="flex items-center mb-6">
              <MessageCircle className="h-6 w-6 text-primary-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Mesaj Gönder
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="label">
                    Ad
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="input"
                    placeholder="Adınız"
                    {...register('firstName', { required: 'Ad gereklidir' })}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="label">
                    Soyad
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="input"
                    placeholder="Soyadınız"
                    {...register('lastName', { required: 'Soyad gereklidir' })}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="label">
                  E-posta
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

              <div>
                <label htmlFor="subject" className="label">
                  Konu
                </label>
                <select
                  id="subject"
                  className="input"
                  {...register('subject', { required: 'Konu seçin' })}
                >
                  <option value="">Konu seçin</option>
                  <option value="general">Genel Soru</option>
                  <option value="technical">Teknik Destek</option>
                  <option value="subscription">Abonelik</option>
                  <option value="feedback">Geri Bildirim</option>
                  <option value="partnership">İş Ortaklığı</option>
                </select>
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="label">
                  Mesaj
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="input resize-none"
                  placeholder="Mesajınızı buraya yazın..."
                  {...register('message', { 
                    required: 'Mesaj gereklidir',
                    minLength: {
                      value: 10,
                      message: 'Mesaj en az 10 karakter olmalıdır'
                    }
                  })}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Gönderiliyor...
                  </div>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Mesaj Gönder
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                İletişim Bilgileri
              </h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/20">
                      <info.icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {info.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {info.value}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {info.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Hızlı Eylemler
              </h3>
              <div className="space-y-3">
                <button className="w-full btn-secondary text-left">
                  <Mail className="h-4 w-4 mr-2" />
                  Yardım Merkezi
                </button>
                <button className="w-full btn-secondary text-left">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Canlı Destek
                </button>
                <button className="w-full btn-secondary text-left">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Durum Sayfası
                </button>
              </div>
            </div>

            {/* FAQ Preview */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Sık Sorulan Sorular
              </h3>
              <div className="space-y-3">
                <a href="/help" className="block text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                  TechNews'e nasıl abone olabilirim?
                </a>
                <a href="/help" className="block text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                  Aboneliğimi nasıl iptal edebilirim?
                </a>
                <a href="/help" className="block text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                  Hangi kategorilerde haber alabilirim?
                </a>
              </div>
              <div className="mt-4">
                <a href="/help" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
                  Tüm SSS'leri görüntüle →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 