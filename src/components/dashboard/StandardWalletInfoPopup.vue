<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false" :position="isMobile ? 'bottom' : 'standard'">
    <provide-master-password-popup :show="showConfirmMasterPasswordPopup"
                                   subheader="It is required for decrypting your standard wallet seed"
                                   @passwordConfirmed="onPasswordConfirmed"
                                   loader-header="Decrypting seed">
    </provide-master-password-popup>
    <wallet-seed-popup :show="showSeedPopup" :seed="standardWalletSeed"
                       header="Your standard wallet seed"
                       subheader="Your standard wallet 12 words mnemonic seed.">
    </wallet-seed-popup>
    <q-card class="bg-grey-2">
      <q-card-section v-if="this.userBtcWalletDto">
        <div class="row justify-center">
          <div class="col-auto text-primary">
            <q-icon size="xl" name="mdi-wallet" color="primary"/>
          </div>
        </div>
        <div class="row justify-center q-pt-xs">
          <div class="col-auto items-center">
            <div class="text-primary text-bold text-center" :class="isMobile ? 'text-h6' : 'text-h5'">
            <q-icon  size="md" name="mdi-bitcoin" color="orange"/>
              <span class="vertical-middle"> Your standard wallet</span>
            </div>
            <div class="text-primary text-left text-subtitle2 q-pt-xs">
              • Your standard wallet receives on-chain payments (Bitcoin transactions)<br>
              <span v-if="userBtcWalletDto && userBtcWalletDto.type === 'BIP49'">
                • You can access this wallet having 12 words seed passphrase (BIP39) <br>
                • Standard wallet is derived from given BIP49 root public key<br>
              </span>
              <span v-else>
                • Standard wallet is derived from Electrum wallet master key<br>
              </span>
            </div>
            <q-input
              class="q-pt-md"
              dense
              type="text"
              onkeypress="return false;"
              name="email"
              square
              :value="this.userBtcWalletDto.rootPublicKey"
              :label="rootPublicKeyLabel">
              <template v-slot:before>
                <q-icon style="width:50px;" color="primary" name="mdi-key" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center" class="text-primary">
        <q-btn glossy @click="showConfirmMasterPasswordPopup = !showConfirmMasterPasswordPopup" color="orange-8" text-color="white">
          <q-icon left name="mdi-eye" />
          Show seed
        </q-btn>
        <q-btn glossy outline @click="close()" text-color="primary">Close</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style>
</style>

<script lang="ts">

import GlobalMixin from 'src/mixins/global-mixin';
import { get } from 'src/api/http-service';
import { showNotificationError } from 'src/api/notificatios-api';
import Loader from 'components/utils/Loader.vue';
import ProvideMasterPasswordPopup from 'components/welcome/ProvideMasterPasswordPopup.vue';
import { decryptSymmetricCtr } from 'src/api/encryption-service';
import WalletSeedPopup from 'components/dashboard/WalletSeedPopup.vue';

export default GlobalMixin.extend({
  name: 'StandardWalletInfoPopup',
  components: { WalletSeedPopup, ProvideMasterPasswordPopup, Loader },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      showPopup: false,
      showSeedPopup: false,
      showConfirmMasterPasswordPopup: false,
      showLoading: false,
      userBtcWalletDto: null,
      standardWalletSeed: null,
    };
  },
  mounted() {
    get(this.$axios, '/api/wallet', (res: any) => {
      console.log(res.data);
      this.userBtcWalletDto = res.data;
    }, (err: any) => {
      console.log(err);
    });
  },
  computed: {
    rootPublicKeyLabel() {
      if (this.userBtcWalletDto) {
        if (this.userBtcWalletDto.type === 'BIP49') {
          return 'BIP49 Root Public Key';
        } else if (this.userBtcWalletDto.type === 'ELECTRUM') {
          return 'Electrum master key';
        } else {
          return 'Root public key';
        }
      } else {
        return '';
      }
    }
  },
  watch: {
    show() {
      this.showPopup = true;
    },
  },
  methods: {
    close() {
      this.showPopup = false;
    },
    async onPasswordConfirmed(password: string) {
      get(this.$axios, '/api/wallet/seed', (res: any) => {
        this.showSeedPopup = !this.showSeedPopup;
        this.standardWalletSeed = decryptSymmetricCtr(res.data.seed, password);
      }, (err: any) => {
        showNotificationError('Getting standard wallet seed failed', 'Unexpected error occurred');
        console.log(err);
      });
    },
  },
});
</script>
