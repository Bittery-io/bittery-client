<template>
  <q-page>
    <div class="row items-center justify-center" :style="`height:${screenHeight - 50}px`">
      <div class="col-auto">
        <loader :show="showLoading"></loader>
        <setup-lnd-before-payments-required-popup :show="showPopup"></setup-lnd-before-payments-required-popup>
        <div class="row">
          <div class="col-12">
            <div class="text-center" :class="isMobile ? 'text-h3' : 'text-h2'">Welcome to <b>Bittery.io</b></div>
            <div class="text-center text-h5">
              We are glad that you joined. <br>
              We want enable everyone to accept <span class="text-bold text-orange-8">Bitcoin</span> payments easily.
              <br>
              Please start by setting your master password.
            </div>
          </div>
        </div>
        <div class="row justify-center q-pt-md">
          <div class="col-lg-8 col-xs-12 q-pa-xs">
            <clickable-route-card text="SET MASTER PASSWORD" route="/welcome/password"
                                  badge-text="Security"
                                  badge-icon="mdi-key">
            </clickable-route-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import ClickableRouteCard from 'components/utils/ClickableRouteCard.vue';
import WelcomeMixin from "../../mixins/welcome-mixin";
import SetupLndBeforePaymentsRequiredPopup from 'pages/payments/SetupLndBeforePaymentsRequiredPopup.vue';
import Loader from 'components/utils/Loader.vue';

export default WelcomeMixin.extend({
  name: 'WelcomeToBittery',
  components: { ClickableRouteCard, SetupLndBeforePaymentsRequiredPopup, Loader },
  data() {
    return {
      showPopup: false,
    };
  },
  mounted() {
  },
});
</script>
