import { encryptSymmetricCtr } from 'src/api/encryption-service';
import sha256 from 'js-sha256';

export const calculatePasswordProof = (password: string): string => {
  // @ts-ignore
  return sha256(encryptSymmetricCtr('bittery.io', password));
};

export const isPasswordMatchingProof = (password: string, passwordProof: string): boolean => {
  // @ts-ignore
  return sha256(encryptSymmetricCtr('bittery.io', password)) === passwordProof;
}
