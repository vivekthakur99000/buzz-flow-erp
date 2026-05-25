import axios, {type AxiosInstance, AxiosError, type InternalAxiosRequestConfig} from "axios";

const api : AxiosInstance = axios.create({
    baseURL : "http://localhost:5000/api",
     headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config : InternalAxiosRequestConfig) : InternalAxiosRequestConfig => {
    const token = localStorage.getItem("token");

        if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;

},
(error: AxiosError): Promise<never> => {
    return Promise.reject(error);
  }
)

export default api;