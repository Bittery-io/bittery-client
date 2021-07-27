<template>
  <q-card class="shadow-10 bg-grey-2" v-if="this.subscriptionDto">
    <loader :show="showLoading"></loader>
    <subscription-pay-popup :show="showSubscriptionPayPopup"
                            :subscription-dto="subscriptionDto"
                            @extendSubscriptionRequested="onExtendSubscriptionRequested">
    </subscription-pay-popup>
    <q-card-section>
      <header-qchip text="Your Bittery subscription" icon="mdi-flash"></header-qchip>
    </q-card-section>
    <q-card-section>
      <div class="row" v-if="subscriptionRemainingDays <= 7 && subscriptionDto.subscriptionPlan !== 'FREE' && !isSubscriptionExpired">
        <div class="col-12">
          <warning-info-banner
            :icon-flash="true"
            class="q-mt-xs"
            :text="`Your subscription will end at ${subscriptionEndDate} (${subscriptionRemainingDays} days left). Extend your subscription in order to remain Bittery services active.`">
          </warning-info-banner>
        </div>
      </div>

      <div class="row" v-if="subscriptionDto.subscriptionPlan !== 'FREE' && isSubscriptionExpired">
        <div class="col-12">
          <warning-info-banner
            class="q-mt-xs"
            :text="`Your subscription is expired. Renew your subscription in order to use Bittery services.`">
          </warning-info-banner>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <q-field dense label="Subscription status" stack-label borderless>
            <q-chip :color="isSubscriptionExpired ? 'red-8' : 'primary'"
                    dense
                    class="text-subtitle2"
                    square
                    style="margin-left: 0;"
                    text-color="white">
              {{subscriptionDto.subscriptionStatus}}
            </q-chip>
            <template v-slot:before>
              <q-icon style="width:50px;padding-top:20%" color="primary" name="mdi-calendar"/>
            </template>
            <q-tooltip>
              Your Bittery subscription status
            </q-tooltip>
          </q-field>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <q-field dense label="Subscription plan" stack-label borderless>
            <q-chip dense square color="primary"  class="" style="margin-left: 0;" text-color="white">
              {{subscriptionDto.subscriptionPlan}}
            </q-chip>
            <q-chip dense square color="primary" class="text-subtitle2" outline style="margin-left: 0;" text-color="white">
              {{Number(subscriptionDto.monthlyPrice).toFixed(2)}} USD / month
            </q-chip>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-order-bool-descending"/>
            </template>
            <q-tooltip>
              Your active Bittery subscription plan
            </q-tooltip>
          </q-field>
        </div>
      </div>
      <div class="row" v-if="subscriptionDto.subscriptionPlan !== 'FREE' && !isSubscriptionExpired">
        <div class="col-12">
          <q-field dense label="Active to" stack-label borderless>
            <q-chip color="red-8"
                    class="text-subtitle2"
                    square
                    dense
                    style="margin-left: 0;"
                    text-color="white">
              {{ subscriptionEndDate }}
            </q-chip>
            <q-chip color="red-8"
                    square
                    class="text-subtitle2"
                    outline
                    dense
                    text-color="white">
              {{ subscriptionRemainingDays }} days left
            </q-chip>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-calendar"/>
            </template>
            <q-tooltip>
              Your Bittery active subscription remaining time
            </q-tooltip>
          </q-field>
        </div>
      </div>

      <div class="row justify-end" v-if="subscriptionDto.subscriptionPlan !== 'FREE'">
        <div class="col-auto justify-end">
          <q-field readonly borderless label="" stack-label>
            <q-btn
              :label="isSubscriptionExpired ? 'Renew subscription' : 'Extend subscription'"
              color="primary"
              icon="mdi-bitcoin"
              @click="showSubscriptionPayPopup = !showSubscriptionPayPopup"/>
          </q-field>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import GlobalMixin from "../../mixins/global-mixin";
import QrCode from 'components/utils/QrCode.vue';
import { get, post } from 'src/api/http-service';
import { showNotificationError, showNotificationInfo } from 'src/api/notificatios-api';
import LndFormMixin from 'components/lnd/mixins/lnd-form-mixin';
import QrCodePopup from 'components/utils/QrCodePopup.vue';
import HeaderQchip from 'components/utils/HeaderQchip.vue';
import ConfirmLndRestartPopup from 'components/lnd/ConfirmLndRestartPopup.vue';
import Loader from 'components/utils/Loader.vue';
import { sleep } from 'src/api/sleep-service';
import ProvideMasterPasswordPopup from 'components/welcome/ProvideMasterPasswordPopup.vue';
import { decryptSymmetricCtr } from 'src/api/encryption-service';
import sha256 from 'js-sha256';
import { formatDate, formatOnlyDate, getDaysBetweenTwoDates, isDateExpired } from 'src/api/date-service';
import SubscriptionPayPopup from 'components/account/SubscriptionPayPopup.vue';
import WarningInfoBanner from 'components/utils/WarningInfoBanner.vue';

export default GlobalMixin.extend({
  components: { WarningInfoBanner, SubscriptionPayPopup, ProvideMasterPasswordPopup, QrCode, QrCodePopup, HeaderQchip, ConfirmLndRestartPopup, Loader },
  name: 'YourSubscriptionForm',
  mixins: [LndFormMixin],
  data() {
    return {
      isPwd: true,
      showSubscriptionPayPopup: true,
      requestLndButtonDisabled: false,
      showConfirmLndRestartPopup: false,
      subscriptionDto: undefined,
    };
  },
  computed: {
    subscriptionEndDate() {
      return formatDate(this.subscriptionDto.paidToDate);
    },
    isSubscriptionExpired() {
      return isDateExpired(this.subscriptionDto.paidToDate);
    },
    subscriptionRemainingDays() {
      return getDaysBetweenTwoDates(this.subscriptionDto.paidToDate, new Date().getTime());
    }
  },
  mounted() {
    this.showSubscriptionPayPopup = false;
    get(this.$axios, '/api/account/subscription', (res: any) => {
      this.showLoading = false;
      this.subscriptionDto = res.data;
      console.log(this.subscriptionDto);
      console.log(this.subscriptionDto);
    }, async (err: any) => {
      console.log('Getting account subscription failed!', err);
    });
  },
  methods: {
    onExtendSubscriptionRequested(subscriptionTimeMonths: number) {
      this.showLoading = true;
      post(this.$axios, `/api/account/subscription`, { subscriptionTimeMonths }, async (res: any) => {
        showNotificationInfo('Subscription renewal requested successfully', 'Please proceed with Bitcoin payment')
        await sleep(500);
        this.showLoading = false;
        console.log(res);
        await sleep(100);
        this.$router.push(`/invoices/${res.data.invoiceId}`);
      }, async () => {
        showNotificationError('Subscription renewal failed', 'Probably subscription is already expired');
        await sleep(100);
        this.showLoading = false;
      });
    }
  },
});

</script>
