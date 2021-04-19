<template>
  <q-card class="shadow-10 bg-grey-2">
    <q-card-section>
      <header-qchip :text="`All invoices [${timeframe}]`" icon="mdi-chart-timeline" size="md"></header-qchip>
    </q-card-section>
    <q-card-section style="padding-top: 0;margin-top:0;">
      <apexchart height="200" :options="chartOptions" :series="series" style="padding: 0 !important; margin: 0 !important;"></apexchart>
    </q-card-section>
  </q-card>
</template>
<script>
import GlobalMixin from '../../mixins/global-mixin';
import Loader from '../utils/Loader';
import HeaderQchip from '../utils/HeaderQchip';

export default GlobalMixin.extend({
  components: { Loader, HeaderQchip },
  name: 'PaymentsHistoryChart',
  props: {
    timeframe: {
      type: String,
      required: true,
    },
    dashboardInfo: {
      type: Object,
      required: true,
    },
  },
  data: function() {
    return {
      chartOptions: {
        chart: {
          id: 'invoices-distribution-chart',
          type: 'bar',
        },
        colors: ['#FF9800', '#4CAF50', '#9E9E9E'],
        yaxis: {
          title: {
            text: 'All invoices',
          },
          labels: {
            formatter: (value) => { return value.toFixed(0) },
          },
        },
        xaxis: {
          categories: this.dashboardInfo.timeframes,
          labels: {
            show: false,
          },
          title: {
            text: this.timeframe
          },
        },
        dataLabels: {
          style: {
            fontSize: '11px',
            fontWeight: 'bold',
            colors: ['#001f10']
          },
          formatter: function (val, opts) {
            if (val > 0) {
              return val;
            } else {
              return '';
            }
          },
        },
        tooltip: {
          theme: true,
          enabled: true,
        },
      },
      series: [
        {
          name: 'New invoices',
          data: this.dashboardInfo.newInvoicesQuantityTimeframesValues
        },
        {
          name: 'Paid invoices',
          data: this.dashboardInfo.paidInvoicesQuantityTimeframesValues
        },
        {
          name: 'Expired invoices',
          data: this.dashboardInfo.expiredInvoicesQuantityTimeframesValues
        }],
    }
  },
});
</script>
