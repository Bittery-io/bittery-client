<template>
  <q-card class="shadow-10 bg-grey-2">
    <q-card-section>
      <header-qchip :text="`Received payments [ ${timeframe} ]`"
                    icon="mdi-chart-timeline-variant" size="md"></header-qchip>
    </q-card-section>
    <q-card-section style="padding-top: 0;margin-top:0;">
      <apexchart height="220" :options="chartOptions" :series="series"></apexchart>
    </q-card-section>
  </q-card>
</template>
<script>
import GlobalMixin from '../../mixins/global-mixin';
import Loader from '../utils/Loader';
import HeaderQchip from '../utils/HeaderQchip';

export default GlobalMixin.extend({
  components: { Loader, HeaderQchip },
  name: 'InvoicesDistributionChart',
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
          id: 'payments-history-chart',
          type: 'area',
        },
        colors: ['#001f10'],
        yaxis: {
          title: {
            text: 'Received payments [BTC]',
          },
          labels: {
            show: false,
          },
        },
        tooltip: {
          theme: true,
          enabled: true,
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
          enabled: true,
          style: {
            fontSize: '11px',
            fontWeight: 'bold',
          },
          background: {
            enabled: true,
            borderWidth: 0,
            borderRadius: 5,
          },
          formatter: function (val, opts) {
            if (val > 0) {
              return val.toFixed(8);
            } else {
              return '';
            }
          },
        },
        grid: {
          show: false,
        }
      },
      series: [{
        name: 'Received payment [BTC]',
        data: this.dashboardInfo.paidInvoicesAmountTimeframesValues.map(_ => _.toFixed(8)),
      }]
    }
  },
});
</script>
