export class SetupMasterPasswordDto {

  sha256PasswordProof: string;

  constructor(sha256PasswordProof: string) {
    this.sha256PasswordProof = sha256PasswordProof;
  }
}
