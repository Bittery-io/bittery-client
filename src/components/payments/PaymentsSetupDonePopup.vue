<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false" :position="isMobile ? 'bottom' : 'standard'">
    <loader :show="showLoading"></loader>
    <q-card class="bg-primary text-white">
      <q-card-section>
        <div class="row justify-center">
          <div class="col-auto">
            <q-icon size="xl" name="mdi-bitcoin" color="orange"/>
          </div>
        </div>
        <div class="row justify-center q-pt-xs">
          <div class="col-auto items-center">
            <div class="text-bold text-center" :class="isMobile ? 'text-h6' : 'text-h5'">
              Payments setup finished
            </div>
            <div class="text-center text-subtitle2 q-pt-xs">
              Now you are now ready to accept <span class="text-orange-8">Bitcoin</span> payments.<br>
              Feel free to create your first payment invoice.<br>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center" class="text-primary">
        <q-btn glossy outline @click="close()" text-color="white">Close</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style>
</style>

<script lang="ts">

import GlobalMixin from 'src/mixins/global-mixin';
import Loader from 'components/utils/Loader.vue';

export default GlobalMixin.extend({
  name: 'PaymentsSetupDonePopup',
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
      this.$router.push('/payments/overview');
    },
  },
});
</script>
