import { generateMnemonic } from 'bip39';
// @ts-ignore
import * as bip84 from 'bip84';

import { BitcoinWallet } from 'src/model/bitcoin-wallet';

export const generateBitcoinWallet = (): BitcoinWallet => {
  const seed: string = generateMnemonic();
  const root = new bip84.fromSeed(seed, true);
  const child0 = root.deriveAccount(0);
  const account0 = new bip84.fromZPrv(child0);
  console.log('Public key 0:', account0.getAccountPublicKey(0))
  return new BitcoinWallet(
    seed,
    account0.getAccountPublicKey(0),
  );
};
