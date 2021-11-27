<template>
  <div class="q-pa-xs">
    <loader :show="showLoading"></loader>
    <error-popup header="Payments setup failed"
                 :error-message="errorBannerMessage"
                 :show="errorBannerMessage !== ''">
    </error-popup>
    <provide-master-password-popup
        :show="showMasterPasswordPopup"
        subheader="Password will be used for payments related data encryption"
        @passwordConfirmed="onMasterPasswordConfirmed">
    </provide-master-password-popup>
    <payments-setup-done-popup :show="showPaymentsSetupDonePopup"></payments-setup-done-popup>
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
        title="Set your store name"
        icon="mdi-store"
        class="text-left"
        :done="step > 1">
        <div class="text-body1 q-pb-md">
          Provide your <b>store name</b>. It should be a short description of your service. The name will be visible on
          payment widgets (like on a preview below) and PDF invoices.
        </div>
        <div class="row items-center justify-center">
          <div class="col-lg-5 col-xs-auto q-pa-xs">
            <q-img src="statics/store-name.png" class="shadow-8" style="max-width:300px; min-width:200px; height:100%;">
            </q-img>
          </div>
          <div class="col-lg-7 col-xs-12 q-pa-xs">
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
                  :rules="[ val => (storeNameState.storeName !== undefined && storeNameState.storeName.$valid && storeName.trim().length > 0) || 'Store name is required - it is visible in payment widgets like in the preview.']"
                  type='text'>
                  <template v-slot:prepend>
                    <q-icon color="primary" name="mdi-store"/>
                  </template>
                </q-input>
              </validate>
            </vue-form>
          </div>
        </div>
        <div class="row justify-center q-pt-md">
          <q-btn glossy @click="generateBtcWallet"
                 :disable="storeNameState.storeName !== undefined && !storeNameState.storeName.$valid"
                 color="primary" label="Initialize payments"
                 :class="isMobile ? 'full-width q-mt-xs' : 'q-ml-sm'" icon-right="mdi-contactless-payment-circle"/>
        </div>
      </q-step>
    </q-stepper>
  </div>
</template>

<script lang="ts">
import GlobalMixin from "../../mixins/global-mixin";
import ErrorPopup from 'components/utils/ErrorPopup.vue';
import { post } from 'src/api/http-service';
import { generateBitcoinWallet } from 'src/api/bitcoin-wallet-service';
import { CreateUserBtcpayDto } from 'src/dto/create-user-btcpay-dto';
import { showNotificationInfo } from 'src/api/notificatios-api';
import { BitcoinWallet } from 'src/model/bitcoin-wallet';
import WarningInfoBanner from 'components/utils/WarningInfoBanner.vue';
import ProvideMasterPasswordPopup from 'components/welcome/ProvideMasterPasswordPopup.vue';
import { encryptSymmetricCtr } from 'src/api/encryption-service';
import Loader from 'components/utils/Loader.vue';
import PaymentsSetupDonePopup from 'components/payments/PaymentsSetupDonePopup.vue';

export default GlobalMixin.extend({
    name: 'SetupNewPayments',
    components: { PaymentsSetupDonePopup, ProvideMasterPasswordPopup, WarningInfoBanner, ErrorPopup, Loader },
    data() {
      return {
        storeNameState: {},
        storeName: '',
        bitcoinWallet: <BitcoinWallet> {},
        step: 1,
        errorBannerMessage: '',
        isMnemonicPwd: true,
        masterPassword: '',
        showMasterPasswordPopup: false,
        showLoading: false,
        showPaymentsSetupDonePopup: false,
      };
    },
    methods: {
      onMasterPasswordConfirmed(masterPassword: string) {
        showNotificationInfo('Components successfully encrypted', 'The data were securely encrypted with your master password');
        this.masterPassword = masterPassword;
        this.setupNewBtcpayServices();
      },
      generateBtcWallet() {
        this.masterPassword = '';
        this.showLoading = true;
        this.isMnemonicPwd = true;
        setTimeout((() => {
          this.bitcoinWallet = generateBitcoinWallet();
          this.showLoading = false;
          this.showMasterPasswordPopup = !this.showMasterPasswordPopup;
        }), 500);
      },
      setupNewBtcpayServices() {
        this.errorBannerMessage = '';
        this.showLoading = true;
        let createUserBtcpayDto: CreateUserBtcpayDto;
        createUserBtcpayDto = new CreateUserBtcpayDto(
          this.storeName,
          this.bitcoinWallet.rootPublicKey,
          encryptSymmetricCtr(this.bitcoinWallet.seed, this.masterPassword),
          undefined);
        post(this.$axios, '/api/btcpay', createUserBtcpayDto, async () => {
          this.showLoading = false;
          await this.sleep(200); // small sleep required
          this.showPaymentsSetupDonePopup = true;
        }, (err: any) => {
          this.showLoading = false;
          this.errorBannerMessage = 'Setup payments failed. Internal server error. Please try again later.';
          console.log(err);
        });
      },
    },
  });

</script>
