<template>
  <div class="q-pa-xs">
    <loader :show="showLoading"></loader>
    <error-popup header="LND setup failed"
                 :error-message="errorBannerMessage"
                 :show="errorBannerMessage !== ''">
    </error-popup>
    <q-stepper
      v-model="step"
      vertical
      :style="$q.platform.is.mobile ? `width: ${screenWidth * 0.9}px` : `width: ${screenWidth * 0.35}px`"
      color="primary"
      animated>
      <q-step
        :name="1"
        title="Accepted payments methods"
        icon="info"
        class="text-left"
        :done="step > 1">
        You will be able to accept selected payment methods: <br>
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
        :name="2"
        title="Generate Bitcoin wallet"
        icon="info"
        class="text-left"
        :done="step > 2">
        Generate new BIP-39 Bitcoin seed which will be used to generate your Bitcoin wallet.
        <q-banner v-show="!bitcoinWallet.seed" class="text-grey-2 text-bold bg-red q-mt-xs q-mb-xs">
          <template v-slot:avatar>
            <q-icon name="error" color="white" />
          </template>
          Generation process will be done only in the browser. Seed and private keys will not leave the browser.
        </q-banner>
        <q-banner rounded v-show="bitcoinWallet.seed" class="text-white text-bold bg-primary q-mt-lg">
          <q-icon name="info" size="lg" color="white" />
          Your Bitcoin wallet seed (BIP-39). SAVE it and keep private.
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
          <span class="text-bold text-red" v-show="bitcoinWallet.seed">
            REMEMBER: LOOSING THE SEED EQUALS LOOSING BITCOIN!
          </span>
        </q-banner>
        <q-stepper-navigation>
          <q-btn outline @click="step = 1" color="primary" label="Previous step"/>
          <q-btn @click="generateBtcWallet" color="grey-7" :label="bitcoinWallet.seed ? 'Regenerate' : 'Generate'" class="q-ml-sm"/>
          <q-btn @click="step = 3" color="primary" v-show="bitcoinWallet.seed" label="NEXT STEP" class="q-ml-sm"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="3"
        title="Services to be used"
        icon="info"
        class="text-left"
        :done="step > 3">
        Selected Bitcoin services will be used to generate your personal payments service: <br>
        <q-checkbox v-model="bitcoinLndCheckbox" :disable="bitcoinLndCheckbox" label="User LND Node" >
          <q-badge class="q-ml-xs">for Lightning Network payments</q-badge>
        </q-checkbox> <br>
        <q-checkbox v-model="bitcoinLndCheckbox" :disable="bitcoinLndCheckbox" label="New Bitcoin wallet">
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
        The process can take up to 30 seconds. <br>
        Please don't close the browser and wait until it finish.
        <q-stepper-navigation>
          <q-btn outline @click="step = 3" color="primary" label="Previous step"/>
          <q-btn @click="setupNewBtcpayServices" color="primary" label="Initialize" class="q-ml-sm"/>
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

  export default GlobalMixin.extend({
    name: 'SetupNewPayments',
    components: { ErrorPopup, Loader },
    data() {
      return {
        step: 1,
        errorBannerMessage: '',
        bitcoinLndCheckbox: true,
        bitcoinWallet: {},
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
      setupNewBtcpayServices() {
        this.errorBannerMessage = '';
        this.showLoading = true;
        // @ts-ignore
        post(this.$axios, '/api/btcpay', new CreateUserBtcpayDto(this.bitcoinWallet.rootPublicKey), async () => {
          this.showLoading = false;
          await this.sleep(200); // small sleep required
          await this.$router.push('/payments/overview');
        }, (err: any) => {
          this.showLoading = false;
          this.errorBannerMessage = 'BTCPAY setup failed. Please try again later';
          console.log(err);
        });
      },
    },
  });

</script>
