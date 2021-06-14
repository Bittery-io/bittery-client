export class SaveEncryptedAdminMacaroonDto {

    encryptedAdminMacaroonHex: string;

    constructor(encryptedAdminMacaroonHex: string) {
        this.encryptedAdminMacaroonHex = encryptedAdminMacaroonHex;
    }
}
