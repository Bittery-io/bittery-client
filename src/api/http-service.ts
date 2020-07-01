import {
  hasAccessToken,
} from './session-service';
import { refreshAccessToken } from './refresh-access-token-service';

// @ts-ignore
const handleHttpError = (error, axios, recallFunction, url, payload, successCallback, errorCallback) => {
  if (error.response.status === 401 && hasAccessToken()) {
    // eslint-disable-next-line no-use-before-define
    refreshJWTTokenAndRecallRequest(axios,
      recallFunction,
      url,
      payload,
      successCallback,
      errorCallback);
  } else {
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
      errorCallback(error);
    });
};
