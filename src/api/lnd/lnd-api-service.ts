import axios from 'axios';
import { LndInfo } from 'src/api/lnd/lnd-info';

// 3.5 secs
const LND_TIMEOUT = 3500;
const LND_LONGER_TIMEOUT = 10000;

export const lndGenSeed = async (lndRestAddress: string): Promise<string[] | undefined> => {
    try {
        const res = await axios.get(`${lndRestAddress}/v1/genseed`);
        return res.data.cipher_seed_mnemonic;
    } catch (err) {
        console.log(`Gen seed for LND with address ${lndRestAddress} failed!`, err.message);
        return undefined;
    }
};

export const lndInitWallet = async (lndRestAddress: string, walletPassword: string, seedMnemonic: string[]): Promise<string | undefined> => {
    try {
        const res = await axios.post(`${lndRestAddress}/v1/initwallet`, {
            wallet_password: Buffer.from(walletPassword).toString('base64'),
            cipher_seed_mnemonic: seedMnemonic,
        });
        // will be undefined if not stateless init (set in lnd.conf)
        return res.data.admin_macaroon;
    } catch (err) {
        console.log(`Init for LND with address ${lndRestAddress} failed!`, err.message);
        throw err;
    }
};

export const lndBakeMacaroonForBtcPay = async (lndRestAddress: string, adminMacaroonHex: string): Promise<string | undefined> => {
    try {
        const res = await axios.post(`${lndRestAddress}/v1/macaroon`, {
            permissions: [
                { entity: 'info', action: 'read' },
                { entity: 'invoices', action: 'read' },
                { entity: 'invoices', action: 'write' },
                { entity: 'offchain', action: 'read' },
            ],
        }, {
            headers: {
                'Grpc-Metadata-macaroon': adminMacaroonHex,
            },
        });
        return res.data.macaroon;
    } catch (err) {
        console.log(`Bake macaroon for LND with address ${lndRestAddress} failed!`, err.message);
        return undefined;
    }
};

export const lndUnlockWallet = async (lndRestAddress: string, walletPassword: string): Promise<boolean> => {
    const source = axios.CancelToken.source();
    const timeout = setTimeout(() => {
        source.cancel();
        // Timeout Logic
    }, LND_LONGER_TIMEOUT);
    try {
        await axios.post(`${lndRestAddress}/v1/unlockwallet`, {
            wallet_password: Buffer.from(walletPassword).toString('base64'),
        }, {
            cancelToken: source.token,
        });
        clearTimeout(timeout);
        return true;
    } catch (err) {
        clearTimeout(timeout);
        console.log(`Unlock for LND with address ${lndRestAddress} failed!`, err.message);
        if (err.response && err.response.data && err.response.data.code === 2 &&
                err.response.data.message === 'invalid passphrase for master public key') {
            throw new Error('invalid_passphrase');
        }
        if (err.response && err.response.data && err.response.data.code === 2) {
            throw new Error('wallet_not_init');
        }
        if (err.response && err.response.status === 404) {
            throw new Error('lnd_locked');
        }
    }
    return false;
};


export const lndGetInfo = async (lndRestAddress: string, macaroonHex: string): Promise<LndInfo | undefined> => {
  const source = axios.CancelToken.source();
  const timeout = setTimeout(() => {
    source.cancel();
    // Timeout Logic
  }, LND_TIMEOUT);
  try {
    const res = await axios.get(`${lndRestAddress}/v1/getinfo`, {
      cancelToken: source.token,
      headers: {
        'Grpc-Metadata-macaroon': macaroonHex,
      },
      // 10 secs
      timeout: 2000,
    });
    clearTimeout(timeout);
    return new LndInfo(
      res.data.identity_pubkey,
      res.data.synced_to_chain,
      res.data.synced_to_graph,
      res.data.num_peers,
      res.data.num_inactive_channels,
      res.data.num_active_channels,
      res.data.num_pending_channels,
      res.data.version,
      res.data.uris[0],
      res.data.alias,
    );
  } catch (err) {
    clearTimeout(timeout);
    console.log(`Get info of LND with address ${lndRestAddress} failed!`, err.message);
    return undefined;
  }
};
