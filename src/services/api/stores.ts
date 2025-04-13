import { apiClient } from './auth'

interface StoreData {
  name: string
  address: string
  phone: string
}

export const registerStore = async (storeData: StoreData) => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('No access token available')
  }

  try {
    const response = await apiClient.post('/stores/register', storeData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error registering store:', error)
    throw error
  }
}