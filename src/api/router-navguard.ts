import { hasAccessToken } from 'src/api/session-service';
import { showNotificationError } from 'src/api/notificatios-api';

const URLS_FORBIDDEN_FOR_LOGGED_USERS: string[] = ['/login', '/register', '/password/reset', '/password/reset/confirm'];

export const setRouterNavguard = (router: any) => {
  router.beforeEach((to: any, from: any, next: any) => {
    const hasToken: boolean = hasAccessToken();
    if (URLS_FORBIDDEN_FOR_LOGGED_USERS.includes(to.path) && hasToken) {
      showNotificationError('Cannot go to url', 'Please logout first');
      next(false);
      router.go(-2);
    } else {
      next();
    }
  });
};
