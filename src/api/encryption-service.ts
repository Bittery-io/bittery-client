const aesjs = require('aes-js');
const jssha256 = require('js-sha256');

export const encryptSymmetricCtr = (payloadUtf8: string, key: string): string => {
  key = jssha256.sha256.arrayBuffer(key);
  const payloadBytes = aesjs.utils.utf8.toBytes(payloadUtf8);
  const paddedPayloadBytex = aesjs.padding.pkcs7.pad(payloadBytes);
  const aesCtr = new aesjs.ModeOfOperation.ctr(Buffer.from(key));
  const encryptedBytes = aesCtr.encrypt(paddedPayloadBytex);
  return aesjs.utils.hex.fromBytes(encryptedBytes);
};

export const decryptSymmetricCtr = (encryptedPayloadHex: string, key: string): string => {
  key = jssha256.sha256.arrayBuffer(key);
  const encryptedBytes = aesjs.utils.hex.toBytes(encryptedPayloadHex);
  // eslint-disable-next-line
  const aesCtr2 = new aesjs.ModeOfOperation.ctr(Buffer.from(key));
  const decryptedBytes = aesCtr2.decrypt(encryptedBytes);
  return aesjs.utils.utf8.fromBytes(decryptedBytes).trim();
};
