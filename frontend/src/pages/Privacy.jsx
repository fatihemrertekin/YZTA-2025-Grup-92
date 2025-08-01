import { Shield, Eye, Lock, Database, Users, Calendar } from 'lucide-react'

export function Privacy() {
  const lastUpdated = '31 Temmuz 2025'

  const privacySections = [
    {
      icon: Database,
      title: 'Topladığımız Veriler',
      content: [
        'E-posta adresiniz (abonelik için)',
        'İlgi alanlarınız (kategori tercihleri)',
        'E-posta açılma ve tıklama verileri',
        'Cihaz bilgileri (tarayıcı, işletim sistemi)',
        'Kullanım istatistikleri (sayfa görüntüleme, süre)'
      ]
    },
    {
      icon: Eye,
      title: 'Verilerinizi Nasıl Kullanıyoruz',
      content: [
        'Kişiselleştirilmiş haber özetleri göndermek',
        'Hizmet kalitesini iyileştirmek',
        'Yeni özellikler geliştirmek',
        'Güvenlik ve spam koruması sağlamak',
        'Yasal yükümlülükleri yerine getirmek'
      ]
    },
    {
      icon: Lock,
      title: 'Veri Güvenliği',
      content: [
        'SSL/TLS şifreleme ile güvenli veri aktarımı',
        'Veritabanı erişim kontrolü ve şifreleme',
        'Düzenli güvenlik denetimleri',
        'Çalışan eğitimi ve erişim kontrolü',
        'Veri ihlali durumunda hızlı müdahale planı'
      ]
    },
    {
      icon: Users,
      title: 'Veri Paylaşımı',
      content: [
        'Üçüncü taraf hizmet sağlayıcıları (e-posta gönderimi)',
        'Yasal zorunluluk durumunda yetkili makamlar',
        'İş ortakları (sadece açık rızanızla)',
        'Verilerinizi satmıyor veya kiralanmıyoruz',
        'Tüm paylaşımlar gizlilik sözleşmesi ile korunur'
      ]
    },
    {
      icon: Calendar,
      title: 'Veri Saklama',
      content: [
        'Aktif abonelik süresince verileriniz saklanır',
        'Abonelik iptali sonrası 30 gün içinde silinir',
        'Yasal yükümlülükler için gerekli veriler saklanır',
        'Anonim istatistikler kalıcı olarak saklanabilir',
        'Veri silme talepleriniz 30 gün içinde işlenir'
      ]
    }
  ]

  const yourRights = [
    'Verilerinize erişim hakkı',
    'Verilerinizi düzeltme hakkı',
    'Verilerinizi silme hakkı',
    'İşlemeye itiraz hakkı',
    'Veri taşınabilirliği hakkı',
    'Kısıtlama hakkı'
  ]

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Gizlilik Politikası
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Verilerinizin güvenliği bizim için önemli
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Son güncelleme: {lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Giriş
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            TechNews olarak, kullanıcılarımızın gizliliğini korumayı taahhüt ediyoruz. 
            Bu gizlilik politikası, hangi bilgileri topladığımızı, nasıl kullandığımızı 
            ve koruduğumuzu açıklar.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Bu hizmeti kullanarak, bu gizlilik politikasının şartlarını kabul etmiş olursunuz.
          </p>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-8">
          {privacySections.map((section, index) => (
            <div key={index} className="card">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/20 mr-4">
                  <section.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h3>
              </div>
              <ul className="space-y-2">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
                    <span className="text-gray-600 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Your Rights */}
        <div className="card mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Haklarınız
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            KVKK (Kişisel Verilerin Korunması Kanunu) kapsamında aşağıdaki haklara sahipsiniz:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {yourRights.map((right, index) => (
              <div key={index} className="flex items-center">
                <Lock className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">{right}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cookies */}
        <div className="card mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Çerezler (Cookies)
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Web sitemizde deneyiminizi iyileştirmek için çerezler kullanıyoruz:
          </p>
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Gerekli Çerezler</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Hizmetin temel işlevleri için gereklidir ve devre dışı bırakılamaz.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Analitik Çerezler</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Site kullanımını analiz etmek ve iyileştirmek için kullanılır.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Kişiselleştirme Çerezleri</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Size özel içerik ve reklamlar göstermek için kullanılır.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="card mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            İletişim
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Gizlilik politikamız hakkında sorularınız varsa, bizimle iletişime geçin:
          </p>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-300">
              <strong>E-posta:</strong> privacy@technews.com
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Adres:</strong> İstanbul, Türkiye
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Telefon:</strong> +90 (212) 555-0123
            </p>
          </div>
        </div>

        {/* Updates */}
        <div className="card mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Politika Güncellemeleri
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler 
            olduğunda size e-posta ile bilgilendireceğiz. Politikamızın güncel versiyonu 
            her zaman bu sayfada mevcut olacaktır.
          </p>
        </div>
      </div>
    </div>
  )
} 