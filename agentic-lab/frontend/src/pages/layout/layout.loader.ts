import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { queryClient } from '~shared/queryClient';
import { pathKeys } from '~shared/router';
import { persistor, store } from '~shared/store';
import { sessionQueryOptions } from '~entities/session/session.api';
import { resetSession } from '~entities/session/session.model';

export default async function appLoader(args: LoaderFunctionArgs) {
  if (!persistor.getState().bootstrapped) {
    return args;
  }

  const token = store.getState()?.session?.token;
  if (!token) {
    return args;
  }

  try {
    await queryClient.prefetchQuery(sessionQueryOptions);
  } catch (error: any) {
    if (error?.response?.status === 401 ||
      error?.response?.status === 403 ||
      error?.response?.status === 404) {
      store.dispatch(resetSession());
      queryClient.clear();

      const publicPaths = [pathKeys.login, pathKeys.register, pathKeys.home];
      const currentPath = new URL(args.request.url).pathname;

      if (!publicPaths.some(path => currentPath.startsWith(path))) {
        return redirect(pathKeys.login);
      }
    }
  }

  return args;
}
