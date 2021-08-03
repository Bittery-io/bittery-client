<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false" :position="isMobile ? 'bottom' : 'standard'">
    <q-card class="bg-grey-2">
      <q-card-section>
        <div class="row justify-center">
          <div class="col-auto text-primary">
            <q-icon size="xl" name="mdi-qrcode" color="primary"/>
          </div>
        </div>
        <div class="row justify-center q-pt-xs">
          <div class="col-auto items-center">
            <div class="text-bold text-primary text-center" :class="isMobile ? 'text-h6' : 'text-h5'">
              {{header}}
            </div>
            <qr-code class="q-mt-xs" :width="500" :height="500" id="big-qr-code" :text="qrCode"></qr-code>
          </div>
        </div>
        <div class="row justify-center q-pt-md">
          <div class="col-auto text-primary">
            <q-btn @click="close()" color="primary">Close</q-btn>
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
  import QrCode from 'components/utils/QrCode.vue';
  export default Vue.extend({
    name: 'QrCodePopup',
    components: { QrCode },
    props: {
      show: {
        type: Boolean,
        required: true,
      },
      qrCode: {
        type: String,
        required: false,
        default: '',
      },
    },
    data() {
      return {
        showPopup: false,
        header: 'LN Node connect Qr Code',
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
      },
    },
  });
</script>
