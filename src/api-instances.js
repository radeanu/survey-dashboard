import Vue from 'vue';
import axios from 'axios';
import router from './router';

const mainApi = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL
});

const socketHost = process.env.VUE_APP_SOCKET_HOST;

mainApi.interceptors.request.use(
  config => {
    const token = Vue.$cookies.get('token');

    if (token !== null) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  err => Promise.reject(err)
);

mainApi.interceptors.response.use(
  res => res,
  error => {
    if (!axios.isCancel(error)) {
      console.error(error);
    }

    if (error.response?.status === 401) {
      Vue.notify({
        group: 'warn',
        text: `⏳ Sesiune terminată!`,
        duration: 1500
      });

      router.push('/login');
    } else if (error.response?.status === 500) {
      Vue.notify({
        group: 'error',
        text: `🤷 Eroare!`
      });
    }

    return Promise.reject(error);
  }
);

export { mainApi, socketHost };
