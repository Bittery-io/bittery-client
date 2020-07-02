import { emitLoggedStatusChanged } from './login-event-service';
import { AccessTokenDto } from 'src/dto/access-token-dto';

const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';
const ACCESS_TOKEN_SAVE_DATE_KEY = 'ACCESS_TOKEN_SAVE_DATE';

export const cleanSessionInStorage = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_SAVE_DATE_KEY);
  emitLoggedStatusChanged();
};

export const setNewAccessTokenInStorage = (accessToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(ACCESS_TOKEN_SAVE_DATE_KEY, Date.now().toString());
  emitLoggedStatusChanged();
};

export const setSessionInStorage = (accessTokenDto: AccessTokenDto) => {
  cleanSessionInStorage();
  setNewAccessTokenInStorage(accessTokenDto.accessToken);
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const hasAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY) !== null;
