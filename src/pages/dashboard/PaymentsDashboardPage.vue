<template>
  <q-page>
    <loader :show="showLoading"></loader>
    <div class="row">
      <div class="col-lg-12 col-xs-grow">
        <payments-amounts-card :timeframe="timeframe" :timeframes="timeframes"
                               :dashboard-info="dashboardInfoDto"
                               v-if="dashboardInfoDto"
                               @timeframeChangedEvent="onTimeframeChangedEvent"></payments-amounts-card>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-5 col-xs-grow">
        <payments-history-chart :timeframe="timeframe" :dashboard-info="dashboardInfoDto" v-if="dashboardInfoDto"></payments-history-chart>
      </div>
      <div class="col-lg-7 col-xs-grow">
        <invoices-distribution-chart :timeframe="timeframe" :dashboard-info="dashboardInfoDto" v-if="dashboardInfoDto"></invoices-distribution-chart>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 col-xs-grow">
        <invoices-table :timeframe="timeframe"
                        :dashboard-info="dashboardInfoDto" v-if="dashboardInfoDto"></invoices-table>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">

import { get } from 'src/api/http-service';
import GlobalMixin from "../../mixins/global-mixin";
import Loader from 'components/utils/Loader.vue';
import PaymentsAmountsCard from 'components/dashboard/PaymentsAmountsCard.vue';
import PaymentsHistoryChart from 'components/dashboard/PaymentsHistoryChart.vue';
import InvoicesDistributionChart from 'components/dashboard/InvoicesDistributionChart.vue';
import InvoicesTable from 'components/dashboard/InvoicesTable.vue';

export default GlobalMixin.extend({
  name: 'PaymentsDashboardPage',
  components: { PaymentsAmountsCard, PaymentsHistoryChart, InvoicesDistributionChart, InvoicesTable, Loader },
  data() {
    return {
      timeframe: 'Last 30 days',
      timeframes: ['Last 30 days'],
      dashboardInfoDto: undefined,
    };
  },
  mounted() {
    this.showLoading = true;
    get(this.$axios, '/api/dashboard', async (res: any) => {
      await this.sleep(200); // small sleep required
      this.showLoading = false;
      this.dashboardInfoDto = res.data;
    }, (err: any) => {
      this.showLoading = false;
      console.log(err);
    });
  },
  methods: {
    onTimeframeChangedEvent(newTimeframe) {
      this.timeframe = newTimeframe;
    }
  }
});
</script>
