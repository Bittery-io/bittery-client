import {
  hasAccessToken,
} from './session-service';
import { refreshAccessToken } from './refresh-access-token-service';
import { showNotificationError } from 'src/api/notificatios-api';

let VUE_ROUTER = undefined;
let LOADING: any = undefined;

export const setVueRouter = (router: any) => {
  VUE_ROUTER = router;
}

export const setLoading = (loadingPlugin: any) => {
  LOADING = loadingPlugin;
}

const urlsWhichHandle401: string[] = ['/api/user/login', '/api/user/password/reset'];

// @ts-ignore
const handleHttpError = (error, axios, recallFunction, url, payload, successCallback, errorCallback) => {
  if (error.response.status === 504 || error.response.status === 503 || error.response.status === 502) {
    showNotificationError('Request failed', 'Server maintenance, please try again later');
    LOADING.hide();
    VUE_ROUTER.push('/login');
  } else if (error.response.status === 500) {
    showNotificationError('Request failed', 'Unexpected server error');
    errorCallback(error);
  } else if (error.response.status === 401 && hasAccessToken() && !urlsWhichHandle401.includes(url)) {
    // eslint-disable-next-line no-use-before-define
    refreshJWTTokenAndRecallRequest(axios,
      recallFunction,
      url,
      payload,
      successCallback,
      errorCallback);
  } else if (error.response.status === 401 && !hasAccessToken() && !urlsWhichHandle401.includes(url)) {
    LOADING.hide();
    showNotificationError('User is not logged', 'Please sign in');
    VUE_ROUTER.push('/login');
  } else {
    console.log('Have error', error);
    errorCallback(error);
  }
};

// @ts-ignore
export const post = (axios, url, payload, successCallback, errorCallback) => {
  axios.post(url, payload)
    // @ts-ignore
    .then((response) => successCallback(response))
    // @ts-ignore
    .catch((error) => {
      handleHttpError(error,
        axios,
        post,
        url,
        payload,
        successCallback,
        errorCallback);
    });
};

// @ts-ignore
export const get = (axios, url, successCallback, errorCallback, headers?) => {
  axios.get(url, {
    headers: headers !== undefined ? headers : {},
  })
    .then((response: any) => successCallback(response))
    .catch((error: any) => handleHttpError(error,
      axios,
      get,
      url,
      undefined,
      successCallback,
      errorCallback));
};

// @ts-ignore
const refreshJWTTokenAndRecallRequest = (axios, recallFunction, url, payload, successCallback, errorCallback) => {
  refreshAccessToken(axios,
    () => {
      if (payload !== undefined) {
        recallFunction(axios, url, payload, successCallback, errorCallback);
      } else {
        recallFunction(axios, url, successCallback, errorCallback);
      }
    },
    (error: any) => {
      console.log('Refreshing user token failed! Push to /login');
      showNotificationError('User is not logged', 'Please sign in');
      VUE_ROUTER.push('/login');
    });
};
