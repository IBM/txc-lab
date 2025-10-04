import axios, { AxiosError } from 'axios';
import { ApiErrorDataDtoSchema } from './api.contracts';
import { normalizeValidationErrors } from './api.lib';
import { store } from '~shared/store';
import { resetSession } from '~entities/session/session.model';

export const api = axios.create({ baseURL: __API_URL__ });

// Keep track of whether the interceptor has been attached
let isAuthInterceptorAttached = false;

export function attachAuthInterceptor(getAuthToken: () => string | undefined) {
  // Only attach the interceptor once
  if (isAuthInterceptorAttached) {
    return;
  }

  const getTokenWithFallback = () => {
    const token = getAuthToken();
    if (token) {
      return token;
    }

    try {
      const persistedState = localStorage.getItem('persist:root');
      if (persistedState) {
        const { session } = JSON.parse(persistedState);
        if (session) {
          const sessionData = JSON.parse(session);
          return sessionData?.token;
        }
      }
    } catch (e) {
      console.error('Error getting token from localStorage:', e);
    }

    return undefined;
  };

  api.interceptors.request.use(
    (config) => {
      const token = getTokenWithFallback();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  isAuthInterceptorAttached = true;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 ||
      (error.response?.status === 403 && error.config?.url?.includes('/user')) ||
      (error.response?.status === 404 && error.config?.url === '/user') ||
      (error.response?.status === 404 && error.config?.url?.includes('/profiles/'))) {
      if (store.getState()?.session?.token) {
        store.dispatch(resetSession());
        const publicPaths = ['/login', '/register', '/'];
        const currentPath = window.location.pathname;

        if (!publicPaths.some(path => currentPath.startsWith(path)) && currentPath !== '/') {
          window.location.href = '/login/';
        }
      }
    }

    const validation = ApiErrorDataDtoSchema.safeParse(error.response?.data);

    if (!validation.success) {
      return Promise.reject(error);
    }

    const normalizedErrorResponse = {
      ...error.response!,
      data: normalizeValidationErrors(validation.data),
    };

    return Promise.reject(
      new AxiosError(error.message, error.code, error.config, error.request, normalizedErrorResponse),
    );
  },
);
