<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false" :position="isMobile ? 'bottom' : 'standard'">
    <loader :show="showLoading" message="Bittery is loading"></loader>
<!--    <q-card class="bg-lime-4">-->
    <q-card class="bg-orange-4">
      <q-card-section>
        <div class="row justify-center">
          <div class="col-auto text-primary">
            <q-icon size="xl" name="mdi-bitcoin" color="primary"/>
          </div>
        </div>
        <div class="row justify-center q-pt-xs">
          <div class="col-auto items-center">
            <div class="text-h4 text-bold text-primary text-center q-pa-xs">
<!--              BETA MAINNET-->
              BETA TESTNET
            </div>
            <div class="text-primary text-bold text-primary text-center text-body1">
              Bittery is now beta version and uses Bitcoin Testnet Network. <br>
              Using Bittery please be aware that it's still under active development and uses experimental technology.<br>
            </div>
          </div>
        </div>
        <div class="row justify-center q-pt-md">
          <div class="col-auto">
            <q-btn glossy @click="close()" color="primary" text-color="white">I UNDERSTAND</q-btn>
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
import { getPasswordProof } from 'src/api/session-service';
import Loader from 'components/utils/Loader.vue';
import { sleep } from 'src/api/sleep-service';

export default GlobalMixin.extend({
  name: 'MainnetPopup',
  components: {Loader, },
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
    async close() {
      if (this.isAfterLogin) {
        this.showLoading = true;
        await sleep(1000);
        this.showLoading = false;
        await sleep(200);
        this.showPopup = false;
        if (getPasswordProof() === '') {
          console.log('No master password set, pushing to /welcome');
          await this.$router.push('/welcome');
        } else {
          await this.$router.push('/payments/overview');
        }
      } else {
        this.showPopup = false;
      }
    },
  },
});
</script>
