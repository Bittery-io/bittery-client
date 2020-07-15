import { generateMnemonic } from 'bip39';
import * as Bip84 from 'bip84/src/index';

import { BitcoinWallet } from 'src/model/bitcoin-wallet';

export const generateBitcoinWallet = (): BitcoinWallet => {
  const seed: string = generateMnemonic();
  const root = new Bip84.fromSeed(seed);
  return new BitcoinWallet(
    seed,
    root.getRootPublicKey(),
  );
};
