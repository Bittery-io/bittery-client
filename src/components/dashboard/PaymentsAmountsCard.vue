<template>
  <q-card class="shadow-10 bg-grey-2">
    <standard-wallet-info-popup :show="showStandardWalletInfoPopup"></standard-wallet-info-popup>
    <ln-wallet-info-popup :show="showLndWalleInfoPopup" ></ln-wallet-info-popup>
    <q-card-section>
      <div class="row items-center">
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
      <div class="row justify-center items-center">
        <div class="col-auto" :class="$q.platform.is.mobile ? '' : 'q-pt-lg q-pb-lg'">
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-icon color="primary" name="mdi-wallet" size="md"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <span :class="isMobile ? 'text-h4': 'text-h2'" id="totalPaidInUsd"></span>
                  <span :class="isMobile ? 'text-h5': 'text-h4'"> BTC</span><br>
                  <div class="row items-baseline">
                    <div class="col-auto q-pl-xs" v-if="totalPaidInUsd === ''">
                      <q-skeleton type="text" width="40px" bordered/>
                    </div>
                    <div class="col-auto" v-else>
                      <span :class="isMobile ? 'text-h6': 'text-h5'">{{ totalPaidInUsd }}</span>
                    </div>
                    <div class="col-auto q-pl-xs">
                      <span class="text-bold">at current Bitcoin Price:</span>
                    </div>
                    <div class="col-auto q-pl-xs" v-if="totalPaidInUsd === ''">
                      <q-skeleton type="text" width="40px" bordered/>
                    </div>
                    <div class="col-auto q-pl-xs" v-else>
                      <span class="text-bold">{{currentBitcoinUsdPrice}}</span>
                    </div>
                    <div class="col-auto" :class="isMobile ? '' : 'q-pl-xs'">
                      <span class="text-bold">(Coingecko)</span>
                    </div>
                  </div>
                </q-item-label>
                <q-item-label caption>Total received payments</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div class="col-auto justify-center" :class="$q.platform.is.mobile ? 'q-pt-xs' : ''">
          <q-list dense separator>
            <q-item>
              <q-item-section avatar>
                <q-icon color="orange-8" name="mdi-bitcoin" size="md"/>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subtitle2">
                  <span :class="isMobile ? 'text-h6': 'text-h5'" class="vertical-middle" id="totalPaidInUsdTransactions"></span> BTC
                  <br>
                  <div class="col-auto" v-if="totalPaidInUsdTransactions === ''">
                    <q-skeleton type="text" width="40px" bordered/>
                  </div>
                  <span class="text-bold" v-else>{{ totalPaidInUsdTransactions }}</span>
                </q-item-label>
                <q-item-label caption>Standard wallet</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-icon color="yellow-7" name="mdi-flash" size="md"/>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subtitle2">
                  <span :class="isMobile ? 'text-h6': 'text-h5'" class="vertical-middle" id="totalPainInUsdLightning"></span> BTC <br>
                  <div class="col-auto" v-if="totalPainInUsdLightning === ''">
                    <q-skeleton type="text" width="40px" bordered/>
                  </div>
                  <span class="text-bold" v-else>{{ totalPainInUsdLightning }}</span>
                </q-item-label>
                <q-item-label caption>LN Node wallet</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div class="col-auto" :class="$q.platform.is.mobile ? 'q-pt-xs' : ''">
          <q-list separator>
            <q-item>
              <q-item-section>
                <q-chip v-if="!isMobile" color="primary" text-color="white" square
                        icon="mdi-wallet" clickable @click="showStandardWalletInfoPopup = !showStandardWalletInfoPopup">
                  Standard wallet
                </q-chip>
                <q-btn  glossy v-else square color="primary" text-color="orange-8" icon="mdi-wallet" @click="showStandardWalletInfoPopup = !showStandardWalletInfoPopup" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-chip v-if="!isMobile" color="primary" text-color="white" square
                        icon="mdi-wallet" clickable @click="showLndWalleInfoPopup = !showLndWalleInfoPopup">
                  LN Node wallet
                </q-chip>
                <q-btn glossy v-else square color="primary"  text-color="yellow-7" icon="mdi-wallet" @click="showLndWalleInfoPopup = !showLndWalleInfoPopup" />
                <q-item-label caption></q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div class="col-grow" v-if="!isMobile"></div>
        <div class="col-auto justify-center" :class="$q.platform.is.mobile ? 'q-pt-lg' : ''">
          <q-list dense separator>
            <statistic-item
              icon="mdi-cash-plus"
              :value="`${dashboardInfo.totalInvoicedAmountBtc.toFixed(8)} BTC`"
              caption="Invoiced amounts">
            </statistic-item>
            <statistic-item
              icon="mdi-cash-plus"
              icon-color="orange-8"
              :value="`${dashboardInfo.newInvoicedAmountBtc.toFixed(8)} BTC`"
              caption="New">
            </statistic-item>
            <statistic-item
              icon="mdi-cash-plus"
              icon-color="green-8"
              :value="`${dashboardInfo.paidInvoicedAmountBtc.toFixed(8)} BTC`"
              caption="Paid">
            </statistic-item>
            <statistic-item
              icon="mdi-cash-plus"
              icon-color="red-8"
              :value="`${dashboardInfo.expiredInvoicedAmountBtc.toFixed(8)} BTC`"
              caption="Expired">
            </statistic-item>
          </q-list>
        </div>
        <div class="col-auto justify-center" :class="$q.platform.is.mobile ? 'q-pt-lg' : ''">
          <q-list dense separator class="">
            <statistic-item
              icon="mdi-file-plus"
              :value="`${dashboardInfo.invoicesQuantity}`"
              caption="Total invoices">
            </statistic-item>
            <statistic-item
              icon="mdi-file-plus"
              icon-color="orange-8"
              :value="`${dashboardInfo.newInvoicesQuantity}`"
              caption="New">
            </statistic-item>
            <statistic-item
              icon="mdi-file-plus"
              icon-color="green-8"
              :value="`${dashboardInfo.paidInvoicesQuantity}`"
              caption="Paid">
            </statistic-item>
            <statistic-item
              icon="mdi-file-plus"
              icon-color="red-8"
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
import { get } from 'src/api/http-service';

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
      timeframeValue: '',
      totalPaidInUsd: '',
      totalPainInUsdLightning: '',
      totalPaidInUsdTransactions: '',
      currentBitcoinUsdPrice: '',
      usdFormatter: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }),
    };
  },
  async mounted() {
    this.usdFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    // it is the same copied in createInvoiceFormCard so fix it to 1 place
    get(this.$axios, 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_last_updated_at=true', (res: any) => {
      const currentPriceInUsd: number = res.data.bitcoin.usd;
      if (currentPriceInUsd) {
        this.currentBitcoinUsdPrice = this.usdFormatter.format(currentPriceInUsd);
        this.totalPaidInUsd = this.usdFormatter.format(currentPriceInUsd * this.dashboardInfo.paidInvoicedAmountBtc);
        this.totalPainInUsdLightning = this.usdFormatter.format(currentPriceInUsd * this.dashboardInfo.totalReceivedViaLightning);
        this.totalPaidInUsdTransactions = this.usdFormatter.format(currentPriceInUsd * this.dashboardInfo.totalReceivedViaTransactions);
      }
    }, () => {});
    await this.sleep(200); // small sleep required
    this.timeframeValue = this.timeframe;
    const countUp = new CountUp('totalPaidInUsd', this.dashboardInfo.paidInvoicedAmountBtc, {
      decimalPlaces: 8,
    });
    const countUp2 = new CountUp('totalPaidInUsdTransactions', this.dashboardInfo.totalReceivedViaTransactions, {
      decimalPlaces: 8,
    });
    const countUp3 = new CountUp('totalPainInUsdLightning', this.dashboardInfo.totalReceivedViaLightning, {
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
