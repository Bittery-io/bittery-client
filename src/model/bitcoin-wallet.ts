export class BitcoinWallet {
  seed: string;
  rootPublicKey: string;
  bip: string;

  constructor(seed: string, publicKey: string) {
    this.seed = seed;
    this.rootPublicKey = publicKey;
    this.bip = '84';
  }
}
