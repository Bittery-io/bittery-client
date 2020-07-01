import { getAccessToken } from './session-service';

export const registerHttpInterceptor = (axios: any) => {
  axios.interceptors.request.use((config: any) => {
    // Do something before request is sent
    config.headers.Authorization = `Bearer ${getAccessToken()}`;
    return config;
  });
};
