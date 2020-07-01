import { hasAccessToken, isLogged } from './session-service';
import { refreshAccessToken } from './refresh-access-token-service';

const checkIfUserIsLoggedAndProceed = (axios: any, to: any, next: any) => {
  const userIsLogged = isLogged();
  if (!userIsLogged && hasAccessToken()) {
    refreshAccessToken(axios,
      () => {
        next();
      }, () => {
        next('/login');
      });
  } else if (!userIsLogged && !hasAccessToken()) {
    next('/login');
  } else {
    next();
  }
};

export const checkIfIsLogged = (axios: any, route: any, router: any) => {
  const userIsLogged = isLogged();
  if (!userIsLogged && hasAccessToken()) {
    refreshAccessToken(axios,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {}, () => {
        router.push('/login');
      });
  } else if (!userIsLogged && !hasAccessToken()) {
    router.push('/login');
  }
};

export const checkSessionOnChangingRoute = (router: any, axios: any) => {
  router.beforeEach((to: any, from: any, next: any) => {
    if (to.fullPath === '/login' || to.fullPath === '/register') {
      next();
    } else {
      checkIfUserIsLoggedAndProceed(axios, to, next);
    }
    next();
  });
};
