import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Mail, Settings, Trash2, CheckCircle, AlertCircle } from 'lucide-react'
import { apiEndpoints } from '../utils/api'

export function SubscriptionManagement() {
  const [step, setStep] = useState('find') // find, manage, unsubscribe
  const [userEmail, setUserEmail] = useState('')
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedFrequency, setSelectedFrequency] = useState('')
  
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      selected_categories: [],
      frequency: ''
    }
  })

  const findUser = async (data) => {
    setLoading(true)
    try {
      const response = await apiEndpoints.findUser(data.email)
      
      // Backend'den gelen frequency değerini Türkçe'ye çevir
      const userDataWithTurkishFrequency = {
        ...response.user,
        frequency: frequencyMap[response.user.frequency] || response.user.frequency
      }
      
      setUserEmail(data.email)
      setUserData(userDataWithTurkishFrequency)
      
      // Form değerlerini ve state'leri ayarla
      setValue('selected_categories', userDataWithTurkishFrequency.selected_categories)
      setValue('frequency', userDataWithTurkishFrequency.frequency)
      setSelectedCategories(userDataWithTurkishFrequency.selected_categories)
      setSelectedFrequency(userDataWithTurkishFrequency.frequency)
      
      setStep('manage')
      toast.success('Abonelik bulundu!')
    } catch (error) {
      console.error('Kullanıcı bulma hatası:', error)
      toast.error(error.message || 'Abonelik bulunamadı')
    } finally {
      setLoading(false)
    }
  }

  const updatePreferences = async (data) => {
    setLoading(true)
    try {
      console.log('Form data received:', data)
      
      // Form verilerini al
      const categoriesToUpdate = selectedCategories.length > 0 ? selectedCategories : userData.selected_categories
      const frequencyToUpdate = selectedFrequency || userData.frequency
      
      console.log('Selected categories from form:', categoriesToUpdate)
      console.log('Frequency from form:', frequencyToUpdate)
      
      // Form verilerini backend formatına çevir
      const updateData = {
        selected_categories: categoriesToUpdate,
        frequency: frequencyMap[frequencyToUpdate] || userData.frequency
      }
      
      console.log('Update data being sent:', updateData)
      
      await apiEndpoints.updateUser(userData.id, updateData)
      
      // Güncellenmiş kullanıcı verilerini al
      const response = await apiEndpoints.findUser(userData.email)
      
      // Backend'den gelen frequency değerini Türkçe'ye çevir
      const userDataWithTurkishFrequency = {
        ...response.user,
        frequency: frequencyMap[response.user.frequency] || response.user.frequency
      }
      
      setUserData(userDataWithTurkishFrequency)
      
      // Form değerlerini ve state'leri güncelle
      setValue('selected_categories', userDataWithTurkishFrequency.selected_categories)
      setValue('frequency', userDataWithTurkishFrequency.frequency)
      setSelectedCategories(userDataWithTurkishFrequency.selected_categories)
      setSelectedFrequency(userDataWithTurkishFrequency.frequency)
      
      toast.success('Tercihler başarıyla güncellendi!')
    } catch (error) {
      console.error('Tercih güncelleme hatası:', error)
      toast.error(error.message || 'Tercihler güncellenemedi')
    } finally {
      setLoading(false)
    }
  }

  const unsubscribe = async () => {
    setLoading(true)
    try {
      console.log('Unsubscribe called with userData:', userData)
      
      // userData.id'nin integer olduğundan emin ol
      const userId = parseInt(userData.id, 10)
      if (isNaN(userId)) {
        throw new Error('Geçersiz kullanıcı ID')
      }
      
      console.log('Abonelik iptal ediliyor, user ID:', userId)
      await apiEndpoints.unsubscribeUser(userId)
      setStep('unsubscribe')
      toast.success('Abonelik başarıyla iptal edildi')
    } catch (error) {
      console.error('Abonelik iptal hatası:', error)
      toast.error(error.message || 'Abonelik iptal edilemedi')
    } finally {
      setLoading(false)
    }
  }

  const categories = ['Yapay Zeka', 'Yazılım', 'Donanım']
  const frequencies = ['günlük', 'haftalık']
  
  // Frequency mapping
  const frequencyMap = {
    'günlük': 'daily',
    'haftalık': 'weekly',
    'daily': 'günlük',
    'weekly': 'haftalık'
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Abonelik Yönetimi
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Tercihlerinizi güncelleyin veya aboneliğinizi iptal edin
          </p>
        </div>

        {step === 'find' && (
          <div className="card max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/20 w-fit mx-auto mb-4">
                <Mail className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Aboneliğinizi Bulun
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Bülten tercihlerinizi yönetmek için e-posta adresinizi girin
              </p>
            </div>

            <form onSubmit={handleSubmit(findUser)} className="space-y-4">
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

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Bululyor...
                  </div>
                ) : (
                  'Abonelik Bul'
                )}
              </button>
            </form>
          </div>
        )}

        {step === 'manage' && userData && (
          <div className="space-y-8">
            {/* Current Status */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                  Aktif Abonelik
                </h2>
                <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded-full">
                  Aktif
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">E-posta</dt>
                  <dd className="text-lg text-gray-900 dark:text-white">{userData.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Abone Olma Tarihi</dt>
                  <dd className="text-lg text-gray-900 dark:text-white">
                    {new Date(userData.subscribed_at).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Mevcut Sıklık</dt>
                  <dd className="text-lg text-gray-900 dark:text-white capitalize">{userData.frequency}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Kategoriler</dt>
                  <dd className="text-lg text-gray-900 dark:text-white">
                    {userData.selected_categories.join(', ')}
                  </dd>
                </div>
              </div>
            </div>

            {/* Update Preferences */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Tercihleri Güncelle
              </h3>

              <form onSubmit={handleSubmit(updatePreferences)} className="space-y-6">
                                 {/* Categories */}
                 <div>
                   <label className="label">İlgi Alanları</label>
                   <div className="grid grid-cols-3 gap-2">
                     {categories.map((category) => (
                       <label key={category} className="flex items-center space-x-2 cursor-pointer">
                         <input
                           type="checkbox"
                           value={category}
                           checked={selectedCategories.includes(category)}
                           onChange={(e) => {
                             if (e.target.checked) {
                               const newCategories = [...selectedCategories, category]
                               setSelectedCategories(newCategories)
                               setValue('selected_categories', newCategories)
                             } else {
                               const newCategories = selectedCategories.filter(c => c !== category)
                               setSelectedCategories(newCategories)
                               setValue('selected_categories', newCategories)
                             }
                           }}
                           className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                         />
                         <span className="text-sm text-gray-700 dark:text-gray-300">
                           {category}
                         </span>
                       </label>
                     ))}
                   </div>
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
                           checked={selectedFrequency === freq}
                           onChange={(e) => {
                             setSelectedFrequency(e.target.value)
                             setValue('frequency', e.target.value)
                           }}
                           className="border-gray-300 text-primary-600 focus:ring-primary-500"
                         />
                         <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                           {freq}
                         </span>
                       </label>
                     ))}
                   </div>
                 </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1 py-3 disabled:opacity-50"
                  >
                    {loading ? 'Güncelleniyor...' : 'Tercihleri Güncelle'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setStep('find')}
                    className="btn-ghost px-6 py-3"
                  >
                    Geri
                  </button>
                </div>
              </form>
            </div>

            {/* Danger Zone */}
            <div className="card border-red-200 dark:border-red-800">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Tehlikeli Bölge
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Aboneliğinizi iptal ettiginizde bültenimizi almayı durdurursunuz. Daha sonra her zaman tekrar abone olabilirsiniz.
              </p>
              <button
                onClick={unsubscribe}
                disabled={loading}
                className="btn bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:opacity-50 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {loading ? 'Abonelik İptal Ediliyor...' : 'Aboneliği İptal Et'}
              </button>
            </div>
          </div>
        )}

        {step === 'unsubscribe' && (
          <div className="card max-w-md mx-auto text-center">
            <div className="text-6xl mb-6">👋</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Aboneliğiniz İptal Edildi
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Sizi görmediğimiz için üzgünüz! Bültenimizden başarıyla çıkarıldınız.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => {
                  setStep('find')
                  setUserData(null)
                  setUserEmail('')
                  reset()
                }}
                className="btn-primary w-full"
              >
                Tekrar Abone Ol
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="btn-ghost w-full"
              >
                Ana Sayfaya Dön
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 