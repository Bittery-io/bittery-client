<template>
  <div class="q-pa-xs">
    <loader :show="showLoading"></loader>
    <error-popup header="Payments setup failed"
                 :error-message="errorBannerMessage"
                 :show="errorBannerMessage !== ''">
    </error-popup>
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
        title="Accepted payments methods"
        icon="info"
        class="text-left"
        :done="step > 1">
        <div class="text-body1 q-pb-xs">
          You will be able to receive Bitcoin payments:
        </div>
        <q-checkbox :value="bitcoinLndCheckbox" label="off-chain (fast and cheap) via Lightning Network" >
          <q-badge class="q-ml-xs">payments go to LN Node wallet</q-badge>
        </q-checkbox> <br>
        <q-checkbox :value="bitcoinLndCheckbox" label="on-chain (blockchain transactions)">
          <q-badge class="q-ml-xs" v-if="userHasElectrum">payments go to your Electrum wallet</q-badge>
          <q-badge class="q-ml-xs" v-else>payments go to standard wallet</q-badge>
        </q-checkbox>
        <q-stepper-navigation>
          <q-btn @click="step = 2;bitcoinWallet.seed = ''" color="primary" label="Next step"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        v-if="userHasElectrum"
        :name="2"
        title="Provide Electrum Master Public Key"
        icon="info"
        class="text-left text-body1"
        :done="step > 2">
        Please provide your Electrum Wallet Master Public Key (can be found under <span class="text-italic">Wallet->Information)</span>. <br>
        <warning-info-banner text="Bittery cannot move funds under your Electrum wallet. All your private keys stay safe and private."></warning-info-banner>
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
          <q-btn outline @click="step = 1" color="primary" label="Previous step"/>
          <q-btn @click="step = 3" color="primary" :disabled="electrumMasterPublicKey === ''" label="NEXT STEP" class="q-ml-sm"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        v-else
        :name="2"
        title="Generate Bitcoin standard wallet seed"
        icon="info"
        class="text-left"
        :done="step > 2">
        <div class="text-body1 q-pb-xs">
          Generate new <b>BIP-39</b> Bitcoin seed which will be used to create your Bitcoin standard wallet.<br>
          The seed can be easily imported by most open-source Bitcoin wallets (e.g. Electrum wallet).<br>
          <span class="text-bold">Bittery will not be able to move funds of this wallet.</span>
        </div>
        <warning-info-banner v-show="!bitcoinWallet.seed"
                             text="Generation process will be done only in the browser. Seed and private keys will not leave the browser.">
        </warning-info-banner>
        <q-banner rounded v-show="bitcoinWallet.seed" class="text-white text-bold bg-primary">
          <q-icon name="info" size="lg" color="white" />
          Your Bitcoin standard wallet seed (BIP-39). Save it and keep private.
          <q-input
            outlined
            class="q-mt-xs"
            bg-color="grey-3"
            :type="isMnemonicPwd ? 'password' : 'text'"
            onkeypress="return false;"
            square
            :value="bitcoinWallet.seed"
            label="Your seed (12 words)">
            <template v-slot:prepend>
              <q-icon color="primary" name="mdi-format-list-numbered-rtl"/>
            </template>
          </q-input>
          <div class="text-bold text-red q-pt-xs text-body1" v-show="bitcoinWallet.seed">
            REMEMBER: LOOSING THE SEED EQUALS LOOSING BITCOIN!
          </div>
        </q-banner>
        <q-stepper-navigation>
          <q-btn outline @click="step = 1" color="primary" label="Previous step"/>
          <q-btn v-show="bitcoinWallet.seed"  @click="isMnemonicPwd = !isMnemonicPwd" color="grey-7"
                 :label="isMnemonicPwd ? 'Show mnemonic' : 'Hide mnemonic'"
                 :icon="isMnemonicPwd ? 'mdi-eye' : 'mdi-eye-off'" class="q-ml-sm"/>
          <q-btn @click="generateBtcWallet" color="grey-7" :label="bitcoinWallet.seed ? 'Regenerate' : 'Generate'" class="q-ml-sm"/>
          <q-btn @click="step = 3;seedMnemonicConfirmationText=''" color="primary" v-show="bitcoinWallet.seed" label="NEXT STEP" class="q-ml-sm"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        v-if="!userHasElectrum"
        :name="3"
        title="Confirm seed"
        icon="info"
        class="text-left"
        :done="step > 3">
        <div class="text-body1 q-pb-md">
          Please provide your 12 words mnemonic seed in order to confirm you saved your Bitcoin standard wallet seed correctly.
        </div>
        <div class="row">
          <div class="col-12">
            <vue-form :state='bipSeedState' @submit.prevent="() => {}">
              <validate>
                <q-input
                  v-model="seedMnemonicConfirmationText"
                  outlined
                  square
                  name="seedMnemonicConfirmationText"
                  ref="seedMnemonicConfirmationText"
                  bg-color="accent"
                  label="12 words mnemonic seed"
                  required
                  :rules="[ val => (
                              bipSeedState.seedMnemonicConfirmationText !== undefined &&
                              bipSeedState.seedMnemonicConfirmationText.$valid) || 'Please confirm your 12 words mnemonic seed',
                              val => (bitcoinWallet.seed && bitcoinWallet.seed.trim() === seedMnemonicConfirmationText.trim()) || 'Given mnemonic seed does not match generated!']"
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
                 :disable="bitcoinWallet.seed && bitcoinWallet.seed.trim() !== seedMnemonicConfirmationText.trim()"
                 label="NEXT STEP" class="q-ml-sm"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="userHasElectrum? 3 : 4"
        title="Initialize payment services"
        icon="info"
        class="text-left"
        :done="userHasElectrum? (step > 3) : (step > 4)">
        <div class="text-body1 q-pb-xs">
          Please assure you saved your mnemonic correctly. <br>
          Initializing your personal Bitcoin payments services can take up to 30 seconds. <br>
          Please don't close the browser and wait until finish.
        </div>
        <q-stepper-navigation>
          <q-btn outline @click="goToPreviousStep" color="primary" label="Previous step"/>
          <q-btn @click="setupNewBtcpayServices" icon="mdi-contactless-payment-circle" color="primary" label="Initialize Payments" class="q-ml-sm"/>
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

  export default GlobalMixin.extend({
    name: 'SetupNewPayments',
    components: { WarningInfoBanner, ErrorPopup, Loader },
    props: {
      userHasElectrum: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    data() {
      return {
        bipSeedState: {},
        seedMnemonicConfirmationText: '',
        electrumPublicKeyState: {},
        bitcoinWallet: <BitcoinWallet> {},
        step: 1,
        errorBannerMessage: '',
        bitcoinLndCheckbox: true,
        userHasElectrum: false,
        electrumMasterPublicKey: '',
        isMnemonicPwd: true,
      };
    },
    methods: {
      generateBtcWallet() {
        this.showLoading = true;
        setTimeout((() => {
          this.bitcoinWallet = generateBitcoinWallet();
          this.showLoading = false;
        }), 500);
      },
      goToPreviousStep() {
        if (this.userHasElectrum) {
          this.step = 2;
        } else {
          this.step = 3;
        }
      },
      setupNewBtcpayServices() {
        this.errorBannerMessage = '';
        this.showLoading = true;
        let createUserBtcpayDto: CreateUserBtcpayDto;
        if (this.userHasElectrum) {
          createUserBtcpayDto = new CreateUserBtcpayDto(undefined, this.electrumMasterPublicKey);
        } else {
          createUserBtcpayDto = new CreateUserBtcpayDto(this.bitcoinWallet.rootPublicKey, undefined);
        }
        post(this.$axios, '/api/btcpay', createUserBtcpayDto, async () => {
          this.showLoading = false;
          await this.sleep(200); // small sleep required
          showNotificationInfo('Payments services setup succeed', 'You are ready to create Bitcoin invoices');
          await this.$router.push('/payments/overview');
        }, (err: any) => {
          this.showLoading = false;
          this.errorBannerMessage = 'Internal server error occurred. Please try again later.';
          console.log(err);
        });
      },
    },
  });

</script>
