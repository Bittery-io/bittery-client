<template>
  <q-page>
    <loader :show="showLoading"></loader>
    <div class="row">
      <div class="col-lg-12 col-xs-grow">
        <payments-amounts-card :timeframe="timeframe" :timeframes="timeframes"
                               :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'"
                               :dashboard-info="dashboardInfoDto"
                               v-if="dashboardInfoDto"
                               @timeframeChangedEvent="onTimeframeChangedEvent"></payments-amounts-card>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-5 col-xs-grow">
        <payments-history-chart
          :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ml-md q-mr-xs'"
          :timeframe="timeframe" :dashboard-info="dashboardInfoDto" v-if="dashboardInfoDto"></payments-history-chart>
      </div>
      <div class="col-lg-7 col-xs-grow">
        <invoices-distribution-chart
          :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ml-xs q-mr-md'"
          :timeframe="timeframe" :dashboard-info="dashboardInfoDto"
          v-if="dashboardInfoDto"></invoices-distribution-chart>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 col-xs-grow">
        <invoices-table
          :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'"
          :timeframe="timeframe" :dashboard-info="dashboardInfoDto" v-if="dashboardInfoDto"></invoices-table>
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
    onTimeframeChangedEvent(newTimeframe: any) {
      this.timeframe = newTimeframe;
    }
  }
});
</script>
