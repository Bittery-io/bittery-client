export class LndInitWalletDto {

    password: string;
    seedMnemonic: string[];
    passwordEncrypted: string;
    seedMnemonicEncrypted: string;

    constructor(password: string, seedMnemonic: string[], passwordEncrypted: string, seedMnemonicEncrypted: string) {
        this.password = password;
        this.seedMnemonic = seedMnemonic;
        this.passwordEncrypted = passwordEncrypted;
        this.seedMnemonicEncrypted = seedMnemonicEncrypted;
    }
}
