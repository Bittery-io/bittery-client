<template>
  <q-page padding>
    <setup-new-payments-popup :show="showPopup" :user-has-electrum="userHasElectrum"></setup-new-payments-popup>
    <div class="text-center" :class="{ 'fixed-center': !$q.platform.is.mobile }" >
      <div class="row">
        <div class="col-grow">
          <h2 class="text-center" style="margin-bottom: 0;">Setup payments <q-icon name="mdi-contactless-payment-circle"></q-icon></h2>
          <h5 v-if="userHasElectrum" class="text-center" style="margin-top: 1%;">Provide your <b>Electrum wallet</b> information and initialize your personal <span class="text-bold text-orange-8">Bitcoin</span> payment services.</h5>
          <h5 v-else class="text-center" style="margin-top: 1%;">Create <b>standard wallet</b> and initialize your personal <span class="text-bold text-orange-8">Bitcoin</span> payment services.</h5>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-auto justify-center">
          <setup-new-payments-form :user-has-electrum="userHasElectrum"></setup-new-payments-form>
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
      this.showPopup= true;
      if (this.$route.query.electrum && this.$route.query.electrum === 'true') {
        this.userHasElectrum = true;
      }
    }
  });
</script>
