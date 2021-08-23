<template>
  <div class="q-pa-xs">
    <loader :show="showLoading"></loader>
    <error-popup header="Payments setup failed"
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
      :class="isMobile ? 'mobile-stepper-full' : ''"
      :style="$q.platform.is.mobile ? `` : `width: ${screenWidth * 0.45}px`"
      color="primary"
      animated>
      <q-step
        :name="1"
        title="Accepted payments methods"
        icon="info"
        class="text-left"
        :done="step > 1">
        <div class="text-body1 q-pb-xs">
          You will be able to receive Bitcoin payments:
        </div>
        <q-checkbox :dense="isMobile" :value="bitcoinLndCheckbox" label="off-chain (fast and cheap) via Lightning Network" class="nocursor">
          <q-badge class="q-ml-xs">payments go to LN NODE WALLET</q-badge>
        </q-checkbox> <br>
        <q-checkbox :dense="isMobile" :value="bitcoinLndCheckbox" label="on-chain (blockchain transactions)" class="nocursor">
          <q-badge class="q-ml-xs" v-if="userHasElectrum" >payments go to your Electrum wallet</q-badge>
          <q-badge class="q-ml-xs" v-else>payments go to STANDARD WALLET</q-badge>
        </q-checkbox>
        <q-stepper-navigation>
          <q-btn glossy @click="step = 2;bitcoinWallet.seed = ''" color="primary" label="Next step"
                 :class="isMobile ? 'full-width q-mt-xs' : ''" icon-right="mdi-arrow-right-bold"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        v-if="userHasElectrum"
        :name="2"
        title="Provide Electrum Master Public Key"
        icon="info"
        class="text-left text-body1"
        :done="step > 2">
        Please provide your <b>Electrum Wallet Master Public Key</b> (can be found under <span class="text-italic">Wallet->Information)</span>. <br>
        <warning-info-banner
          class="q-mt-xs"
          text="Bittery cannot move funds under your Electrum wallet. All your private keys stay safe and private."></warning-info-banner>
        <div class="row q-pt-xs">
          <div class="col-12">
            <vue-form :state='electrumPublicKeyState' @submit.prevent="() => {}">
              <validate>
                <q-input
                  outlined
                  bg-color="accent"
                  type="string"
                  name="electrumMasterPublicKey"
                  ref="electrumMasterPublicKey"
                  square
                  :dense="isMobile"
                  v-model="electrumMasterPublicKey"
                  label="Electrum Master Public Key value"
                  required
                  :rules="[ val => (
                              electrumPublicKeyState.electrumMasterPublicKey !== undefined &&
                              electrumPublicKeyState.electrumMasterPublicKey.$valid) || 'Please provide Electrum Wallet Master Public Key']">
                  <template v-slot:prepend>
                    <q-icon color="primary" name="mdi-key"/>
                  </template>
                </q-input>
              </validate>
            </vue-form>
          </div>
        </div>
        <q-stepper-navigation>
          <q-btn glossy outline @click="step = 1" color="primary" label="Previous step"
                 :class="isMobile ? 'full-width q-mt-xs' : ''" icon="mdi-arrow-left-bold"/>
          <q-btn glossy @click="step=3" :disabled="electrumMasterPublicKey === ''" color="primary" label="NEXT STEP"
                 :class="isMobile ? 'full-width q-mt-xs' : 'q-ml-sm'" icon-right="mdi-arrow-right-bold"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        v-else
        :name="2"
        title="Generate Bitcoin STANDARD WALLET seed"
        icon="info"
        class="text-left"
        :done="step > 2">
        <div class="text-body1 q-pb-xs">
          Generate new <b>BIP-39</b> Bitcoin seed which will be used to create your Bitcoin <b> standard wallet</b>.<br>
          The seed can be easily imported by most open-source Bitcoin wallets (e.g. Electrum wallet).<br>
          <span class="text-bold">Bittery will not be able to move funds of this wallet.</span>
        </div>
        <warning-info-banner v-show="!bitcoinWallet.seed"
                             text="Generation process will be done only in the browser. Seed and private keys will not leave the browser.">
        </warning-info-banner>
        <q-banner rounded v-show="bitcoinWallet.seed" class="text-white text-bold bg-primary">
          <q-icon name="info" size="lg" color="white" />
          Your Bitcoin standard wallet seed (BIP-39).
          <br><span class="text-bold text-red"> Save it and keep private.</span>
          <q-input
            outlined
            class="q-mt-xs"
            bg-color="grey-3"
            :dense="isMobile"
            :type="isMnemonicPwd ? 'password' : 'text'"
            onkeypress="return false;"
            square
            :value="bitcoinWallet.seed"
            label="Your mnemonic seed (12 words)">
            <template v-slot:prepend>
              <q-icon color="primary" name="mdi-format-list-numbered-rtl"/>
            </template>
          </q-input>
          <div class="text-bold text-red q-pt-xs text-body2" v-show="bitcoinWallet.seed">
            REMEMBER: Knowing the seed equals having Bitcoin. Don't share this seed to anyone.
          </div>
        </q-banner>
        <q-stepper-navigation>
          <q-btn glossy outline @click="step = 1;" color="primary" label="Previous step"
                 :class="isMobile ? 'full-width q-mt-xs' : ''" icon="mdi-arrow-left-bold"/>
          <q-btn glossy v-show="bitcoinWallet.seed"  @click="isMnemonicPwd = !isMnemonicPwd" color="grey-7"
                 :label="isMnemonicPwd ? 'Show mnemonic' : 'Hide mnemonic'"
                 :icon="isMnemonicPwd ? 'mdi-eye' : 'mdi-eye-off'" :class="isMobile ? 'full-width q-mt-xs' : 'q-ml-sm'"/>
          <q-btn glossy @click="generateBtcWallet" color="grey-7"
                 :label="bitcoinWallet.seed ? 'Regenerate' : 'Generate'"
                 :icon="bitcoinWallet.seed ? 'mdi-cog-clockwise' : 'mdi-cogs'"
                 :class="isMobile ? 'full-width q-mt-xs' : 'q-ml-sm'"/>
          <q-btn glossy @click="step = 3;seedMnemonicConfirmationText=''" color="primary" v-show="bitcoinWallet.seed" label="NEXT STEP"
                 :class="isMobile ? 'full-width q-mt-xs' : 'q-ml-sm'" icon-right="mdi-arrow-right-bold"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="3"
        title="Set your store name"
        icon="mdi-store"
        class="text-left"
        :done="step > 3">
        <div class="text-body1 q-pb-md">
          Provide your <b>store name</b>. It should be a short description of your service. The name will be visible on
          payment widgets (like on a preview below) and PDF invoices.
        </div>
        <div class="row items-center justify-center">
          <div class="col-lg-4 col-xs-auto q-pa-xs">
            <q-img src="statics/store-name.png" class="shadow-8" style="width:250px; height:100%;">
            </q-img>
          </div>
          <div class="col-lg-8 col-xs-12 q-pa-xs">
            <vue-form :state='storeNameState' @submit.prevent="() => {}">
              <validate>
                <q-input
                  v-model="storeName"
                  outlined
                  square
                  :dense="isMobile"
                  name="storeName"
                  ref="storeName"
                  bg-color="accent"
                  label="Your store name"
                  counter
                  maxlength="50"
                  required
                  :rules="[ val => (storeNameState.storeName !== undefined && storeNameState.storeName.$valid) || 'Store name is required - it is visible in payment widgets like in the preview.']"
                  type='text'>
                  <template v-slot:prepend>
                    <q-icon color="primary" name="mdi-store"/>
                  </template>
                </q-input>
              </validate>
            </vue-form>
          </div>
        </div>
        <q-stepper-navigation>
          <q-btn glossy outline @click="step = 2" color="primary" label="Previous step"
                 :class="isMobile ? 'full-width q-mt-xs' : ''" icon="mdi-arrow-left-bold"/>
          <q-btn glossy @click="setupNewBtcpayServices" color="primary" label="Initialize payments"
                 :disable="storeNameState.storeName !== undefined && !storeNameState.storeName.$valid"
                 :class="isMobile ? 'full-width q-mt-xs' : 'q-ml-sm'" icon-right="mdi-contactless-payment-circle" v-if="userHasElectrum"/>
          <q-btn glossy @click="step = 4" color="primary" v-else
                 :disable="storeNameState.storeName !== undefined && !storeNameState.storeName.$valid"
                 label="NEXT STEP" :class="isMobile ? 'full-width q-mt-xs' : 'q-ml-sm'"
                 icon-right="mdi-arrow-right-bold"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        v-if="!userHasElectrum"
        :name="4"
        title="Encrypt your data and setup payments"
        icon="info"
        class="text-left"
        :done="step > 4">
        <div class="text-body1">
          Your <b>seed</b> will be now encrypted in your browser using your <b>master password</b>.<br>
          Bittery will store the data encrypted and will be able to provide it to you when needed. <br>
          Just after successful encryption you can initialize payments.
        </div>
        <q-stepper-navigation>
          <q-btn glossy outline @click="step = 3;bitcoinWallet.seed = ''" color="primary" label="Previous step"
                 :class="isMobile ? 'full-width q-mt-xs' : ''" icon="mdi-arrow-left-bold"/>
          <q-btn glossy @click="showMasterPasswordPopup = !showMasterPasswordPopup"
                 :disable="masterPassword !== ''"
                 :color="masterPassword === '' ? `grey-7` : `primary`" :label="masterPassword ==='' ? `Encrypt seed` : `Successfully encrypted`" icon="mdi-lock"
                 :class="isMobile ? 'full-width q-mt-xs' : 'q-ml-sm'"/>
          <q-btn glossy @click="setupNewBtcpayServices" :disable="masterPassword === ''" color="primary" label="Initialize payments"
                 :class="isMobile ? 'full-width q-mt-xs' : 'q-ml-sm'" icon-right="mdi-contactless-payment-circle"/>
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<script lang="ts">
  import GlobalMixin from "../../mixins/global-mixin";
  import ErrorPopup from 'components/utils/ErrorPopup.vue';
  import Loader from 'components/utils/Loader.vue';
  import { post } from 'src/api/http-service';
  import { generateBitcoinWallet } from 'src/api/bitcoin-wallet-service';
  import { CreateUserBtcpayDto } from 'src/dto/create-user-btcpay-dto';
  import { showNotificationInfo } from 'src/api/notificatios-api';
  import { BitcoinWallet } from 'src/model/bitcoin-wallet';
  import WarningInfoBanner from 'components/utils/WarningInfoBanner.vue';
  import ProvideMasterPasswordPopup from 'components/welcome/ProvideMasterPasswordPopup.vue';
  import { encryptSymmetricCtr } from 'src/api/encryption-service';

  export default GlobalMixin.extend({
    name: 'SetupNewPayments',
    components: { ProvideMasterPasswordPopup, WarningInfoBanner, ErrorPopup, Loader },
    props: {
      userHasElectrum: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    data() {
      return {
        storeNameState: {},
        seedMnemonicConfirmationText: '',
        storeName: '',
        electrumPublicKeyState: {},
        bitcoinWallet: <BitcoinWallet> {},
        step: 1,
        errorBannerMessage: '',
        bitcoinLndCheckbox: true,
        userHasElectrum: false,
        electrumMasterPublicKey: '',
        isMnemonicPwd: true,
        masterPassword: '',
        showMasterPasswordPopup: false,
      };
    },
    methods: {
      onMasterPasswordConfirmed(masterPassword: string) {
        showNotificationInfo('Seed successfully encrypted', 'The data is encrypted with your master password');
        this.masterPassword = masterPassword;
      },
      generateBtcWallet() {
        this.masterPassword = '';
        this.showLoading = true;
        this.isMnemonicPwd = true;
        setTimeout((() => {
          this.bitcoinWallet = generateBitcoinWallet();
          this.showLoading = false;
        }), 500);
      },
      setupNewBtcpayServices() {
        this.errorBannerMessage = '';
        this.showLoading = true;
        let createUserBtcpayDto: CreateUserBtcpayDto;
        if (this.userHasElectrum) {
          createUserBtcpayDto = new CreateUserBtcpayDto(this.storeName, undefined, undefined, this.electrumMasterPublicKey);
        } else {
          createUserBtcpayDto = new CreateUserBtcpayDto(
            this.storeName,
            this.bitcoinWallet.rootPublicKey,
            encryptSymmetricCtr(this.bitcoinWallet.seed, this.masterPassword),
            undefined);
        }
        post(this.$axios, '/api/btcpay', createUserBtcpayDto, async () => {
          this.showLoading = false;
          await this.sleep(200); // small sleep required
          showNotificationInfo('Payments services setup succeed', 'You are ready to create Bitcoin invoices');
          await this.$router.push('/payments/overview');
        }, (err: any) => {
          this.showLoading = false;
          if (this.userHasElectrum) {
            this.errorBannerMessage = 'Setup payments failed. Is your Electrum Master Public Key correct?';
          } else {
            this.errorBannerMessage = 'Setup payments failed. Internal server error. Please try again later.';
          }
          console.log(err);
        });
      },
    },
  });

</script>
