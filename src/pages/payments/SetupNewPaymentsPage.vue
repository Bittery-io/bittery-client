<template>
  <q-page>
    <div class="row items-center justify-center text-center" :style="`height:${screenHeight - 50}px`">
      <div class="col-auto">
        <setup-new-payments-popup :show="showPopup" :user-has-electrum="userHasElectrum"></setup-new-payments-popup>
        <div class="row">
          <div class="col-grow">
            <div class="text-center" :class="isMobile ? 'text-h3' : 'text-h2'">Setup payments
              <q-icon name="mdi-contactless-payment-circle"></q-icon>
            </div>
            <div v-if="userHasElectrum" class="text-center text-h5" style="margin-top: 1%;">Provide your <b>Electrum wallet</b>
              master public key details <br> and initialize your personal <span
                class="text-bold text-orange-8">Bitcoin</span> payment services.</div>
            <div v-else class="text-center text-h5" style="margin-top: 1%;">Create <b>standard wallet</b> and initialize your
              personal <span class="text-bold text-orange-8">Bitcoin</span> payment services.</div>
          </div>
        </div>
        <div class="row justify-center q-pt-md">
          <div class="col-auto justify-center">
            <setup-new-payments-form :user-has-electrum="userHasElectrum"></setup-new-payments-form>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import GlobalMixin from "../../mixins/global-mixin";
import SetupNewPaymentsForm from 'components/payments/SetupNewPaymentsForm.vue';
import SetupNewPaymentsPopup from 'components/payments/SetupNewPaymentsPopup.vue';

export default GlobalMixin.extend({
  name: 'SetupNewPaymentsPage',
  components: { SetupNewPaymentsPopup, SetupNewPaymentsForm },
  data() {
    return {
      showPopup: false,
      userHasElectrum: false,
    };
  },
  mounted() {
    this.showPopup = true;
    if (this.$route.query.electrum && this.$route.query.electrum === 'true') {
      this.userHasElectrum = true;
    }
  }
});
</script>
