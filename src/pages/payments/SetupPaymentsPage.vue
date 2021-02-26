<template>
  <q-page padding>
    <loader :show="showLoading"></loader>
    <setup-lnd-before-payments-required-popup :show="showPopup"></setup-lnd-before-payments-required-popup>
    <div :class="{ 'fixed-center': !$q.platform.is.mobile }">
      <div class="row justify-center">
        <div class="col-lg-12">
          <h2 class="text-center" style="margin-bottom: 0;">Setup payments <q-icon name="mdi-contactless-payment-circle"></q-icon></h2>
          <h5 class="text-center" style="margin-top: 1%;">Initialize BTCPay based services and <span class="text-bold">start accepting</span> <span class="text-bold text-orange-8"> Bitcoin</span> payments</h5>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-lg-6 col-xs-12 q-pa-xs">
          <clickable-route-card text="I have Electrum Bitcoin wallet" route="/payments/setup/new?electrum=true"
                                badge-text="Recommended" badge-icon="mdi-check-bold"></clickable-route-card>
        </div>
        <div class="col-lg-6 col-xs-12 q-pa-xs">
          <clickable-route-card text="I don't have Electrum Bitcoin wallet" route="/payments/setup/new"></clickable-route-card>
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
      <div class="row q-pt-md justify-center">
        <div class="col-auto">
          <a target="_blank" href='https://btcpayserver.org/'>
            <q-chip clickable class="shadow-10" icon="info" color="grey-8" text-color="white">
              BTCPay https://btcpayserver.org/
            </q-chip>
          </a>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
  import ClickableRouteCard from 'components/utils/ClickableRouteCard.vue';
  import GlobalMixin from "../../mixins/global-mixin";
  import { get } from 'src/api/http-service';
  import SetupLndBeforePaymentsRequiredPopup from 'pages/payments/SetupLndBeforePaymentsRequiredPopup.vue';
  import Loader from 'components/utils/Loader.vue';
  import { getPasswordProof } from 'src/api/session-service';
  export default GlobalMixin.extend({
    name: 'SetupPaymentsPage',
    components: { ClickableRouteCard, SetupLndBeforePaymentsRequiredPopup, Loader },
    data() {
      return {
        showPopup: false,
      };
    },
    mounted() {
      this.showLoading = true;
      get(this.$axios, '/api/lnd/user', async (res: any) => {
        await this.sleep(200);
        this.showLoading = false;
        console.log('User lnd data: ', res.data);
      }, async (err: any) => {
        console.log('User lnd get err: ', err);
        get(this.$axios, '/api/lnd/custom', async (res: any) => {
          await this.sleep(200);
          this.showLoading = false;
          console.log('Custom lnd data: ', res.data);
        }, async (err: any) => {
          console.log('Custom lnd get err: ', err);
          await this.sleep(200);
          this.showLoading = false;
          await this.sleep(200);
          this.showPopup = true;
        });
      });
    },
  });
</script>
