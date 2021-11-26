<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false" :position="isMobile ? 'bottom' : 'standard'">
    <q-card class="bg-grey-2">
      <q-card-section>
        <div class="row justify-center">
          <div class="col-auto text-primary">
            <q-icon size="xl" name="mdi-flash-red-eye" color="primary"/>
          </div>
        </div>
        <div class="row justify-center q-pt-xs">
          <div class="col-auto items-center">
            <div class="text-primary text-center" :class="isMobile ? 'text-h6' : 'text-h5'">
              Lightning Network node init required
            </div>
            <div class="text-primary text-center text-subtitle2">
              Your node is created but it must be yet initialized <br> before Bitcoin payments can be setup.
            </div>
          </div>
        </div>
        <div class="row justify-center q-pt-md">
          <div class="col-auto">
            <q-btn glossy @click="close()" color="primary" text-color="white">INIT LN NODE</q-btn>
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
  name: 'InitLnBeforePaymentsRequiredPopup',
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
      this.showPopup = true;
    },
  },
  methods: {
    close() {
      this.showPopup = false;
      this.$router.push('/ln/overview');
    },
  },
});
</script>
