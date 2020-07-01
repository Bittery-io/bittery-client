<template>
  <q-page>
    <div class="fixed-center">
      <div class="row justify-center">
        <div class="col-lg-12">
          <h2 class="text-center" style="margin-bottom: 0;">Setup payment services <q-icon name="mdi-contactless-payment-circle"></q-icon></h2>
          <h5 class="text-center" style="margin-top: 1%;">Initialize services and start accepting Bitcoin payments</h5>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-lg-6 col-xs-12 q-pa-xs">
          <clickable-route-card text="I have Electrum Bitcoin wallet" route="/"></clickable-route-card>
        </div>
        <div class="col-lg-6 col-xs-12 q-pa-xs">
          <clickable-route-card text="I don't have Electrum Bitcoin wallet" route="/payments/setup/new"></clickable-route-card>
        </div>
      </div>
      <div class="row q-pt-md justify-center">
        <div class="col-auto">
          <a target="_blank" href='https://electrum.org/#home'>
            <q-chip clickable class="shadow-10" icon="info" color="grey-8" text-color="white">
              Electrum Bitcoin Wallet https://electrum.org/#home
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

  export default GlobalMixin.extend({
    name: 'SetupPaymentsPage',
    components: { ClickableRouteCard },
    data() {
      return {
        step: 1,
      };
    },
  });
</script>
