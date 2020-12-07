export class LndInitWalletDto {

    password: string;
    seedMnemonic: string[];

    constructor(password: string, seedMnemonic: string[]) {
        this.password = password;
        this.seedMnemonic = seedMnemonic;
    }
}
