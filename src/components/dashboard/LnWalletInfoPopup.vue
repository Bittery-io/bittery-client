<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false" :position="isMobile ? 'bottom' : 'standard'">
    <provide-master-password-popup :show="showConfirmMasterPasswordPopup"
                                   subheader="It is required for decrypting your LN Node wallet seed"
                                   @passwordConfirmed="onPasswordConfirmed"
                                   loader-header="Decrypting seed">
    </provide-master-password-popup>
    <wallet-seed-popup :show="showSeedPopup" :seed="lnWalletSeed"
                       header="Your LN Node wallet seed"
                       subheader="Your LN Node wallet 24 words mnemonic seed."></wallet-seed-popup>
    <q-card class="bg-grey-2">
      <q-card-section>
        <div class="row justify-center">
          <div class="col-auto text-primary">
            <q-icon size="xl" name="mdi-wallet" color="primary"/>
          </div>
        </div>
        <div class="row justify-center q-pt-xs">
          <div class="col-auto items-center">
            <div class="text-primary text-bold text-center" :class="isMobile ? 'text-h6' : 'text-h5'">
              <q-icon  size="md" name="mdi-flash" color="yellow-7"/>
              <span class="vertical-middle"> Your LN Node wallet</span>
            </div>
            <div class="text-primary text-left text-subtitle2 q-pt-xs">
              • Your LN Node wallet receives off-chain payments (Lightning Network)<br>
              • It is part of your Lightning Network Node<br>
              • This wallet <span class="text-red-8">doesn't contain</span> funds of opened LN channels<br>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center" class="text-primary">
        <q-btn @click="showConfirmMasterPasswordPopup = !showConfirmMasterPasswordPopup" color="orange-8" text-color="white">
          <q-icon left name="mdi-eye" />
          Show seed
        </q-btn>
        <q-btn outline @click="close()" text-color="primary">Close</q-btn>
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
  name: 'LnWalletInfoPopup',
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
      showLoading: false,
      userBtcWalletDto: null,
      showConfirmMasterPasswordPopup: false,
      lnWalletSeed: null,
      showSeedPopup: false,
    };
  },
  watch: {
    show() {
      this.showPopup = true;
    },
  },
  methods: {
    async onPasswordConfirmed(password: string) {
      get(this.$axios, '/api/lnd/seed', (res: any) => {
        this.showSeedPopup = !this.showSeedPopup;
        this.lnWalletSeed = decryptSymmetricCtr(res.data.encryptedArtefact, password);
      }, (err: any) => {
        showNotificationError('Getting LN node wallet seed failed', 'Unexpected error occurred');
        console.log(err);
      });
    },
    close() {
      this.showPopup = false;
    },
  },
});
</script>
