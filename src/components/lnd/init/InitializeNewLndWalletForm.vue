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
        title="Generate 24 words mnemonic"
        icon="info"
        class="text-left"
        :done="step > 1">
        <div class="text-subtitle1 q-pb-xs">
          Generate 24 words mnemonic seed in order to anytime restore Lightning Network wallet.
        </div>
        <q-stepper-navigation>
          <q-btn @click="generateSeedMnemonic" color="primary" label="Generate seed mnemonic"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="2"
        title="Generate Bitcoin wallet"
        icon="info"
        class="text-left"
        :done="step > 2">
        <div class="text-subtitle1 q-pb-xs">
          Please Lightning Network 24 words seed mnemonic. Save it and keep private.
        </div>
        <div>
          <div class="q-gutter-md row items-start">
            <q-input
                     :value="seedMnemonicText"
                     outlined
                     bg-color="accent"
                     style="width: 100%"
                     type="textarea"
                     dense
                     onkeypress="return false;"/>
          </div>
        </div>
        <q-stepper-navigation>
          <q-btn outline @click="step = 1" color="primary" label="Previous step"/>
          <q-btn @click="generateBtcWallet" color="grey-7" label="Show mnemonic" class="q-ml-sm"/>
          <q-btn @click="step = 3" color="primary" v-show="seedMnemonicText" label="NEXT STEP" class="q-ml-sm"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="3"
        title="Define LN password"
        icon="info"
        class="text-left"
        :done="step > 3">
          Please provide Lightning Network password. This will be required to unlock Lightning Network node when needed.<br>
          <div class="row q-pt-xs">
            <div class="col-12">
              <q-input
                outlined
                square
                bg-color="accent"
                name="password"
                ref="password"
                v-model="lnPassword"
                label="LN Password"
                :type="isPwd ? 'password' : 'text'"
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
            </div>
          </div>
        <div class="row q-pt-xs">
          <div class="col-12">
            <q-input
              outlined
              square
              bg-color="accent"
              name="password"
              ref="password"
              v-model="lnPasswordRepeat"
              label="LN Password repeat"
              :type="isPwd ? 'password' : 'text'"
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
          </div>
        </div>
        <q-stepper-navigation>
          <q-btn outline @click="step = 2" color="primary" label="Previous step"/>
          <q-btn @click="step = 4" :disable="lnPassword !== '' && (lnPassword !== lnPasswordRepeat)" color="primary" label="Next step" class="q-ml-sm"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="4"
        title="Initialize Lightning Network node"
        icon="info"
        class="text-left"
        :done="step > 4">
        <div class="text-subtitle1 q-pb-xs">
          Initialize Lightning Network node <br>
          Please don't close the browser and wait until finish.
        </div>
        <q-stepper-navigation>
          <q-btn outline @click="step = 3" color="primary" label="Previous step"/>
          <q-btn @click="initializeLnd" icon="mdi-contactless-payment-circle" color="primary" label="Initialize LN node" class="q-ml-sm"/>
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
import { generateBitcoinWallet } from 'src/api/bitcoin-wallet-service';
import { CreateUserBtcpayDto } from 'src/dto/create-user-btcpay-dto';
import { showNotificationInfo } from 'src/api/notificatios-api';
import { BitcoinWallet } from 'src/model/bitcoin-wallet';
import { LndInitWalletDto } from 'src/dto/lnd/lnd-init-wallet-dto';

export default GlobalMixin.extend({
  name: 'InitializeNewLndWalletForm',
  components: { ErrorPopup, Loader },
  data() {
    return {
      isPwd: true,
      bitcoinWallet: <BitcoinWallet> {},
      seedMnemonic: [],
      seedMnemonicText: '',
      seedMnemonicTextEncrypted: '',
      step: 1,
      errorBannerMessage: '',
      bitcoinLndCheckbox: true,
      userHasElectrum: false,
      electrumMasterPublicKey: '',
      lnPassword: '',
      lnPasswordRepeat: '',
    };
  },
  mounted() {
    if (this.$route.query.electrum && this.$route.query.electrum === 'true') {
      this.userHasElectrum = true;
    }
  },
  methods: {
    generateSeedMnemonic() {
      this.showLoading = true;
      setTimeout((() => {
        get(this.$axios, `/api/lnd/${this.$route.params.lndId}/seed`, (res: any) => {
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
      const lndInitWalletDto: LndInitWalletDto = new LndInitWalletDto(this.lnPassword, this.seedMnemonic);
      post(this.$axios, `/api/lnd/${this.$route.params.lndId}/initwallet`, lndInitWalletDto, async () => {
        this.showLoading = false;
        await this.sleep(200); // small sleep required
        showNotificationInfo('LN init succeed', 'Your personal Lightning Network is not initialized');
        await this.$router.push('/bitcoin/overview');
      }, (err: any) => {
        this.showLoading = false;
        this.errorBannerMessage = 'Internal server error occurred. Please try again later.';
        console.log(err);
      });
    },
  },
});

</script>
