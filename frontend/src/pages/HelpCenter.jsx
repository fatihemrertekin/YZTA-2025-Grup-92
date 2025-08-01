import { useState } from 'react'
import { 
  Search, 
  MessageCircle, 
  FileText, 
  Mail, 
  Phone, 
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)

  const faqs = [
    {
      id: 1,
      question: "TechNews'e nasıl abone olabilirim?",
      answer: 'Ana sayfadaki abonelik formunu doldurarak kolayca abone olabilirsiniz. E-posta adresinizi girin, ilgi alanlarınızı seçin ve sıklığınızı belirleyin.'
    },
    {
      id: 2,
      question: 'Aboneliğimi nasıl iptal edebilirim?',
      answer: 'E-postalarımızın alt kısmındaki "Aboneliği İptal Et" bağlantısına tıklayarak veya abonelik yönetimi sayfasından aboneliğinizi iptal edebilirsiniz.'
    },
    {
      id: 3,
      question: 'Hangi kategorilerde haber alabilirim?',
      answer: 'Yapay Zeka, Yazılım ve Donanım kategorilerinde haber alabilirsiniz. İstediğiniz kategorileri seçebilir veya hepsini seçebilirsiniz.'
    },
    {
      id: 4,
      question: 'Ne sıklıkta e-posta alırım?',
      answer: 'Günlük veya haftalık olarak e-posta alabilirsiniz. Tercihinizi abonelik sırasında belirleyebilir ve daha sonra değiştirebilirsiniz.'
    },
    {
      id: 5,
      question: 'Haberler hangi kaynaklardan geliyor?',
      answer: 'TechCrunch, The Verge ve diğer güvenilir teknoloji yayınlarından haberler topluyoruz. Tüm haberler AI tarafından özetleniyor.'
    },
    {
      id: 6,
      question: 'E-posta almayı durdurdum, tekrar nasıl başlayabilirim?',
      answer: 'Ana sayfadan tekrar abone olabilir veya abonelik yönetimi sayfasından aboneliğinizi yeniden aktifleştirebilirsiniz.'
    }
  ]

  const contactMethods = [
    {
      icon: Mail,
      title: 'E-posta',
      description: 'support@technews.com',
      action: 'E-posta Gönder'
    },
    {
      icon: MessageCircle,
      title: 'Canlı Destek',
      description: '7/24 yardım',
      action: 'Sohbet Başlat'
    },
    {
      icon: Phone,
      title: 'Telefon',
      description: '+90 (212) 555-0123',
      action: 'Ara'
    }
  ]

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Yardım Merkezi
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            TechNews kullanımı hakkında sık sorulan sorular ve destek
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Yardım ara..."
              className="input pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <div key={index} className="card text-center">
              <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/20 w-fit mx-auto mb-4">
                <method.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {method.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {method.description}
              </p>
              <button className="btn-primary text-sm">
                {method.action}
              </button>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Sık Sorulan Sorular
          </h2>
          
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="card">
              <button
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </h3>
                {expandedFaq === faq.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {expandedFaq === faq.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Help */}
        <div className="mt-12 card">
          <div className="text-center">
            <FileText className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Daha fazla yardıma mı ihtiyacınız var?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Sorununuzu çözemediysek, ekibimizle iletişime geçin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                <Mail className="h-4 w-4 mr-2" />
                E-posta Gönder
              </button>
              <button className="btn-secondary">
                <MessageCircle className="h-4 w-4 mr-2" />
                Canlı Destek
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 