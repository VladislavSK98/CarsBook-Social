
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // или каквото ползваш
});

// Добавя токен автоматично към всички заявки
apiClient.interceptors.request.use((config) => {
  const authData = JSON.parse(localStorage.getItem('auth'));

  if (authData?.accessToken) {
    config.headers.Authorization = `Bearer ${authData.accessToken}`;
  }

  return config;
});

export default apiClient;
