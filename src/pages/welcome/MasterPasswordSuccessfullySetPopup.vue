<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false" :position="isMobile ? 'bottom' : 'standard'">
    <q-card class="bg-primary text-white">
      <q-card-section>
        <div class="row justify-center">
          <div class="col-auto">
            <q-icon size="xl" name="mdi-key-plus"/>
          </div>
        </div>
        <div class="row justify-center q-pt-xs">
          <div class="col-auto items-center">
            <div class="text-center text-bold" :class="isMobile ? 'text-h6' : 'text-h5'">
              Your master password is set
            </div>
            <div class="text-center text-subtitle2">
              <span class="text-red text-bold">Don't lose this password.</span><br>
              Now you are ready to start accepting Bitcoin payments with Bittery.
            </div>
          </div>
        </div>
        <div class="row justify-center q-pt-md">
          <div class="col-auto">
            <q-btn glossy @click="close()" text-color="white" outline>GOT IT</q-btn>
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
  name: 'MasterPasswordSuccessfullySetPopup',
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
      this.$router.go();
    },
  },
});
</script>
