
import axios, { isAxiosError } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api', // Remplace par l'URL de ton API Express
  withCredentials: true, // Important si tu gères des sessions/cookies pour l'authentification
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
export { isAxiosError };