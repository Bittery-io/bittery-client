export class LndInitWalletDto {

  passwordEncrypted: string;
  seedMnemonicEncrypted: string;
  adminMacaroonHexEncrypted: string;
  bitteryBakedMacaroonHex: string
  nodePublicKey: string;

  constructor(passwordEncrypted: string, seedMnemonicEncrypted: string, adminMacaroonHexEncrypted: string, bitteryBakedMacaroonHex: string, nodePublicKey: string) {
    this.passwordEncrypted = passwordEncrypted;
    this.seedMnemonicEncrypted = seedMnemonicEncrypted;
    this.adminMacaroonHexEncrypted = adminMacaroonHexEncrypted;
    this.bitteryBakedMacaroonHex = bitteryBakedMacaroonHex;
    this.nodePublicKey = nodePublicKey;
  }
}
