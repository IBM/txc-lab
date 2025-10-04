import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider as ReduxProvider } from 'react-redux';
import { attachAuthInterceptor } from '~shared/api/api.instance';
import { queryClient } from '~shared/queryClient';
import { persistor, store } from '~shared/store';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { BootstrappedRouter } from './browser-router';
import { loginUser } from '~shared/api/api.service';
import { transformUserDtoToUser } from '~entities/session/session.lib';
import { setSession } from '~entities/session/session.model';

export default function App() {
  // Ensure the auth interceptor is attached after the store is rehydrated
  useEffect(() => {
    // Attach the auth interceptor immediately if the store is already bootstrapped
    if (persistor.getState().bootstrapped) {
      attachAuthInterceptor(() => store.getState().session?.token);
    } else {
      // Otherwise wait for it to be bootstrapped
      const unsubscribe = persistor.subscribe(() => {
        if (persistor.getState().bootstrapped) {
          attachAuthInterceptor(() => store.getState().session?.token);
          unsubscribe();
        }
      });
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    const checkAutoLogin = async () => {
      if (store.getState()?.session?.token) {
        return;
      }

      try {
        const response = await fetch('/auto-login.json');
        const config = await response.json();

        if (config.autoLogin && config.email && config.password) {
          const { data } = await loginUser({
            user: {
              email: config.email,
              password: config.password,
            },
          });
          const user = transformUserDtoToUser(data);
          store.dispatch(setSession(user));

          await fetch('/auto-login.json', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ autoLogin: false, email: '', password: '' }),
          }).catch(() => {
          });
        }
      } catch (error) {
        console.debug('Auto-login not configured or failed:', error);
      }
    };

    checkAutoLogin();
  }, []);
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <BootstrappedRouter />
          {/* <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" /> */}
        </QueryClientProvider>
      </ReduxProvider>
    </ErrorBoundary>
  );
}
