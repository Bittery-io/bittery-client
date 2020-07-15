<template>
  <div class="q-pa-xs">
    <loader :show="showLoading"></loader>
    <error-popup header="BTCPay setup failed"
                 :error-message="errorBannerMessage"
                 :show="errorBannerMessage !== ''">
    </error-popup>
    <q-stepper
      v-model="step"
      bordered
      class="bg-grey-2"
      vertical
      :style="$q.platform.is.mobile ? `width: ${screenWidth * 0.93}px` : `width: ${screenWidth * 0.35}px`"
      color="primary"
      animated>
      <q-step
        :name="1"
        title="Accepted payments methods"
        icon="info"
        class="text-left"
        :done="step > 1">
        <div class="text-subtitle1 q-pb-xs">
          You will be able to accept selected payment methods:
        </div>
        <q-checkbox v-model="bitcoinLndCheckbox" :disable="bitcoinLndCheckbox" label="Lightning Network payments">
          <q-badge class="q-ml-xs">Fast and low-cost</q-badge>
        </q-checkbox> <br>
        <q-checkbox v-model="bitcoinLndCheckbox" :disable="bitcoinLndCheckbox" label="Standard Bitcoin payments" >
          <q-badge class="q-ml-xs">Based on standard Bitcoin transactions</q-badge>
        </q-checkbox> <br>
        <q-stepper-navigation>
          <q-btn @click="step = 2" color="primary" label="Next step"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        v-if="userHasElectrum"
        :name="2"
        title="Provide Electrum Master Public Key"
        icon="info"
        class="text-left text-subtitle1"
        :done="step > 2">
        Please provide your Electrum Wallet Master Public Key (can be found under <span class="text-italic">Wallet->Information)</span>. <br>
        <span class="text-bold">Bittery will not have access to the funds under your wallet, all your private keys stay safe and private. </span>
        <div class="row q-pt-xs">
          <div class="col-12">
            <q-input
              outlined
              bg-color="accent"
              type="string"
              name="electrumMasterPublicKey"
              square
              v-model="electrumMasterPublicKey"
              label="Master Public Key value">
            </q-input>
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
        title="Generate Bitcoin wallet"
        icon="info"
        class="text-left"
        :done="step > 2">
        <div class="text-subtitle1 q-pb-xs">
          Generate new BIP-39 Bitcoin seed which will be used to generate your Bitcoin wallet.
        </div>
        <q-banner v-show="!bitcoinWallet.seed" class="text-grey-2 text-bold bg-red q-mb-xs">
          <template v-slot:avatar>
            <q-icon name="error" color="white" />
          </template>
          Generation process will be done only in the browser. Seed and private keys will not leave the browser.
        </q-banner>
        <q-banner rounded v-show="bitcoinWallet.seed" class="text-white text-bold bg-primary">
          <q-icon name="info" size="lg" color="white" />
          Your Bitcoin wallet seed (BIP-39). Save it and keep private.
          <q-input
            outlined
            class="q-mt-xs"
            bg-color="grey-3"
            type="text"
            onkeypress="return false;"
            square
            :value="bitcoinWallet.seed"
            label="Your seed (12 words)">
          </q-input>
          <div class="text-bold text-red q-pt-xs text-subtitle1" v-show="bitcoinWallet.seed">
            REMEMBER: LOOSING THE SEED EQUALS LOOSING BITCOIN!
          </div>
        </q-banner>
        <q-stepper-navigation>
          <q-btn outline @click="step = 1" color="primary" label="Previous step"/>
          <q-btn @click="generateBtcWallet" color="grey-7" :label="bitcoinWallet.seed ? 'Regenerate' : 'Generate'" class="q-ml-sm"/>
          <q-btn @click="step = 3" color="primary" v-show="bitcoinWallet.seed" label="NEXT STEP" class="q-ml-sm"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="3"
        title="Define payment infrastructure"
        icon="info"
        class="text-left"
        :done="step > 3">
        <div class="text-subtitle1 q-pb-xs">
          Selected Bitcoin services will be used to setup your personal payments infrastructure:
        </div>
        <q-checkbox v-model="bitcoinLndCheckbox" :disable="bitcoinLndCheckbox" label="User LND Node" >
          <q-badge class="q-ml-xs">for Lightning Network payments</q-badge>
        </q-checkbox> <br>
        <q-checkbox v-if="userHasElectrum" v-model="bitcoinLndCheckbox" :disable="bitcoinLndCheckbox" label="Electrum based Bitcoin wallet">
          <q-badge class="q-ml-xs">for Standard Bitcoin payments</q-badge>
          <q-badge color="grey-10" class="q-ml-xs">New addresses will be generated based on public key</q-badge>
        </q-checkbox>
        <q-checkbox v-else v-model="bitcoinLndCheckbox" :disable="bitcoinLndCheckbox" label="New Bitcoin wallet">
          <q-badge class="q-ml-xs">for Standard Bitcoin payments</q-badge>
          <q-badge color="grey-10" class="q-ml-xs">Wallet will be generated automatically</q-badge>
        </q-checkbox> <br>
        <q-stepper-navigation>
          <q-btn outline @click="step = 2" color="primary" label="Previous step"/>
          <q-btn @click="step = 4" color="primary" label="Next step" class="q-ml-sm"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="4"
        title="Initialize payment services"
        icon="info"
        class="text-left"
        :done="step > 4">
        <div class="text-subtitle1 q-pb-xs">
          Initializing your personal Bitcoin payments services can take up to 30 seconds. <br>
          Please don't close the browser and wait until finish.
        </div>
        <q-stepper-navigation>
          <q-btn outline @click="step = 3" color="primary" label="Previous step"/>
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

  export default GlobalMixin.extend({
    name: 'SetupNewPayments',
    components: { ErrorPopup, Loader },
    data() {
      return {
        bitcoinWallet: <BitcoinWallet> {},
        step: 1,
        errorBannerMessage: '',
        bitcoinLndCheckbox: true,
        userHasElectrum: false,
        electrumMasterPublicKey: '',
      };
    },
    mounted() {
      if (this.$route.query.electrum && this.$route.query.electrum === 'true') {
        this.userHasElectrum = true;
      }
    },
    methods: {
      generateBtcWallet() {
        this.showLoading = true;
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
