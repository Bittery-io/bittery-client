export class CreateUserBtcpayDto {
    bip49RootPublicKey?: string;
    electrumMasterPublicKey?: string;
    encryptedStandardWalletSeed?: string;

    constructor(bip49RootPublicKey?: string, encryptedStandardWalletSeed?: string, electrumMasterPublicKey?: string) {
        this.bip49RootPublicKey = bip49RootPublicKey;
        this.encryptedStandardWalletSeed = encryptedStandardWalletSeed;
        this.electrumMasterPublicKey = electrumMasterPublicKey;
    }
}
