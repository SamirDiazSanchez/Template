import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { useRouter } from "next/navigation";

export const useAxios = () => {
  const {
    push
  } = useRouter();

  let isRefreshing = false;

  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true
  });

  const refresh = async () => {
    try {
      await instance.get(`authentication/refresh`);
      isRefreshing = false;
    } catch (error) {
      push('/logout');
      return Promise.reject(error);
    }
  };

  const handleResponse = (response: AxiosResponse) => response;

  const handleError = async (error: any) => {
    const originalRequest = error.config;
    if (error.response?.status == 401 && !isRefreshing && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        isRefreshing = true;
        await refresh();

        return instance(originalRequest);
      } catch (ex) {
        isRefreshing = false;
        return Promise.reject(ex);
      }
    }
    else {
      isRefreshing = false;
      return Promise.reject(error);
    }
  }

  const handleRequest = async (request: InternalAxiosRequestConfig) => request;

  instance.interceptors.request.use(handleRequest);

  instance.interceptors.response.use(
    (response: AxiosResponse) => handleResponse(response),
    error => handleError(error) 
  )

  return {
    instance
  }
}