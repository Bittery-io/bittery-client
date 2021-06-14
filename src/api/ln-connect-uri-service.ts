const lndconnect = require('lndconnect');

export const getLndConnectUri = async (lndIpAddress: string, tlsCert: string, macaroonHex: string): Promise<string> => {
  const grpcAddress: string = `${lndIpAddress}:10009`;
  return lndconnect.encode({
    host: grpcAddress,
    cert: tlsCert,
    macaroon: macaroonHex,
  });
};
