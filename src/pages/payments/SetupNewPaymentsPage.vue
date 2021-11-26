<template>
  <q-page>
    <loader :show="showLoading"></loader>
    <setup-payments-not-possible-because-no-active-lnd-error-popup
      :show="showSetupPaymentsNotPossibleBecauseNoActiveLndErrorPopup">
    </setup-payments-not-possible-because-no-active-lnd-error-popup>
    <setup-lnd-before-payments-required-popup :show="showPopup"></setup-lnd-before-payments-required-popup>
    <init-ln-before-payments-required-popup :show="showInitLnPopup"></init-ln-before-payments-required-popup>
    <div class="row items-center justify-center text-center" :style="`height:${screenHeight - 50}px`" v-if="showFormBecauseUserHasLnd">
      <div class="col-auto">
        <div class="row">
          <div class="col-grow">
            <div class="text-center" :class="isMobile ? 'text-h3' : 'text-h2'">Setup payments
              <q-icon name="mdi-contactless-payment-circle"></q-icon>
            </div>
            <div class="text-center text-h5" style="margin-top: 1%;">Set your <b>store name</b> and initialize
              personal <span class="text-bold text-orange-8">Bitcoin</span> payment services.</div>
          </div>
        </div>
        <div class="row justify-center q-pt-md">
          <div class="col-auto justify-center">
            <setup-new-payments-form></setup-new-payments-form>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import GlobalMixin from "../../mixins/global-mixin";
import SetupNewPaymentsForm from 'components/payments/SetupNewPaymentsForm.vue';
import { get } from 'src/api/http-service';
import Loader from 'components/utils/Loader.vue';
import SetupPaymentsNotPossibleBecauseNoActiveLndErrorPopup
  from 'pages/payments/SetupPaymentsNotPossibleBecauseNoActiveLndErrorPopup.vue';
import SetupLndBeforePaymentsRequiredPopup from 'pages/payments/SetupLndBeforePaymentsRequiredPopup.vue';
import InitLnBeforePaymentsRequiredPopup from 'pages/payments/InitLnBeforePaymentsRequiredPopup.vue';

export default GlobalMixin.extend({
  name: 'SetupNewPaymentsPage',
  components: {
    InitLnBeforePaymentsRequiredPopup, SetupNewPaymentsForm, Loader, SetupPaymentsNotPossibleBecauseNoActiveLndErrorPopup,
    SetupLndBeforePaymentsRequiredPopup },
  data() {
    return {
      showLoading: false,
      showPopup: false,
      showInitLnPopup: false,
      showSetupPaymentsNotPossibleBecauseNoActiveLndErrorPopup: false,
      showFormBecauseUserHasLnd: false,
    };
  },
  mounted() {
    this.showLoading = true;
    get(this.$axios, '/api/lnd/user', async (res: any) => {
      await this.sleep(200);
      this.showLoading = false;
      // for inactive lnd also should not allow to setup payments
      if (res.data.activeUserLndDto === undefined) {
        await this.sleep(200);
        this.showSetupPaymentsNotPossibleBecauseNoActiveLndErrorPopup = true;
      }
      if (res.data.activeUserLndDto.lndStatus === 'INIT_REQUIRED') {
        await this.sleep(200);
        console.log('pizda');
        this.showInitLnPopup = true;
      }
      console.log('User lnd data: ', res.data);
      this.showFormBecauseUserHasLnd = true;
    }, async (err: any) => {
      console.log('User lnd get err: ', err);
      this.showLoading = false;
      await this.sleep(200);
      this.showPopup = true;
    });
  }
});
</script>
