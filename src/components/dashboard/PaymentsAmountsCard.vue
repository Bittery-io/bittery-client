<template>
  <q-card class="shadow-10 bg-grey-2">
    <standard-wallet-info-popup :show="showStandardWalletInfoPopup"></standard-wallet-info-popup>
    <ln-wallet-info-popup :show="showLndWalleInfoPopup" ></ln-wallet-info-popup>
    <q-card-section>
      <div class="row">
        <div class="col-auto">
          <header-qchip :text="`Your payments details [ ${timeframeValue} ]`" icon="mdi-calculator" size="md"></header-qchip>
        </div>
        <div class="col-grow"></div>
        <div class="col-lg-auto col-xs-grow" :class="$q.platform.is.mobile ? 'q-pt-md' : ''">
          <q-select square outlined bg-color="accent" v-model="timeframeValue" :options="timeframes" label="Time frame" dense>
            <template v-slot:prepend>
              <q-icon color="primary" name="mdi-calendar"/>
            </template>
          </q-select>
        </div>
      </div>
    </q-card-section>
    <q-card-section style="padding-top: 0;margin-top:0;">
      <div class="row justify-center">
        <div class="col-auto" :class="$q.platform.is.mobile ? '' : 'q-pa-lg'">
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-icon color="primary" name="mdi-wallet" size="md"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <span :class="isMobile ? 'text-h4': 'text-h2'" id="totalReceivedPaymentsBtc"></span>
                  <span class="text-h4"> BTC </span>
                </q-item-label>
                <q-item-label caption>Total received payments</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div class="col-auto" :class="$q.platform.is.mobile ? '' : 'q-pa-lg'">
          <q-list>
            <q-item :style="isMobile ? '': 'margin: 0; padding: 0;'">
              <q-item-section>
                <q-item-label>
                  <span :class="isMobile ? 'text-h6': 'text-h5'" class="vertical-middle" id="totalReceivedPaymentsStandardWalletBtc"></span>
                  <span class="text-subtitle2"> BTC </span>
                  <q-chip outline color="primary" text-color="white" square
                          icon="mdi-wallet" icon-right="mdi-bitcoin" clickable @click="showStandardWalletInfoPopup = !showStandardWalletInfoPopup">
                    Standard wallet
                  </q-chip>
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item :style="isMobile ? '': 'margin: 0; padding: 0;'">
              <q-item-section>
                <q-item-label>
                  <span :class="isMobile ? 'text-h6': 'text-h5'" class="vertical-middle" id="totalReceivedPaymentsLnNodeWalletBtc"></span>
                  <span class="text-subtitle2"> BTC </span>
                  <q-chip outline color="primary" text-color="white" square
                          icon="mdi-wallet" icon-right="mdi-flash" clickable @click="showLndWalleInfoPopup = !showLndWalleInfoPopup">
                    LN Node wallet
                  </q-chip>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div class="col-grow"></div>

        <div class="col-auto justify-center" :class="$q.platform.is.mobile ? 'q-pt-xs' : ''">
          <q-list dense separator class="vertical-align">
            <statistic-item
              icon="mdi-cash-plus"
              :value="`${dashboardInfo.totalInvoicedAmountBtc.toFixed(8)} BTC`"
              caption="Invoiced amounts">
            </statistic-item>
            <statistic-item
              icon="mdi-cash-plus"
              icon-color="orange"
              :value="`${dashboardInfo.newInvoicedAmountBtc.toFixed(8)} BTC`"
              caption="New">
            </statistic-item>
            <statistic-item
              icon="mdi-cash-plus"
              icon-color="green"
              :value="`${dashboardInfo.paidInvoicedAmountBtc.toFixed(8)} BTC`"
              caption="Paid">
            </statistic-item>
            <statistic-item
              icon="mdi-cash-plus"
              icon-color="grey"
              :value="`${dashboardInfo.expiredInvoicedAmountBtc.toFixed(8)} BTC`"
              caption="Expired">
            </statistic-item>
          </q-list>
        </div>
        <div class="col-auto justify-center">
          <q-list dense separator class="vertical-align">
            <statistic-item
              icon="mdi-file-plus"
              :value="`${dashboardInfo.invoicesQuantity}`"
              caption="Total invoices">
            </statistic-item>
            <statistic-item
              icon="mdi-file-plus"
              icon-color="orange"
              :value="`${dashboardInfo.newInvoicesQuantity}`"
              caption="New">
            </statistic-item>
            <statistic-item
              icon="mdi-file-plus"
              icon-color="green"
              :value="`${dashboardInfo.paidInvoicesQuantity}`"
              caption="Paid">
            </statistic-item>
            <statistic-item
              icon="mdi-file-plus"
              icon-color="grey"
              :value="`${dashboardInfo.expiredInvoicesQuantity}`"
              caption="Expired">
            </statistic-item>
          </q-list>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import GlobalMixin from "../../mixins/global-mixin";
import QrCode from 'components/utils/QrCode.vue';
import HeaderQchip from 'components/utils/HeaderQchip.vue';
import { CountUp } from 'countup.js';
import StatisticItem from 'components/dashboard/StatisticItem.vue';
import StandardWalletInfoPopup from 'components/dashboard/StandardWalletInfoPopup.vue';
import LnWalletInfoPopup from 'components/dashboard/LnWalletInfoPopup.vue';

export default GlobalMixin.extend({
  components: { LnWalletInfoPopup, StandardWalletInfoPopup, QrCode, HeaderQchip, StatisticItem },
  name: 'PaymentsAmountsCard',
  props: {
    timeframe: {
      type: String,
      required: true,
    },
    timeframes: {
      type: Array,
      required: true,
    },
    dashboardInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showStandardWalletInfoPopup: false,
      showLndWalleInfoPopup: false,
      timeframeValue: ''
    };
  },
  async mounted() {
    console.log(this.dashboardInfo);
    await this.sleep(200); // small sleep required
    this.timeframeValue = this.timeframe;
    const countUp = new CountUp('totalReceivedPaymentsBtc', this.dashboardInfo.totalReceivedPaymentsBtc, {
      decimalPlaces: 8,
    });
    const countUp2 = new CountUp('totalReceivedPaymentsStandardWalletBtc', this.dashboardInfo.totalReceivedViaTransactions, {
      decimalPlaces: 8,
    });
    const countUp3 = new CountUp('totalReceivedPaymentsLnNodeWalletBtc', this.dashboardInfo.totalReceivedViaLightning, {
      decimalPlaces: 8,
    });

    if (!countUp.error && !countUp2.error && !countUp3.error) {
      countUp.start();
      countUp2.start();
      countUp3.start();
    } else {
      console.error(countUp.error);
    }
  },
  watch: {
    timeframeValue() {
      this.$emit('timeframeChangedEvent', this.timeframeValue);
    },
  },
});

</script>
