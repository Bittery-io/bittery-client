<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false">
    <q-card class="bg-orange-8">
      <q-card-section>
        <div class="row justify-center">
          <div class="col-auto text-white">
            <q-icon size="xl" name="mdi-bitcoin" color="white"/>
          </div>
        </div>
        <div class="row justify-center q-pt-xs">
          <div class="col-auto items-center">
            <div class="text-h5 text-white text-center">
              Bitcoin Testnet
            </div>
            <div class="text-primary text-bold text-white text-center text-subtitle1">
              Bittery is currently running in Testnet mode. <br> Don't operate with your real mainnet Bitcoins!
            </div>
          </div>
        </div>
        <div class="row justify-center q-pt-md">
          <div class="col-auto">
            <q-btn outlined @click="close()" color="white" text-color="orange-8">Close</q-btn>
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

export default GlobalMixin.extend({
  name: 'TestnetPopup',
  components: {},
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    isAfterLogin: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  data() {
    return {
      showPopup: false,
    };
  },
  watch: {
    show() {
      this.showPopup = true;
    },
  },
  methods: {
    close() {
      this.showPopup = false;
      if (this.isAfterLogin) {
         this.$router.push('/payments/overview');
      }
    },
  },
});
</script>
