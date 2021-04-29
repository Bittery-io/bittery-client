import { cleanSessionInStorage, setNewAccessTokenInStorage } from './session-service';

export const refreshAccessToken = (axios: any, refreshToken: string, successCallback: Function, errorCallback: Function) => {
  console.log('dupa dupa nie ma trupa');
  axios.post('/api/user/refreshToken', { refreshToken }).then((response: any) => {
    console.log(response);
    const newAccessToken = response.data.accessToken;
    setNewAccessTokenInStorage(newAccessToken);
    console.log('Refreshed access token.');
    successCallback();
  }, (error: any) => {
    console.log('Ups! Failed to refresh access token. Cleaning current access token in storage.', error);
    cleanSessionInStorage();
    errorCallback(error);
  });
};
