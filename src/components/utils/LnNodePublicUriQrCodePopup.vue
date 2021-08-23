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
          <div class="col-auto justify-center">
            <div class="text-bold text-primary text-center" :class="isMobile ? 'text-h6' : 'text-h5'">
              LN Node URI QR Code
            </div>
            <div class="text-bold text-primary text-center text-subtitle2">
              This is QR code of your public node URI address. <br>
              Can be used/shared for opening channel to your node.
            </div>
            </div>
          </div>
        <div class="row justify-center q-pt-xs">
          <div class="col-auto justify-center">
            <qr-code
              class="q-mt-xs"
              :width="500"
              :height="500"
              id="big-qr-code-ln-node-public-uri"
              :text="qrCode"
              :min-width="200"
              :min-height="200"></qr-code>
          </div>
        </div>
        <div class="row justify-center q-pt-md">
          <div class="col-auto text-primary">
            <q-btn glossy @click="close()" color="primary">Close</q-btn>
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
    name: 'LnNodePublicUriQrCodePopup',
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
