import { LndInitWalletInput } from 'src/api/lnd/lnd-init-wallet-input';
import { lndBakeMacaroonForBtcPay, lndGetInfo, lndInitWallet } from 'src/api/lnd/lnd-api-service';
import { sleep } from 'src/api/sleep-service';
import { encryptSymmetricCtr } from 'src/api/encryption-service';
import { LndInitWalletDto } from 'src/dto/lnd/lnd-init-wallet-dto';
import { LndInfo } from 'src/api/lnd/lnd-info';
import { showNotificationError } from 'src/api/notificatios-api';

export const initLndWallet = async (masterPassword: string, lndInitWalletInput: LndInitWalletInput): Promise<LndInitWalletDto> => {
  let adminMacaroonBase64: string | undefined = await lndInitWallet(
    lndInitWalletInput.lndRestAddress,
    lndInitWalletInput.password,
    lndInitWalletInput.seedMnemonic);
  if (adminMacaroonBase64) {
    await sleep(5000);
    const adminMacaroonHex: string = Buffer.from(adminMacaroonBase64, 'base64').toString('hex');
    const bitteryBakedMacaroonHex: string | undefined = await lndBakeMacaroonForBtcPay(lndInitWalletInput.lndRestAddress, adminMacaroonHex);
    if (bitteryBakedMacaroonHex) {
      const lndInfo: LndInfo | undefined = await lndGetInfo(lndInitWalletInput.lndRestAddress, bitteryBakedMacaroonHex);
      if (lndInfo) {
        const encryptedLnPassword: string = encryptSymmetricCtr(lndInitWalletInput.password, masterPassword);

        let seedMnemonicSingleString: string = '';
        lndInitWalletInput.seedMnemonic.map(singleMnemonic => {
          seedMnemonicSingleString = `${seedMnemonicSingleString}${singleMnemonic} `;
        });
        const encryptedSeedMnemonicSingleString: string = encryptSymmetricCtr(seedMnemonicSingleString, masterPassword);

        const adminMacaroonHexEncrypted: string = encryptSymmetricCtr(adminMacaroonHex, masterPassword);
        return new LndInitWalletDto(
          encryptedLnPassword,
          encryptedSeedMnemonicSingleString,
          adminMacaroonHexEncrypted,
          bitteryBakedMacaroonHex,
          lndInfo.publicKey
        );
      } else {
        showNotificationError('Init wallet failed!', 'Getting LN node info with custom macaroon failed');
        throw new Error();
      }
    } else {
      showNotificationError('Init wallet failed!', 'Generating Bittery custom macaroon failed.');
      throw new Error();
    }
  } else {
    showNotificationError('Init wallet failed!', 'Init wallet request failed (no admin.macaroon)')
    throw new Error();
  }
}
