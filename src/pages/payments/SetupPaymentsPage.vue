<template>
  <q-page>
    <div class="row items-center justify-center" :style="`height:${screenHeight - 50}px`">
      <div class="col-auto">
      <loader :show="showLoading"></loader>
        <setup-payments-not-possible-because-no-active-lnd-error-popup
          :show="showSetupPaymentsNotPossibleBecauseNoActiveLndErrorPopup">
        </setup-payments-not-possible-because-no-active-lnd-error-popup>
      <setup-lnd-before-payments-required-popup :show="showPopup"></setup-lnd-before-payments-required-popup>
        <div class="row justify-center">
          <div class="col-lg-12">
            <div class="text-center" :class="isMobile ? 'text-h3' : 'text-h2'">Setup payments <q-icon name="mdi-contactless-payment-circle"></q-icon></div>
            <div class="text-center text-h5">Initialize BTCPay based services and <span class="text-bold">start accepting</span> <span class="text-bold text-orange-8"> Bitcoin</span> payments</div>
          </div>
        </div>
        <div class="row justify-center">
          <div class="col-lg-6 col-xs-12 q-pa-xs">
            <clickable-route-card text="" route="/payments/setup/new"></clickable-route-card>
          </div>
        </div>
        <div class="row q-pt-md justify-center">
          <div class="col-auto">
            <a target="_blank" href='https://electrum.org/#home'>
              <q-chip clickable class="shadow-10" icon="info" color="grey-8" text-color="white">
                <span v-if="!$q.platform.is.mobile"> Electrum Bitcoin Wallet https://electrum.org/#home</span>
                <span v-else> Electrum Wallet https://electrum.org/#home</span>
              </q-chip>
            </a>
          </div>
        </div>
        <div class="row q-pt-xs justify-center">
          <div class="col-auto">
            <a target="_blank" href='https://btcpayserver.org/'>
              <q-chip clickable class="shadow-10" icon="info" color="grey-8" text-color="white">
                BTCPay https://btcpayserver.org/
              </q-chip>
            </a>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script lang="ts">
  import ClickableRouteCard from 'components/utils/ClickableRouteCard.vue';
  import GlobalMixin from "../../mixins/global-mixin";
  import { get } from 'src/api/http-service';
  import Loader from 'components/utils/Loader.vue';
  import ErrorPopup from 'components/utils/ErrorPopup.vue';
  import SetupPaymentsNotPossibleBecauseNoActiveLndErrorPopup
    from 'pages/payments/SetupPaymentsNotPossibleBecauseNoActiveLndErrorPopup.vue';
  import SetupLndBeforePaymentsRequiredPopup from 'pages/payments/SetupLndBeforePaymentsRequiredPopup.vue';
  export default GlobalMixin.extend({
    name: 'SetupPaymentsPage',
    components: { SetupLndBeforePaymentsRequiredPopup, SetupPaymentsNotPossibleBecauseNoActiveLndErrorPopup, ErrorPopup, ClickableRouteCard, Loader },
    data() {
      return {
        showPopup: false,
        showSetupPaymentsNotPossibleBecauseNoActiveLndErrorPopup: false,
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
        console.log('User lnd data: ', res.data);
      }, async (err: any) => {
        console.log('User lnd get err: ', err);
        this.showLoading = false;
        await this.sleep(200);
        this.showPopup = true;
      });
    },
  });
</script>
