import { emitLoggedStatusChanged } from './login-event-service';
import { AccessTokenDto } from 'src/dto/access-token-dto';
import { getPasswordProofFromJWT } from 'src/api/access-token-service';

const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';
const PASSWORD_PROOF_KEY = 'PASSWORD_PROOF';
const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN';
const ACCESS_TOKEN_SAVE_DATE_KEY = 'ACCESS_TOKEN_SAVE_DATE';

export const cleanSessionInStorage = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_SAVE_DATE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  emitLoggedStatusChanged();
};

export const setNewAccessTokenInStorage = (accessToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(ACCESS_TOKEN_SAVE_DATE_KEY, Date.now().toString());
  localStorage.setItem(PASSWORD_PROOF_KEY, getPasswordProofFromJWT(accessToken));
  emitLoggedStatusChanged();
};

export const setNetRefreshTokenInStorage = (refreshToken: string) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const setSessionInStorage = (accessTokenDto: AccessTokenDto) => {
  cleanSessionInStorage();
  setNewAccessTokenInStorage(accessTokenDto.accessToken);
  setNetRefreshTokenInStorage(accessTokenDto.refreshToken);
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getPasswordProof = () => localStorage.getItem(PASSWORD_PROOF_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const hasPasswordProofSet = () => localStorage.getItem(PASSWORD_PROOF_KEY) !== null && localStorage.getItem(PASSWORD_PROOF_KEY) !== '';
export const hasAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY) !== null;

export const setPasswordProof = (passwordProof: string) =>   localStorage.setItem(PASSWORD_PROOF_KEY, passwordProof);
