import { HostedLndType } from 'src/dto/lnd/hosted-lnd-type';

export class CreateLndDto {

    lnAlias?: string;
    hostedLndType: HostedLndType;

  constructor(hostedLndType: HostedLndType, lnAlias?: string) {
    this.lnAlias = lnAlias;
    this.hostedLndType = hostedLndType;
  }
}
