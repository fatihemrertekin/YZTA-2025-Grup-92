// API Base URL - Backend'den gelecek
const API_BASE_URL = 'http://localhost:8000'

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }
      
      return await response.text()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // GET request
  get(endpoint, params = {}) {
    const searchParams = new URLSearchParams(params)
    const url = searchParams.toString() ? `${endpoint}?${searchParams}` : endpoint
    
    return this.request(url, {
      method: 'GET',
    })
  }

  // POST request
  post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // PUT request
  put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // DELETE request
  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    })
  }
}

// Create API client instance
const api = new ApiClient()

// Backend API Endpoints
export const apiEndpoints = {
  // Health & Status
  health: () => api.get('/health'),
  adminStatus: () => api.get('/api/v1/admin/status'),

  // Users
  findUser: (email) => api.get(`/api/v1/users/find/${email}`),
  subscribeUser: (userData) => api.post('/api/v1/users/subscribe', userData),
  updateUser: (userId, userData) => api.put(`/api/v1/users/${userId}`, userData),
  unsubscribeUser: (userId) => api.delete(`/api/v1/users/${userId}`),
  getUserStats: () => api.get('/api/v1/users/stats'),

  // Articles
  getArticles: (params = {}) => api.get('/api/v1/articles/', params),
  getArticleStats: () => api.get('/api/v1/articles/stats'),
  getCategories: () => api.get('/api/v1/articles/categories'),
  getSummary: (params = {}) => api.get('/api/v1/articles/summary', params),
  triggerCrawl: () => api.post('/api/v1/articles/crawl'),

  // Admin
  testAI: (data) => api.post('/api/v1/admin/ai/test', data),
  getSystemLogs: () => api.get('/api/v1/admin/logs'),
  getSystemHealth: () => api.get('/api/v1/admin/health'),
}

export default api 