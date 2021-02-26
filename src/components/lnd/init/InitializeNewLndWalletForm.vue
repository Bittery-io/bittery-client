<template>
  <div class="q-pa-xs">
    <loader :show="showLoading"></loader>
    <error-popup header="BTCPay setup failed"
                 :error-message="errorBannerMessage"
                 :show="errorBannerMessage !== ''">
    </error-popup>
    <provide-master-password-popup :show="showMasterPasswordPopup" subheader="Password will be used for data encryption"
                                   @passwordConfirmed="onMasterPasswordConfirmed">
    </provide-master-password-popup>
    <q-stepper
      v-model="step"
      bordered
      class="bg-grey-2"
      vertical
      :style="$q.platform.is.mobile ? `width: ${screenWidth * 0.93}px` : `width: ${screenWidth * 0.45}px`"
      color="primary"
      animated>
      <q-step
        :name="1"
        title="Generate LN Node wallet 24 words mnemonic seed"
        icon="info"
        class="text-left"
        :done="step > 1">
        <div class="text-body1">
          LN Node wallet <b>manages funds</b> of your Lightning Network Node. <br>
          24 words mnemonic seed is a human friendly, readable, cryptographically secure form of LN Node wallet.<br>
          This mnemonic allows you <b>to restore</b> your LN Node wallet any time in the future (using any LN node). <br>
        </div>
        <q-stepper-navigation>
          <q-btn @click="generateSeedMnemonic" color="primary" label="Generate LN Node mnemonic"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="2"
        title="Save the LN Node wallet mnemonic seed"
        icon="info"
        class="text-left"
        :done="step > 2">
        <q-banner rounded class="text-white text-bold bg-primary">
          <q-icon name="info" size="lg" color="white" />
          Your LN Node wallet 24 words mnemonic seed.<br><span class="text-bold text-red"> Save it and keep private.</span>
          <q-input
            outlined
            class="q-mt-xs"
            bg-color="grey-3"
            :type="isMnemonicPwd ? 'password' : 'text'"
            onkeypress="return false;"
            square
            :value="seedMnemonicText"
            label="Your 24 words mnemonic">
            <template v-slot:prepend>
              <q-icon color="primary" name="mdi-format-list-numbered-rtl"/>
            </template>
          </q-input>
          <div class="text-bold text-red q-pt-xs text-body1">
            REMEMBER: Knowing the seed equals having Bitcoin. Don't share this seed to anyone.
          </div>
        </q-banner>
        <q-stepper-navigation>
          <q-btn outline @click="step = 1;" color="primary" label="Previous step"/>
          <q-btn @click="isMnemonicPwd = !isMnemonicPwd" color="grey-7"
                 :label="isMnemonicPwd ? 'Show mnemonic' : 'Hide mnemonic'"
                 :icon="isMnemonicPwd ? 'mdi-eye' : 'mdi-eye-off'" class="q-ml-sm"/>
          <q-btn @click="step = 3;seedMnemonicConfirmationText = ''" color="primary" v-show="seedMnemonicText" label="NEXT STEP" class="q-ml-sm"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="3"
        title="Confirm LN Node wallet mnemonic seed"
        icon="info"
        class="text-left"
        :done="step > 3">
        <div class="text-body1 q-pb-md">
           Please provide generated 24 words mnemonic in order to confirm you saved it correctly.
        </div>
        <div class="row">
          <div class="col-12">
            <vue-form :state='lnSeedState' @submit.prevent="() => {}">
              <validate>
                <q-input
                  v-model="seedMnemonicConfirmationText"
                  outlined
                  square
                  name="seedMnemonicConfirmationText"
                  ref="seedMnemonicConfirmationText"
                  bg-color="accent"
                  label="24 words mnemonic"
                  required
                  :rules="[ val => (
                              lnSeedState.seedMnemonicConfirmationText !== undefined &&
                              lnSeedState.seedMnemonicConfirmationText.$valid) || 'Please confirm your 24 words mnemonic',
                              val => (seedMnemonicText.trim() === seedMnemonicConfirmationText.trim()) || 'Given mnemonic does not match generated!']"
                  type='text'>
                  <template v-slot:prepend>
                    <q-icon color="primary" name="mdi-format-list-numbered-rtl"/>
                  </template>
                </q-input>
              </validate>
            </vue-form>
          </div>
        </div>
        <q-stepper-navigation>
          <q-btn outline @click="step = 2" color="primary" label="Previous step"/>
          <q-btn @click="step = 4" color="primary"
                 :disable="seedMnemonicText.trim() !== seedMnemonicConfirmationText.trim()"
                 label="NEXT STEP" class="q-ml-sm"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="4"
        title="Define LN Node password"
        icon="info"
        class="text-left"
        :done="step > 4">
        <div class="text-body1 q-pb-md">
          LN Node password <b>protects</b> access to your node including the wallet.<br>
          Please set <b>strong</b> password. This will be required to unlock the node.
        </div>
        <vue-form :state='lnPasswordState' @submit.prevent="() => {}">
          <div class="row q-pt-xs">
            <div class="col-12">
              <validate>
                <q-input
                  outlined
                  square
                  bg-color="accent"
                  name="lnPassword"
                  ref="lnPassword"
                  v-model="lnPassword"
                  label="LN Password"
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[ val => (
                            lnPasswordState.lnPassword !== undefined &&
                            lnPasswordState.lnPassword.$valid) || 'Password is required',
                            val => (lnPassword.trim().length >= 6) || 'Password must have at least 6 characters',
                            val => (lnPassword.trim() !== '') || 'Password cannot be empty',]"
                  required>
                  <template v-slot:prepend>
                    <q-icon color="primary" name="mdi-lock"/>
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </validate>
            </div>
          </div>
          <div class="row q-pt-xs">
            <div class="col-12">
              <validate>
                <q-input
                  outlined
                  square
                  bg-color="accent"
                  name="lnPasswordRepeat"
                  ref="lnPasswordRepeat"
                  v-model="lnPasswordRepeat"
                  label="LN Password repeat"
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[ val => (
                        lnPasswordState.lnPasswordRepeat !== undefined &&
                        lnPasswordState.lnPasswordRepeat.$valid) || 'Please repeat your password',
                         val => (
                        lnPasswordState.lnPasswordRepeat !== undefined &&
                        lnPasswordState.lnPassword !== undefined &&
                        lnPassword === lnPasswordRepeat) || 'Passwords don\'t match',
                        val => (lnPasswordRepeat.trim() !== '') || 'Password cannot be empty']"
                  required>
                  <template v-slot:prepend>
                    <q-icon color="primary" name="mdi-lock"/>
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </validate>
            </div>
          </div>
        </vue-form>
        <q-stepper-navigation>
          <q-btn outline @click="step = 3;lnPassword = ''; lnPasswordRepeat = ''" color="primary" label="Previous step"/>
          <q-btn @click="step = 5" :disable="lnPassword !== '' && (lnPassword !== lnPasswordRepeat)" color="primary" label="Next step" class="q-ml-sm"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="5"
        title="Encrypt your data"
        icon="info"
        class="text-left"
        :done="step > 5">
        <div class="text-body1 q-pb-md">
          Your <b>seed</b> and <b>node password</b> will be now encrypted in your browser using your <b>master password</b>.<br>
          Bittery will store the data encrypted and will be able to restore it to you when needed. <br>
        </div>
        <q-stepper-navigation>
          <q-btn outline @click="step = 4;lnPassword = ''; lnPasswordRepeat = ''" color="primary" label="Previous step"/>
          <q-btn @click="showMasterPasswordPopup = !showMasterPasswordPopup" color="grey-7" label="Encrypt data" icon="mdi-lock" class="q-ml-sm"/>
          <q-btn @click="step = 6" :disable="masterPassword === ''" color="primary" label="Next step" class="q-ml-sm"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="6"
        title="Initialize LN Node wallet"
        icon="info"
        class="text-left"
        :done="step > 6">
        <div class="text-body1 q-pb-xs">
          Initializing your LN Node wallet can take up to 30 seconds. <br>
          Please don't close the browser and wait until finish.
        </div>
        <q-stepper-navigation>
          <q-btn outline @click="step = 4" color="primary" label="Previous step"/>
          <q-btn @click="initializeLnd" icon="mdi-wallet-plus" color="primary" label="Initialize LND wallet" class="q-ml-sm"/>
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<script lang="ts">
import GlobalMixin from "../../../mixins/global-mixin";
import ErrorPopup from 'components/utils/ErrorPopup.vue';
import Loader from 'components/utils/Loader.vue';
import { get, post } from 'src/api/http-service';
import { showNotificationInfo } from 'src/api/notificatios-api';
import { BitcoinWallet } from 'src/model/bitcoin-wallet';
import { LndInitWalletDto } from 'src/dto/lnd/lnd-init-wallet-dto';
import WarningInfoBanner from 'components/utils/WarningInfoBanner.vue';
import sha256 from 'js-sha256';
import ProvideMasterPasswordPopup from 'components/welcome/ProvideMasterPasswordPopup.vue';
import { encryptSymmetricCtr } from 'src/api/encryption-service';
import { SaveEncryptedAdminMacaroonDto } from 'src/dto/lnd/save-encrypted-admin-macaroon-dto';

export default GlobalMixin.extend({
  name: 'InitializeNewLndWalletForm',
  components: { ProvideMasterPasswordPopup, WarningInfoBanner, ErrorPopup, Loader },
  data() {
    return {
      showMasterPasswordPopup: false,
      lnPasswordState: {},
      lnSeedState: {},
      isPwd: true,
      isMnemonicPwd: true,
      bitcoinWallet: <BitcoinWallet> {},
      seedMnemonic: [],
      seedMnemonicText: '',
      seedMnemonicConfirmationText: '',
      seedMnemonicTextEncrypted: '',
      step: 1,
      errorBannerMessage: '',
      bitcoinLndCheckbox: true,
      userHasElectrum: false,
      electrumMasterPublicKey: '',
      lnPassword: '',
      lnPasswordRepeat: '',
      masterPassword: '',
    };
  },
  mounted() {
    if (this.$route.query.electrum && this.$route.query.electrum === 'true') {
      this.userHasElectrum = true;
    }
  },
  methods: {
    onMasterPasswordConfirmed(masterPassword: string) {
      this.masterPassword = masterPassword;
    },
    generateSeedMnemonic() {
      this.showLoading = true;
      setTimeout((() => {
        get(this.$axios, `/api/lnd/${this.$route.params.lndId}/seed`, (res: any) => {
          this.isMnemonicPwd = true;
          this.seedMnemonicText = '';
          this.seedMnemonicTextEncrypted = '';
          this.seedMnemonic = res.data;
          this.seedMnemonic.map(singleMnemonic => {
            this.seedMnemonicText = `${this.seedMnemonicText}${singleMnemonic} `;
          })
          this.step = 2;
          this.showLoading = false;
        }, (err: any) => {
          this.showLoading = false;
          console.log(err);
        });

      }), 500);
    },
    initializeLnd() {
      this.errorBannerMessage = '';
      this.showLoading = true;
      console.log((this.seedMnemonic.toString()));
      const lndInitWalletDto: LndInitWalletDto = new LndInitWalletDto(
        sha256(this.lnPassword),
        this.seedMnemonic,
        encryptSymmetricCtr(this.lnPassword, this.masterPassword),
        encryptSymmetricCtr(this.seedMnemonic.toString(), this.masterPassword));
      post(this.$axios, `/api/lnd/${this.$route.params.lndId}/initwallet`, lndInitWalletDto, async (res: any) => {
        const saveEncryptedAdminMacaroonDto: SaveEncryptedAdminMacaroonDto =
          new SaveEncryptedAdminMacaroonDto(encryptSymmetricCtr(res.data.adminMacaroon, this.masterPassword));
        post(this.$axios, `/api/lnd/${this.$route.params.lndId}/adminmacaroon`, saveEncryptedAdminMacaroonDto, async () => {
          this.showLoading = false;
          await this.sleep(200); // small sleep required
          showNotificationInfo('LN Node wallet init succeed', 'Your LN Node is now ready to use');
          await this.$router.push('/bitcoin/overview');
        }, (err: any) => {
          this.showLoading = false;
          this.errorBannerMessage = 'Internal server error occurred. Please try again later.';
          console.log(err);
        });
      }, (err: any) => {
        this.showLoading = false;
        this.errorBannerMessage = 'Internal server error occurred. Please try again later.';
        console.log(err);
      });
    },
  },
});

</script>
