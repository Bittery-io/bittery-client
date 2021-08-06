export class LndInitWalletInput {

  lndRestAddress: string;
  password: string;
  seedMnemonic: string[];

  constructor(lndRestAddress: string, password: string, seedMnemonic: string[]) {
    this.lndRestAddress = lndRestAddress;
    this.password = password;
    this.seedMnemonic = seedMnemonic;
  }
}
