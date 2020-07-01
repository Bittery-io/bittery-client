export class UserLndDto {
  lndAddress: string;
  rtlAddress: string;
  rtlOneTimePassword?: string;
  lndConnectUri: string;

  constructor(lndAddress: string, rtlAddress: string, lndConnectUri: string, rtlOneTimePassword?: string) {
    this.lndAddress = lndAddress;
    this.rtlAddress = rtlAddress;
    this.lndConnectUri = lndConnectUri;
    this.rtlOneTimePassword = rtlOneTimePassword;
  }
}
