import jwt from 'jsonwebtoken';

export const getPasswordProofFromJWT = (accessToken: string): string => {
  const jwtTokenDecoded = jwt.decode(accessToken);
  // @ts-ignore
  return jwtTokenDecoded.passwordProof;
}
