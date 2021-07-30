<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false">
    <q-card>
      <q-card-section>
        <div class="row justify-center">
          <div class="col-auto text-primary">
            <q-icon size="xl" name="mdi-contactless-payment" color="primary"/>
          </div>
        </div>
        <div class="row justify-center q-pt-xs">
          <div class="col-auto items-center">
            <div class="text-primary text-center" :class="isMobile ? 'text-h6' : 'text-h5'">
              Payments are required for dashboard
            </div>
            <div class="text-primary text-primary text-center text-body1">
              You must setup your payments before you can access the dashboard.
            </div>
          </div>
        </div>
        <div class="row justify-center q-pt-md">
          <div class="col-auto">
            <q-btn @click="closeAndGoToSetupPayments()" color="primary" text-color="white">SETUP PAYMENTS</q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style>
</style>

<script lang="ts">

import GlobalMixin from 'src/mixins/global-mixin';
import Loader from 'components/utils/Loader.vue';

export default GlobalMixin.extend({
  name: 'DashboardNotVisibleFirstSetupPaymentsPopup',
  components: { Loader },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      showPopup: false,
      showLoading: false,
      restartButtonDisabled: false,
      restartClicked: false,
    };
  },
  watch: {
    show() {
      this.showPopup = true;
    },
  },
  methods: {
    closeAndGoToSetupPayments() {
      this.showPopup = false;
      this.$router.push('/payments/setup');
    },
  },
});
</script>
