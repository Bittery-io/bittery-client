import { HostedLndType } from 'src/dto/lnd/hosted-lnd-type';

export class CreateLndDto {

    lnAlias?: string;
    wumboChannels: boolean;
    hostedLndType: HostedLndType;

  constructor(wumboChannels: boolean, hostedLndType: HostedLndType, lnAlias?: string) {
    this.lnAlias = lnAlias;
    this.wumboChannels = wumboChannels;
    this.hostedLndType = hostedLndType;
  }
}
