<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false" :position="isMobile ? 'bottom' : 'standard'">
    <q-card class="bg-grey-2">
      <q-card-section>
        <div class="row justify-center">
          <div class="col-auto text-primary">
            <q-icon size="xl" name="mdi-shield-alert" color="red"/>
          </div>
        </div>
        <div class="row justify-center q-pt-xs">
          <div class="col-auto items-center">
            <div class="text-bold text-primary text-center" :class="isMobile ? 'text-h6' : 'text-h5'">
              Payments cannot be setup
            </div>
            <div class="text-primary text-primary text-center text-subtitle2">
              Payments setup is not possible because your subscription is expired. Please renew your subscription first.
            </div>
          </div>
        </div>
        <div class="row justify-center q-pt-md">
          <div class="col-auto text-primary">
            <q-btn glossy outlined @click="closeAndGoToAccount()" color="red">RENEW SUBSCRIPTION</q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style>
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SetupPaymentsNotPossibleBecauseNoActiveLndErrorPopup',
  components: {},
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      showPopup: false,
    };
  },
  watch: {
    show() {
      this.showPopup = this.show;
    },
  },
  methods: {
    closeAndGoToAccount() {
      this.showPopup = false;
      this.$router.push('/account');
    },
  },
});
</script>
