<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false" :position="isMobile ? 'bottom' : 'standard'">
    <q-card class="bg-grey-2" :style="isMobile ? '' : 'width: 50% !important'">
      <q-card-section>
        <div class="row justify-center">
          <div class="col-auto text-primary">
            <q-icon size="xl" name="mdi-contactless-payment" color="primary"/>
          </div>
        </div>
        <div class="row justify-center q-pt-xs">
          <div class="col-12 justify-center items-center">
            <div class="text-primary text-bold text-center" :class="isMobile ? 'text-h6' : 'text-h5'">
              <span class="vertical-middle">Share payment widget</span>
            </div>
            <div class="text-primary text-center text-subtitle2 q-pt-xs">
              <div class="text-center">Invoice ID: <span class="text-bold">{{invoiceId}}</span></div><br>
              This sharable link below allows anybody to access your payment widget.
            </div>
            <q-input
              class="q-pt-md my-accent-input"
              dense
              id="paymentWidgetUrlInput"
              type="text"
              onkeypress="return false;"
              name="email"
              square
              :value="this.paymentWidgetPublicUrl"
              label="Payment widget URL">
              <template v-slot:before>
                <q-icon style="width:50px;" color="primary" name="mdi-link-variant" />
              </template>
              <template v-slot:after>
                <q-btn outline glossy dense color="primary" icon="mdi-content-copy" @click="copyToClipboard"/>
                <q-btn dense glossy color="primary" icon="mdi-open-in-new" @click="openPayInvoiceInNewTab(invoiceId)"/>
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center" class="text-primary">
        <q-btn glossy color="primary" @click="close()" text-color="white">Close</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style>
</style>

<script lang="ts">

import { showNotificationInfo } from 'src/api/notificatios-api';
import Loader from 'components/utils/Loader.vue';
import ProvideMasterPasswordPopup from 'components/welcome/ProvideMasterPasswordPopup.vue';
import WalletSeedPopup from 'components/dashboard/WalletSeedPopup.vue';
import { copyToClipboard } from 'quasar'
import InvoicesMixin from '../../mixins/invoices-mixin';

export default InvoicesMixin.extend({
  name: 'ShareInvoicePaymentWidgetPopup',
  components: { WalletSeedPopup, ProvideMasterPasswordPopup, Loader },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    invoiceId: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      showPopup: false,
      showLoading: false,
      paymentWidgetPublicUrl: '',
    };
  },
  mounted() {
    this.calculateLink();
  },
  watch: {
    invoiceId() {
      this.calculateLink();
    },
    show() {
      this.showPopup = true;
    },
  },
  methods: {
    calculateLink() {
      this.paymentWidgetPublicUrl = `${process.env.CLIENT_URL}/invoices/${this.invoiceId}`;
    },
    async copyToClipboard() {
      await copyToClipboard(this.paymentWidgetPublicUrl);
      showNotificationInfo('Successfully copied', 'Payment widget URL copied to clipboard')
    },
    close() {
      this.showPopup = false;
    },
  },
});
</script>
