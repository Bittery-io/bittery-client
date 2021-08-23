export class CreateUserBtcpayDto {
    storeName: string;
    bip49RootPublicKey?: string;
    electrumMasterPublicKey?: string;
    encryptedStandardWalletSeed?: string;

    constructor(storeName: string, bip49RootPublicKey?: string, encryptedStandardWalletSeed?: string, electrumMasterPublicKey?: string) {
        this.storeName = storeName;
        this.bip49RootPublicKey = bip49RootPublicKey;
        this.encryptedStandardWalletSeed = encryptedStandardWalletSeed;
        this.electrumMasterPublicKey = electrumMasterPublicKey;
    }
}
