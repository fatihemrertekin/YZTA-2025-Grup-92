import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './contexts/ThemeContext'
import { Layout } from './components/Layout'

// Pages
import { LandingPage } from './pages/LandingPage'
import { NewsletterArchive } from './pages/NewsletterArchive'
import { SubscriptionManagement } from './pages/SubscriptionManagement'
import { AdminPanel } from './pages/AdminPanel'
import { EmailPreview } from './pages/EmailPreview'
import { HelpCenter } from './pages/HelpCenter'
import { Contact } from './pages/Contact'
import { Privacy } from './pages/Privacy'
import { About } from './pages/About'
import { Blog } from './pages/Blog'
import { Careers } from './pages/Careers'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Routes>
            {/* Public Routes - Kullanıcı sayfaları */}
            <Route path="/" element={<Layout><LandingPage /></Layout>} />
            <Route path="/archive" element={<Layout><NewsletterArchive /></Layout>} />
            <Route path="/subscription" element={<Layout><SubscriptionManagement /></Layout>} />
            <Route path="/preview/:type?" element={<Layout><EmailPreview /></Layout>} />
            <Route path="/help" element={<Layout><HelpCenter /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/blog" element={<Layout><Blog /></Layout>} />
            <Route path="/careers" element={<Layout><Careers /></Layout>} />
            
            {/* Admin Routes - Geliştirici erişimi */}
            <Route path="/admin" element={<Layout><AdminPanel /></Layout>} />
          </Routes>
          
          {/* Global Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
              },
            }}
          />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
