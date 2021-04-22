<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false">
    <loader :show="showLoading"></loader>
    <q-card class="bg-grey-2">
      <q-card-section>
        <div class="row justify-center">
          <div class="col-auto text-primary">
            <bittery-logo-animated></bittery-logo-animated>
          </div>
        </div>
        <div class="row justify-center q-pt-md">
          <div class="col-auto items-center">
            <div class="text-h5 text-primary text-bold text-center">
              Customize your Bittery subscription plan
            </div>
            <div class="text-subtitle1 text-primary text-center">
              Your plan: <b>LN NODE STANDARD 49.00 USD / month</b> <br>
              Current subscription ends: <b>{{paidToDateFormatted}}</b>
            </div>
          </div>
        </div>
        <div class="row items-center q-pt-md">
          <div class="col-12">
            <q-select square outlined bg-color="accent"
                      v-model="selectedSubscriptionPaymentOption"
                      :options="subscriptionPaymentOptions"
                      label="Subscription time">
              <template v-slot:prepend>
                <q-icon style="width:50px;" color="primary" name="mdi-calendar-clock"/>
              </template>
            </q-select>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12 col-xs-auto">
            <q-field label="Will be active to" stack-label borderless>
              <q-chip color="primary"
                      square
                      class="text-subtitle2"
                      style="margin-left: 0;"
                      text-color="white">
                {{ newPaidToDate }}
              </q-chip>
              <q-chip color="primary"
                      square
                      class="text-subtitle2"
                      outline
                      text-color="white">
                + {{selectedSubscriptionPaymentOption.value}} months
              </q-chip>
              <template v-slot:before>
                <q-icon style="width:50px; padding-top: 20%;" color="primary" size="md" name="mdi-calendar"/>
              </template>
              <q-tooltip>
                Your LN Node working status.
              </q-tooltip>
            </q-field>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-auto col-xs-auto">
            <q-field label="Total to pay" stack-label borderless>
              <q-chip color="primary"
                      class="text-subtitle2"
                      square
                      style="margin-left: 0;"
                      text-color="white">
                {{Number(49 * selectedSubscriptionPaymentOption.value *
                (selectedSubscriptionPaymentOption.discount ? selectedSubscriptionPaymentOption.discount: 1.0)).toFixed(2)}} USD
              </q-chip>
              <q-chip color="primary"
                      square
                      class="text-subtitle2"
                      outline
                      text-color="white">
                {{ ((1.0 - (selectedSubscriptionPaymentOption.discount ? selectedSubscriptionPaymentOption.discount : 1.0)) * 100).toFixed(0) }}% discount
              </q-chip>
              <template v-slot:before >
                <q-icon style="width:50px;padding-top:20%;" color="primary" size="md" name="mdi-cash-usd"/>
              </template>
            </q-field>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center" class="text-primary">
        <q-btn outline @click="close()" text-color="primary">Close</q-btn>
        <q-btn @click="extendSubscription()" color="primary">
          <q-icon left name="mdi-bitcoin" />
          Renew and pay
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style>
</style>

<script lang="ts">

import GlobalMixin from 'src/mixins/global-mixin';
import { get } from 'src/api/http-service';
import { showNotificationError, showNotificationInfo } from 'src/api/notificatios-api';
import Loader from 'components/utils/Loader.vue';
import { sleep } from 'src/api/sleep-service';
import BitteryLogo from 'components/utils/BitteryLogo.vue';
import BitteryLogoAnimated from 'components/utils/BitteryLogoAnimated.vue';
import { addMonthsToDate, formatOnlyDate } from 'src/api/date-service';

export default GlobalMixin.extend({
    name: 'SubscriptionPayPopup',
    components: { BitteryLogoAnimated, BitteryLogo, Loader },
    props: {
      show: {
        type: Boolean,
        required: true,
      },
      paidToDate: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        showPopup: false,
        showLoading: false,
        restartButtonDisabled: false,
        restartClicked: false,
        subscriptionPaymentOptions: [
          {label: '1 month', value: 1},
          {label: '2 months', value: 2},
          {label: '3 months (-5%)', value: 3, discount: 0.95},
          {label: '4 months', value: 4},
          {label: '5 months', value: 5},
          {label: '6 months (-10%)', value: 6, discount: 0.9},
          {label: '7 months', value: 7},
          {label: '8 months', value: 8},
          {label: '9 months', value: 9},
          {label: '10 months', value: 10},
          {label: '11 months', value: 11},
          {label: '12 months (-20%)', value: 12, discount: 0.8},
        ],
        selectedSubscriptionPaymentOption: {label: '3 months (-5%)', value: 3, discount: 0.95 },
      };
    },
    watch: {
      show() {
        this.showPopup = true;
        this.restartClicked = false;
      },
    },
    computed: {
      newPaidToDate() {
        return formatOnlyDate(
          addMonthsToDate(new Date(this.paidToDate).getTime(), this.selectedSubscriptionPaymentOption.value));
      },
      paidToDateFormatted() {
        return formatOnlyDate(new Date(this.paidToDate).getTime());
      },
    },
    methods: {
      close() {
        this.showPopup = false;
      },
      async extendSubscription() {
          this.$emit('extendSubscriptionRequested', this.selectedSubscriptionPaymentOption.value);
          await sleep(200);
          this.showPopup = false;
      }
    },
  });
</script>